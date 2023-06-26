require("express-async-errors");

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

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");
const redirectRoute = require("./routes/redirect.routes");
const { NODE_ENV } = require("./config/config");

// middlewares
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("api/v1", limiter);
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://bub-it.vercel.app"],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: ["https://www.bub.icu", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
// app.use(express.static("./public"));
app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   return res.json({
//     status: true,
//     message: "Welcome to shortener",
//   });
// });

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/urls", urlRoutes);
app.use("/api/v1/users", userRoutes);
// app.use("/", redirectRoute);

// other middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
