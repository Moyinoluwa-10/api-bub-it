const winston = require("winston");

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

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

// const { combine, timestamp, label, prettyPrint } = winston.format;
const logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
  // format: combine(winston.format.json()),
  format: combine(winston.format.colorize(), winston.format.json()),
  // format: combine(winston.format.colorize(), label(), timestamp(), myFormat),
  // format: combine(
  // winston.format.colorize(),
  //   label(),
  //   timestamp(),
  //   prettyPrint(),
  //   winston.format.colorize()
  // ),
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

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
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
