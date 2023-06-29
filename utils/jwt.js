const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = require("../config/config");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMinute = 1000 * 60;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + oneMinute),
    sameSite: "lax",
    domain: ".bub.icu",
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + longerExp),
    sameSite: "lax",
    domain: ".bub.icu",
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

