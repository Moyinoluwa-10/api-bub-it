const express = require("express");
const { sendUrl } = require("../controllers/url.controllers");

const router = express.Router();

router.post("/shorten", sendUrl);

module.exports = router;
