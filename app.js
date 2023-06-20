require("express-async-errors");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json()); //parse incoming request body in JSON format.

const errorHandler = require("./middlewares/errorHandler");
// routes
const urlRoutes = require("./routes/url.routes");
const redirect = require("./routes/redirect");

app.use("/api/v1/urls/shorten", urlRoutes);
app.use("/", redirect);

app.get("/", (req, res) => {
  return res.json({
    status: true,
    message: "Welcome to shortener",
  });
});

app.get("*", (req, res) => {
  return res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
