const winston = require("winston");
const { combine, timestamp, prettyPrint } = winston.format;

const options = {
  info: {
    level: "info",
    filename: "./logs/error.log",
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  error: {
    level: "info",
    filename: "./logs/combined.log",
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.simple(),
  },
};

const logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
  format: combine(winston.format.colorize(), timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.File(options.info),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console(options.console));
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
