const validUrl = require("valid-url");
const shortid = require("shortid");
const { BASE_URL } = require("../config/config");
const { BadRequestError } = require("../errors");
var QRCode = require("qrcode");
const { checkPermissions } = require("../utils");

const urlModel = require("../models/url.model");

const baseUrl = BASE_URL;
const Cache = require("../cache/redis");

const createUrl = async (req, res) => {
  const { longUrl, custom } = req.body;

  if (!validUrl.isUri(baseUrl)) throw new BadRequestError("Invalid base URL");

  const urlCode = shortid.generate();

  if (!validUrl.isUri(longUrl)) throw new BadRequestError("Invalid long URL");

  console.log(req.user);

  let url = await urlModel.findOne({
    longUrl,
    user: req.user.userId,
  });

  if (url) return res.json({ msg: "ShortURL already created", url });
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
    msg: "ShortURL created successfully",
    url,
  });
};

const getAllUrls = async (req, res) => {
  // const cachedUrls = await Cache.redis.get("urls");
  // if (cachedUrls) {
  //   console.log("Cache hit");
  //   return res.status(200).json({
  //     msg: "All shortURLs fetched successfully",
  //     urls: JSON.parse(cachedUrls),
  //     count: JSON.parse(cachedUrls).length,
  //   });
  // }
  // console.log("Cache miss");

  const urls = await urlModel.find();

  // await Cache.redis.set("urls", JSON.stringify(urls));
  res.status(200).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const getAUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  res.status(200).json({
    msg: "ShortURL fetched successfully",
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
    msg: "ShortURL deleted successfully",
  });
};

const getUserUrls = async (req, res) => {
  const urls = await urlModel.find({ user: req.user.userId });
  res.status(200).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const redirectUrl = async (req, res) => {
  const { urlCode } = req.params;
  const url = await urlModel.findOne({ urlCode });
  if (!url) throw new BadRequestError("ShortURL not found");
  const analytics = {
    ip: req.ip,
    browser: req.headers["user-agent"],
    date: new Date(),
  };

  url.analytics.unshift(analytics);
  url.noOfClicks = url.noOfClicks + 1;
  await url.save();
  res.status(200).json({ msg: "redirected", url: url.longUrl });
};

module.exports = {
  createUrl,
  getAllUrls,
  getAUrl,
  deleteUrl,
  getUserUrls,
  redirectUrl,
};
