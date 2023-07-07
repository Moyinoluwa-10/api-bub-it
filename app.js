require("express-async-errors");
const { NODE_ENV } = require("./config/config");

// express
const express = require("express");
const app = express();

// other packages
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const limiter = require("./middlewares/rateLimiter");
const cookieParser = require("cookie-parser");
const path = require("path");

// middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./logging/winston-logger");
const httpLogger = require("./logging/httpLogger");

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");
const redirectRoutes = require("./routes/redirect.routes");

// middlewares
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("api/v1", limiter);
app.use(
  cors({
    origin: [
      "https://www.bub.icu",
      "https://bub.icu",
      "http://localhost:5173",
      "https://bub-it.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));
app.use(httpLogger);

app.get("/", (req, res) => {
  res.send('<h1>Bub API</h1><a href="/api-docs">Documentation</a>');
});

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "api.html"));
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/urls", urlRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/", redirectRoutes);

// other middlewares
app.use(notFound);
app.use(errorHandler);

logger.info("App started");
logger.error("App started");
logger.debug("App started");

module.exports = app;
