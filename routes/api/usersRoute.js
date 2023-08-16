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

module.exports = router;
