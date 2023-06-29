const router = require("express").Router();
const { redirectUrl } = require("../controllers/redirect.controllers");

router.route("/:urlCode").get(redirectUrl);

module.exports = router;
