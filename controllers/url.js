const validUrl = require("valid-url");
const shortid = require("shortid");
const { BASE_URL } = require("../config/config");

const urlModel = require("../models/urlModel");

const baseUrl = BASE_URL;

const sendUrl = async (req, res) => {
  const { longUrl } = req.body; // destructure the longUrl from req.body.longUrl

  console.log(longUrl);

  // check base url if valid using the validUrl.isUri method
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json({
      status: true,
      message: "Invalid base URL",
    });
  }

  // if valid, we create the url code
  const urlCode = shortid.generate();

  // check long url if valid using the validUrl.isUri method
  if (validUrl.isUri(longUrl)) {
    try {
      // before creating the short URL, check if the long URL is in the DB, else we create it.

      let url = await urlModel.findOne({
        longUrl,
      });

      // url exist and return the respose
      if (url) {
        res.json(url);
      } else {
        // join the generated short code the the base url
        const shortUrl = baseUrl + "/" + urlCode;

        // invoking the Url model and saving to the DB
        url = new urlModel({
          urlCode,
          longUrl,
          shortUrl,
          createdAt: new Date(),
        });

        await url.save();

        res.status(201).json({
          status: true,
          message: "URL created successfully",
          url,
        });
      }
      const shortUrl = baseUrl + "/" + urlCode;

      // invoking the Url model and saving to the DB
      url = new urlModel({
        urlCode,
        longUrl,
        shortUrl,
        createdAt: new Date(),
      });

      await url.save();

      res.status(201).json({
        status: true,
        message: "URL created successfully",
        url,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, message: "Server Error" });
    }
  } else {
    res.status(401).json({ status: false, message: "Invalid longUrl" });
  }
};

module.exports = { sendUrl };
