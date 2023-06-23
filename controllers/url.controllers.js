const validUrl = require("valid-url");
const shortid = require("shortid");
const { BASE_URL } = require("../config/config");
const { BadRequestError } = require("../errors");
var QRCode = require("qrcode");
const { checkPermissions } = require("../utils");

const urlModel = require("../models/url.model");

const baseUrl = BASE_URL;

const createUrl = async (req, res) => {
  const { longUrl, custom } = req.body;

  if (!validUrl.isUri(baseUrl)) throw new BadRequestError("Invalid base URL");

  const urlCode = shortid.generate();

  if (!validUrl.isUri(longUrl)) throw new BadRequestError("Invalid long URL");

  let url = await urlModel.findOne({
    longUrl,
    user: req.user.userId,
  });

  if (url)
    return res.json({ status: true, message: "ShortURL already created", url });
  let customUrl = null;

  const qrcode = await QRCode.toDataURL(longUrl);

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
    qrcode,
    user: req.user.userId,
  });
  await url.save();
  res.status(201).json({
    status: true,
    message: "ShortURL created successfully",
    url,
  });
};

const getAllUrls = async (req, res) => {
  const urls = await urlModel.find();
  res.status(200).json({
    status: true,
    message: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const getAUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  console.log(url);
  checkPermissions(req.user, url.user);
  res.status(200).json({
    status: true,
    message: "ShortURL fetched successfully",
    url,
  });
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  await url.remove();
  res.status(200).json({
    status: true,
    message: "ShortURL deleted successfully",
  });
};

const getUserUrls = async (req, res) => {
  const urls = await urlModel.find({ user: req.user.userId });
  res.status(200).json({
    status: true,
    message: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

module.exports = { createUrl, getAllUrls, getAUrl, deleteUrl, getUserUrls };
