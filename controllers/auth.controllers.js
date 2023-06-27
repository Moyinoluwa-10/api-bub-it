const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.models");
const Token = require("../models/token.models");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const {
  attachCookiesToResponse,
  createHash,
  createTokenUser,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("../utils");
const { ORIGIN } = require("../config/config");
const crypto = require("crypto");

const signup = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError("Email already exists");
  }
  const verificationToken = crypto.randomBytes(70).toString("hex");
  req.body.verificationToken = verificationToken;
  const origin = req.headers.origin;

  const user = await User.create(req.body);

  await sendVerificationEmail({
    name: user.firstName,
    email: user.email,
    token: verificationToken,
    origin,
  });

  return res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Incorrect email or password");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError("Incorrect email or password");
  }
  if (!user.isVerified) {
    throw new BadRequestError("Please verify your email");
  }

  const tokenUser = await createTokenUser(user);

  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({
      msg: "User logged in successfully",
      user: tokenUser,
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"] | "hello";
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  return res.status(StatusCodes.OK).json({
    msg: "User logged in successfully",
    user: tokenUser,
  });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  console.log(email, verificationToken);
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }
  if (user.isVerified) {
    return res.status(StatusCodes.OK).json({
      msg: "Email verified successfully",
    });
  }

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = null;
  await user.save();

  return res.status(StatusCodes.OK).json({
    msg: "Email verified successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Invalid email");
  }
  const user = await User.findOne({ email });
  if (user) {
    const verificationToken = crypto.randomBytes(70).toString("hex");
    const origin = req.headers.origin;
    await sendResetPasswordEmail({
      name: user.firstName,
      email: user.email,
      token: verificationToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = createHash(verificationToken.toString());
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  return res.status(StatusCodes.OK).json({
    msg: "Password reset email sent successfully",
  });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token.toString()) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  return res.status(StatusCodes.OK).json({
    msg: "Password reset successfully",
  });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "none",
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "none",
  });

  return res.status(StatusCodes.OK).json({
    msg: "User logged out successfully",
  });
};

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
};
