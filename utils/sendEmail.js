const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, NODE_ENV } = require("../config/config");

let sendMail;

if (NODE_ENV === "development") {
  sendMail = async (mail) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);
    return transporter.sendMail(mail);
  };
}

if (NODE_ENV === "production") {
  sendMail = async (mail) => {
    sgMail.setApiKey(SENDGRID_API_KEY);
    return sgMail.send(mail);
  };
}

module.exports = sendMail;
