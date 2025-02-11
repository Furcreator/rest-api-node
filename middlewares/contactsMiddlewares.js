const { Types } = require("mongoose");

const Contacts = require("../models/contactsModel");
const cathAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  createContactDataValidator,
  updateContactDataValidator,
  updateContactFavoriteValidator,
} = require("../utils/contactsValidator");

exports.checkContactId = cathAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const idIsValid = Types.ObjectId.isValid(contactId);

  if (!idIsValid) throw new AppError(404, "Not found");

  const contactExists = await Contacts.exists({ _id: contactId });

  if (!contactExists) throw new AppError(404, "Not found");

  next();
});

exports.checkCreateContactData = cathAsync(async (req, res, next) => {
  if (!req.body.name) throw new AppError(400, "missing required name field");
  if (!req.body.email) throw new AppError(400, "missing required email field");
  if (!req.body.phone) throw new AppError(400, "missing required phone field");

  const { error, value } = createContactDataValidator(req.body);

  if (error) {
    console.log("error", error);
    throw new AppError(400, "Invalid user data.");
  }

  req.body = value;

  next();
});

exports.checkUpdateContactData = cathAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) throw new AppError(400, "missing fields");
  if (!req.body.name) throw new AppError(400, "missing required name field");
  if (!req.body.email) throw new AppError(400, "missing required email field");
  if (!req.body.phone) throw new AppError(400, "missing required phone field");

  const { error, value } = updateContactDataValidator(req.body);

  if (error) {
    console.log("error", error);
    throw new AppError(400, "Invalid user data.");
  }

  req.body = value;

  next();
});

exports.checkUpdateStatus = cathAsync(async (req, res, next) => {
  if (req.body.favorite === undefined)
    throw new AppError(400, "missing field favorite");

  const { error, value } = updateContactFavoriteValidator(req.body);

  if (error) {
    console.log("error", error);
    throw new AppError(400, "Invalid status data. Favorite must be boolean.");
  }

  req.body = value;

  next();
});
