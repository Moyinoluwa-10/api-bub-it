const router = require("express").Router();
const {
  signup,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth.controllers");
const { authenticateUser } = require("../middlewares/authentication");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
