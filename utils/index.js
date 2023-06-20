const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const checkPermissions = require("./checkPermissions");
const createHash = require("./createHash");
const createTokenUser = require("./createTokenUser");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const sendVerificationEmail = require("./sendVerificationEmail");

module.exports = {
  attachCookiesToResponse,
  checkPermissions,
  createHash,
  createJWT,
  createTokenUser,
  isTokenValid,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
