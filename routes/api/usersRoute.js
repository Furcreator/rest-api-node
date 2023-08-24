const express = require("express");
const router = express.Router();

const {
  checkRegistrUserData,
  checkLoginUserData,
  protect,
  uploadUserAvatar,
} = require("../../middlewares/usersMiddlewares");
const {
  registrUser,
  loginUser,
  currentUser,
  logoutUser,
  changeUserAvatar,
  verifyEmail,
  repeatedVerifyEmail,
} = require("../../controllers/usersControllers");

// registration
router.post("/register", checkRegistrUserData, registrUser);

// login
router.post("/login", checkLoginUserData, loginUser);

// logout
router.post("/logout", protect, logoutUser);

// get current user
router.get("/current", protect, currentUser);

// change avatar
router.patch("/avatars", protect, uploadUserAvatar, changeUserAvatar);

// verify email by link with token
router.get("/verify/:verificationToken", verifyEmail);

// repeate send of verify token
router.post("/verify", repeatedVerifyEmail);

module.exports = router;
