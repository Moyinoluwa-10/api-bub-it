const mongoose = require("mongoose");

// instantiate a mongoose schema
const URLSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

// create a model from schema and export it
module.exports = mongoose.model("url", URLSchema);
