const express = require("express");
const {
  createUrl,
  deleteUrl,
  getAUrl,
  getAllUrls,
  getUserUrls,
  redirectUrl,
} = require("../controllers/url.controllers");
const {
  authenticateUser,
  authorizePermissions,
  optionalAuthentication,
} = require("../middlewares/authentication");

const router = express.Router();

router.post("/shorten", optionalAuthentication, createUrl);
router.get("/all", authenticateUser, authorizePermissions("admin"), getAllUrls);
router.get("/user", authenticateUser, getUserUrls);
router.get("/redirect/:urlCode", redirectUrl);

router.get("/:id", authenticateUser, getAUrl);
router.delete("/:id", authenticateUser, deleteUrl);

module.exports = router;
