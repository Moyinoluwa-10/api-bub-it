const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASS,
} = require("../config/config");

module.exports = {
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
};

