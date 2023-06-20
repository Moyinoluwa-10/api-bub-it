const { BadRequestError } = require("../errors");
const urlModel = require("../models/url.model");

const sendRedirect = async (req, res) => {
  const url = await urlModel.findOne({
    urlCode: req.params.code,
  });

  if (url) {
    url.noOfClicks = url.noOfClicks + 1;
    await url.save();
    return res.redirect(url.longUrl);
    // return res.json({ longUrl: url.longUrl });
  }

  const url2 = await urlModel.findOne({
    custom: req.params.code,
  });

  if (url2) {
    url2.noOfClicks = url2.noOfClicks + 1;
    await url2.save();
    return res.redirect(url2.longUrl);
    // return res.json({ longUrl: url2.longUrl });
  }

  throw new BadRequestError("Invalid URL");
};

module.exports = { sendRedirect };
