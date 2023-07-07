const morgan = require("morgan");
const json = require("morgan-json");
const logger = require("./winston-logger");

const format = json({
  method: ":method",
  url: ":url",
  status: ":status",
  contentLength: ":res[content-length]",
  responseTime: ":response-time",
  userAgent: ":user-agent",
  referrer: ":referrer",
  remoteAddress: ":remote-addr",
  remoteUser: ":remote-user",
  http: "HTTP/:http-version",
});

const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const {
        method,
        url,
        status,
        contentLength,
        responseTime,
        userAgent,
        referrer,
        remoteAddress,
        remoteUser,
        http,
      } = JSON.parse(message);

      logger.info("HTTP Access Log", {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime),
        userAgent,
        referrer,
        remoteAddress,
        remoteUser,
        http,
      });
    },
  },
});

module.exports = httpLogger;

