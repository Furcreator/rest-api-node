const jwt = require("jsonwebtoken");
const multer = require("multer");
const cathAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/usersModel");
const {
  registerUserDataValidator,
  loginUserDataValidator,
} = require("../utils/contactsValidator");

// check users registration
exports.checkRegistrUserData = cathAsync(async (req, res, next) => {
  if (!req.body.email) throw new AppError(400, "Email is required");
  if (!req.body.password) throw new AppError(400, "Password is required");

  const { error, value } = registerUserDataValidator(req.body);
  if (error) {
    console.log(error);
    throw new AppError(400, "Invalid user data (Joi)..");
  }

  const userExists = await User.exists({ email: value.email });

  if (userExists) throw new AppError(409, "Email in use");

  next();
});

// check users login
exports.checkLoginUserData = cathAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) throw new AppError(400, "Email is required");
  if (!password) throw new AppError(400, "Password is required");

  const { error, value } = loginUserDataValidator(req.body);
  if (error) {
    console.log(error);
    throw new AppError(400, "Invalid user data (Joi)..");
  }

  req.body = value;

  next();
});

// protect routes

exports.protect = cathAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) throw new AppError(401, "Not authorized");
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);
    throw new AppError(401, "Not authorized");
  }
  const currentUser = await User.findById(decoded.id);

  if (!currentUser || !currentUser.token || currentUser.token !== token)
    throw new AppError(401, "Not authorized");

  req.user = currentUser;

  next();
});

// config multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, "tmp");
  },
  filename: (req, file, cbk) => {
    cbk(null, `${file.originalname}`);
  },
});

// config multer filter
const multerFilter = (req, file, cbk) => {
  // 'image/*'
  if (file.mimetype.startsWith("image/")) {
    cbk(null, true);
  } else {
    cbk(new AppError(400, "Please, upload images only!"), false);
  }
};

exports.uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
}).single("avatarURL");
