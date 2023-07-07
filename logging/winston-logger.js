const winston = require("winston");
require("winston-loggly-bulk");
const { combine, timestamp, prettyPrint, ms } = winston.format;

const options = {
  info: {
    level: "info",
    filename: "./logs/error.log",
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  error: {
    level: "info",
    filename: "./logs/combined.log",
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: combine(winston.format.splat(), winston.format.simple()),
  },
};

const logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
  format: combine(winston.format.colorize(), timestamp(), prettyPrint(), ms()),
  defaultMeta: { service: "user-service" },
  transports: [],
  // exceptionHandlers: [
  //   new winston.transports.File({ filename: "logs/exceptions.log" }),
  // ],
  // rejectionHandlers: [
  //   new winston.transports.File({ filename: "logs/rejections.log" }),
  // ],
  exitOnError: false,
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.Loggly({
      level: "debug",
      inputToken: "3448bd64-ea55-4a26-a505-6a24cdae39b5",
      subdomain: "devmo",
      tags: ["bub-it"],
      json: true,
    })
  );
}

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console(options.console));
  logger.add(new winston.transports.File(options.error));
  logger.add(new winston.transports.File(options.info));
}

// querying winston
// const options = {
//   from: new Date() - 24 * 60 * 60 * 1000,
//   until: new Date(),
//   limit: 10,
//   start: 0,
//   order: "desc",
//   fields: ["message"],
// };

//
// Find items logged between today and yesterday.
//
// logger.query(options, function (err, results) {
//   if (err) {
//     /* TODO: handle me */
//     throw err;
//   }

//   console.log(results);
// });

module.exports = logger;
