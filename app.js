const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json()); //parse incoming request body in JSON format.

// routes
const url = require("./routes/url");
const redirect = require("./routes/redirect");

app.use("/api/v0/url/shorten", url);
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

module.exports = app;
