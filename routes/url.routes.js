const express = require("express");
const { sendUrl } = require("../controllers/url.controllers");

const router = express.Router();

router.post("/", sendUrl);

module.exports = router;
