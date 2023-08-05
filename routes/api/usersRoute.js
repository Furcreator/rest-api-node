const express = require("express");
const router = express.Router();

const {
  checkRegistrUserData,
  checkLoginUserData,
  protect,
} = require("../../middlewares/usersMiddlewares");
const {
  registrUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../../controllers/usersControllers");

// registration
router.post("/register", checkRegistrUserData, registrUser);

// login
router.post("/login", checkLoginUserData, loginUser);

// logout
router.post("/logout", protect, logoutUser);

// get current user
router.get("/current", protect, currentUser);

module.exports = router;
