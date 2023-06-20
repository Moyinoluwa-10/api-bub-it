const { NODEMAILER_FROM } = require("../config/config");
const sendEmail = require("./sendEmail");

const mail = {
  from: NODEMAILER_FROM,
  subject: "Reset Password",
};

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Here is your verification code ${token}</p><br /<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  mail.to = email;
  mail.html = `<h4>Hello, ${name}</h4>
  ${message}`;
  return sendEmail(mail);
};

module.exports = sendResetPasswordEmail;
