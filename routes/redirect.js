const express = require("express");
const router = express.Router();
const { sendRedirect } = require("../controllers/redirect");

router.get("/:code", sendRedirect);

module.exports = router;
