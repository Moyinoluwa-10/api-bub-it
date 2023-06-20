const { NODEMAILER_FROM } = require("../config/config");
const sendEmail = require("./sendEmail");

const mail = {
  from: NODEMAILER_FROM,
  subject: "Verify Email",
};

const sendVerificationEmail = async ({ name, email, token, origin }) => {
  const verificationLink = `${origin}/user/verify-email?token=${token}&email=${email}`;
  const message = `<p>${token}</p><p>Please verify your email by clicking on the following link : 
  <a href="${verificationLink}">Verify Email</a></p>`;

  mail.to = email;
  mail.html = `<h4>Hello, ${name}</h4>
  ${message}`;
  return sendEmail(mail);
};

module.exports = sendVerificationEmail;
