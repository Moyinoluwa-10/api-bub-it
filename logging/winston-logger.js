const winston = require("winston");

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// const { combine, timestamp, label, prettyPrint } = winston.format;
const logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
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
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
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
  logger.add(
    // new winston.transports.Console()
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
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
