// access the values in the .env file

require("dotenv").config();

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
  BASE_URL,
};
