const User = require("../models/usersModel");
const AppError = require("../utils/appError");
const cathAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// registration user
exports.registrUser = cathAsync(async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { ...req.body, password: hashedPassword };
    const newUser = await User.create(user);
    
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

// login user
exports.loginUser = cathAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError(401, "Email or password is wrong");

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) throw new AppError(401, "Email or password is wrong");

  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

// logout user
exports.logoutUser = cathAsync(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.sendStatus(204);
});

// current user
exports.currentUser = cathAsync(async (req, res) => {

  const { email, subscription } = req.user;
  const currUser = { email, subscription };

  res.status(200).json(currUser);
});