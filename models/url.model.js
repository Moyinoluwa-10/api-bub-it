const mongoose = require("mongoose");

// instantiate a mongoose schema
const URLSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    qrcode: String,
    shortUrl: {
      type: String,
      required: true,
    },
    custom: String,
    customUrl: String,
    noOfClicks: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    analytics: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// create a model from schema and export it
module.exports = mongoose.model("url", URLSchema);
