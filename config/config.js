require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI:
    process.env.NODE_ENV === "development"
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_LIFETIME: process.env.JWT_LIFETIME,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  MAXLIMIT: process.env.MAXLIMIT,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_FROM:
    process.env.NODE_ENV === "development"
      ? process.env.NODEMAILER_TEST_FROM
      : process.env.NODEMAILER_FROM,
  ORIGIN: process.env.ORIGIN,
  BASE_URL: process.env.BASE_URL,
  REDIS_USERNAME: process.env.REDIS_USERNAME || "default",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
};

module.exports = config;
