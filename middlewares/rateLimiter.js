const rateLimit = require("express-rate-limit");
const { MAXLIMIT } = require("../config/config");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: MAXLIMIT,
  message: {
    msg: "Too many accounts created from this IP, please try again after an 15mins",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
