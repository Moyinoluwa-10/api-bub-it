const CustomError = require("../errors");
const Token = require("../models/token.models");
const { attachCookiesToResponse, isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  // console.log(refreshToken, accessToken);

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);
    console.log(payload);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const optionalAuthentication = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  if (accessToken || refreshToken) {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);
    console.log(payload);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    console.log(existingToken);
    console.log(existingToken?.isValid);

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid 1");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  }
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
  optionalAuthentication,
};

