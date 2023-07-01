const urlModel = require("../models/url.models");
const Cache = require("../cache/redis");

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

module.exports = {
  redirectUrl,
};
