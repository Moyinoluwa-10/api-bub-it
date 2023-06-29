const urlModel = require("../models/url.models");
const validUrl = require("valid-url");
const urlExists = require("url-exists");
// import urlExist from "url-exist";
const shortid = require("shortid");
var QRCode = require("qrcode");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { checkPermissions } = require("../utils");
const { BASE_URL } = require("../config/config");
const Cache = require("../cache/redis");

const createUrl = async (req, res) => {
  const baseUrl = req.headers.origin || BASE_URL;
  const { longUrl, custom } = req.body;
  if (!validUrl.isUri(baseUrl)) throw new BadRequestError("Invalid base URL");
  const urlCode = shortid.generate();

  // const exist = await urlExist(longUrl);
  // console.log(exist);
  await urlExists(longUrl, function (err, exists) {
    console.log("Step 1");
    console.log(exists);
  });
  // const exists = await urlExists(longUrl);
  // console.log(exists);
  // write the above function in await style
  console.log("Step 2");

  console.log(validUrl.isWebUri(longUrl));
  console.log(!validUrl.isWebUri(longUrl));

  if (!validUrl.isWebUri(longUrl))
    throw new BadRequestError("Invalid long URL");

  let userId;
  if (req.user) {
    userId = req.user.userId || null;
  }
  // console.log(req.user.userId);

  let url = await urlModel.findOne({
    longUrl,
    user: userId,
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
    user: userId,
  });
  await url.save();
  if (req.user) {
    await Cache.redis.del(`url:user:${req.user.userId}`);
  }
  await Cache.redis.del("urls");
  return res.status(StatusCodes.CREATED).json({
    msg: "ShortURL created successfully",
    url,
  });
};

const getAllUrls = async (req, res) => {
  const cachedUrls = await Cache.redis.get("urls");
  if (cachedUrls) {
    // console.log("Cache hit");
    return res.status(StatusCodes.OK).json({
      msg: "All shortURLs fetched successfully",
      urls: JSON.parse(cachedUrls),
      count: JSON.parse(cachedUrls).length,
    });
  }
  // console.log("Cache miss");

  const urls = await urlModel.find();
  await Cache.redis.setEx("urls", 3600, JSON.stringify(urls));
  return res.status(StatusCodes.OK).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const getAUrl = async (req, res) => {
  const { id } = req.params;
  const cachedUrl = await Cache.redis.get(`url:${id}`);
  if (cachedUrl) {
    // console.log("Cache hit");
    return res.status(StatusCodes.OK).json({
      msg: "ShortURL fetched successfully",
      url: JSON.parse(cachedUrl),
    });
  }
  // console.log("Cache miss");
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  await Cache.redis.setEx(`url:${id}`, 3600, JSON.stringify(url));
  return res.status(StatusCodes.OK).json({
    msg: "ShortURL fetched successfully",
    url,
  });
};

const getUserUrls = async (req, res) => {
  const cachedUrl = await Cache.redis.get(`url:user:${req.user.userId}`);
  if (cachedUrl) {
    // console.log("Cache hit");
    return res.status(StatusCodes.OK).json({
      msg: "All shortURLs fetched successfully",
      urls: JSON.parse(cachedUrl),
      count: JSON.parse(cachedUrl).length,
    });
  }
  // console.log("Cache miss");
  const urls = await urlModel.find({ user: req.user.userId });
  await Cache.redis.setEx(
    `url:user:${req.user.userId}`,
    3600,
    JSON.stringify(urls)
  );
  return res.status(StatusCodes.OK).json({
    msg: "All shortURLs fetched successfully",
    urls,
    count: urls.length,
  });
};

const redirectUrl = async (req, res) => {
  const { urlCode } = req.params;
  const url = await urlModel.findOne({ urlCode });

  if (url) {
    // console.log("url", url);
    const analytics = {
      ip: req.ip,
      browser: req.headers["user-agent"],
      date: new Date(),
    };

    url.analytics.unshift(analytics);
    url.noOfClicks = url.noOfClicks + 1;
    await url.save();
    Cache.redis.set(`url:${url._id}`, JSON.stringify(url));
    return res.setHeader("Content-Type", "text/html").redirect(url.longUrl);
    return res
      .status(StatusCodes.OK)
      .json({ msg: "redirected", url: url.longUrl });
  }

  const url2 = await urlModel.findOne({ custom: urlCode });

  if (url2) {
    // console.log("url2", url2);
    const analytics = {
      ip: req.ip,
      browser: req.headers["user-agent"],
      date: new Date(),
    };

    url2.analytics.unshift(analytics);
    url2.noOfClicks = url2.noOfClicks + 1;
    await url2.save();
    Cache.redis.set(`url:${url2._id}`, JSON.stringify(url2));
    return res.setHeader("Content-Type", "text/html").redirect(url2.longUrl);
    return res
      .status(StatusCodes.OK)
      .json({ msg: "redirected", url: url2.longUrl });
  }

  throw new BadRequestError("ShortURL not found");
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ _id: id });
  if (!url) throw new BadRequestError("ShortURL not found");
  checkPermissions(req.user, url.user);
  await url.remove();
  await Cache.redis.del(`url:${id}`);
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
  redirectUrl,
};
