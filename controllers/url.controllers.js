const validUrl = require("valid-url");
const shortid = require("shortid");
const { BASE_URL } = require("../config/config");
const { BadRequestError } = require("../errors");

const urlModel = require("../models/url.model");

const baseUrl = BASE_URL;

const sendUrl = async (req, res) => {
  const { longUrl, custom } = req.body;

  if (!validUrl.isUri(baseUrl)) throw new BadRequestError("Invalid base URL");

  const urlCode = shortid.generate();

  if (!validUrl.isUri(longUrl)) throw new BadRequestError("Invalid long URL");

  let url = await urlModel.findOne({
    longUrl,
  });

  if (url)
    return res.json({ status: true, message: "ShortURL already created", url });
  let customUrl = null;

  const shortUrl = baseUrl + "/" + urlCode;
  if (custom) {
    customUrl = baseUrl + "/" + custom;
  }
  url = new urlModel({
    urlCode,
    custom,
    longUrl,
    shortUrl,
    customUrl,
  });
  await url.save();
  res.status(201).json({
    status: true,
    message: "ShortURL created successfully",
    url,
  });
};

module.exports = { sendUrl };
