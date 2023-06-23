const express = require("express");
const {
  createUrl,
  deleteUrl,
  getAUrl,
  getAllUrls,
  getUserUrls,
} = require("../controllers/url.controllers");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const router = express.Router();

router.post("/shorten", authenticateUser, createUrl);
router.get("/all", authenticateUser, authorizePermissions("admin"), getAllUrls);
router.get("/user", authenticateUser, getUserUrls);

router.get("/:id", authenticateUser, getAUrl);
router.delete("/:id", authenticateUser, deleteUrl);

module.exports = router;
