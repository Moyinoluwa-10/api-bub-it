const urlModel = require("../models/url.models");
const validUrl = require("valid-url");
const urlExists = require("url-exists-async-await");
const shortid = require("shortid");
var QRCode = require("qrcode");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { checkPermissions } = require("../utils");
const { BASE_URL, NODE_ENV } = require("../config/config");
const Cache = require("../cache/redis");

const createUrl = async (req, res) => {
  const { longUrl, custom } = req.body;
  const baseUrl = BASE_URL;
  if (!validUrl.isUri(baseUrl)) throw new BadRequestError("Invalid base URL");

  const urlExist = await urlExists(longUrl);
  if (!validUrl.isWebUri(longUrl) || !urlExist)
    throw new BadRequestError("Invalid long URL");

  const urlCode = shortid.generate();
  let userId;
  if (req.user) {
    userId = req.user.userId || null;
  }

  let url = await urlModel.findOne({
    longUrl,
    user: userId,
  });

  if (url) return res.json({ msg: "ShortURL already created", url });
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
    user: userId,
  });
  await url.save();
  if (NODE_ENV !== "test") {
    if (req.user) {
      await Cache.redis.del(`url:user:${req.user.userId}`);
    }
    await Cache.redis.del("urls");
  }
  return res.status(StatusCodes.CREATED).json({
    msg: "ShortURL created successfully",
    url,
  });
};

const generateQrcode = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  if (url.qrcode) {
    return res.status(StatusCodes.OK).json({
      msg: "Qrcode already generated",
      qrcode: url.qrcode,
      url,
    });
  }
  const qrcode = await QRCode.toDataURL(url.longUrl);
  url.qrcode = qrcode;
  await url.save();
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx(`url:${id}`, 3600, JSON.stringify(url));
  }
  return res.status(StatusCodes.OK).json({
    msg: "Qrcode generated successfully",
    qrcode: qrcode,
    url,
  });
};

const disableUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  url.active = false;
  await url.save();
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx(`url:${id}`, 3600, JSON.stringify(url));
  }
  return res.status(StatusCodes.OK).json({
    msg: "ShortURL disabled successfully",
    url,
  });
};

const enableUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  url.active = true;
  await url.save();
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx(`url:${id}`, 3600, JSON.stringify(url));
  }
  return res.status(StatusCodes.OK).json({
    msg: "ShortURL enabled successfully",
    url,
  });
};

const getAllUrls = async (req, res) => {
  if (NODE_ENV !== "test") {
    const cachedUrls = await Cache.redis.get("urls");
    if (cachedUrls) {
      // console.log("Cache hit");
      return res.status(StatusCodes.OK).json({
        msg: "All shortURLs fetched successfully",
        urls: JSON.parse(cachedUrls),
        count: JSON.parse(cachedUrls).length,
      });
    }
  }
  // console.log("Cache miss");

  const urls = await urlModel.find().sort("-createdAt");
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx("urls", 3600, JSON.stringify(urls));
  }
  return res.status(StatusCodes.OK).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const getAUrl = async (req, res) => {
  const { id } = req.params;
  if (NODE_ENV !== "test") {
    const cachedUrl = await Cache.redis.get(`url:${id}`);
    if (cachedUrl) {
      // console.log("Cache hit");
      return res.status(StatusCodes.OK).json({
        msg: "ShortURL fetched successfully",
        url: JSON.parse(cachedUrl),
      });
    }
  }
  // console.log("Cache miss");
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx(`url:${id}`, 3600, JSON.stringify(url));
  }
  return res.status(StatusCodes.OK).json({
    msg: "ShortURL fetched successfully",
    url,
  });
};

const getUserUrls = async (req, res) => {
  if (NODE_ENV !== "test") {
    const cachedUrl = await Cache.redis.get(`url:user:${req.user.userId}`);
    if (cachedUrl) {
      // console.log("Cache hit");
      return res.status(StatusCodes.OK).json({
        msg: "All shortURLs fetched successfully",
        urls: JSON.parse(cachedUrl),
        count: JSON.parse(cachedUrl).length,
      });
    }
  }
  // console.log("Cache miss");
  const urls = await urlModel
    .find({ user: req.user.userId })
    .sort("-createdAt");
  if (NODE_ENV !== "test") {
    await Cache.redis.setEx(
      `url:user:${req.user.userId}`,
      3600,
      JSON.stringify(urls)
    );
  }
  return res.status(StatusCodes.OK).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  await url.remove();
  if (NODE_ENV !== "test") {
    await Cache.redis.del(`url:${id}`);
  }
  return res.status(StatusCodes.OK).json({
    msg: "ShortURL deleted successfully",
  });
};

module.exports = {
  createUrl,
  getAllUrls,
  getAUrl,
  deleteUrl,
  getUserUrls,
  enableUrl,
  disableUrl,
  generateQrcode,
};
