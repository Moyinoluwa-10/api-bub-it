const urlModel = require("../models/urlModel");

const sendRedirect = async (req, res) => {
  try {
    // find a document match to the code in req.params.code
    const url = await urlModel.findOne({
      urlCode: req.params.code,
    });

    if (url) {
      // when valid we perform a redirect
      return res.redirect(url.longUrl);
    } else {
      // else return a not found 404 status
      return res.status(404).json({ status: true, message: "No URL Found" });
    }
  } catch (err) {
    // exception handler
    console.error(err);
    res.status(500).json({ status: true, message: "Server Error" });
  }
};

module.exports = { sendRedirect };
