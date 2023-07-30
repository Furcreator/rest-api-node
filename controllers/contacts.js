const contacts = require("../models/contacts");
const Joi = require("joi");
const { errorMessage, catchAsync } = require("../utils");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw errorMessage({ status: 404 });
  }
  res.json(result);
};

const add = async (req, res) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    const label = error.details[0].context.label;
    if (error.details[0].type === "any.required") {
      throw errorMessage({
        status: 400,
        message: `missing required ${label} field`,
      });
    } else {
      throw errorMessage({
        status: 400,
        message: `${error.details[0].message}`,
      });
    }
  }
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    const length = Object.keys(error._original).length;
    const label = error.details[0].context.label;
    if (length === 0) {
      throw errorMessage({ status: 400, message: "missing fields" });
    }
    if (error.details[0].type === "any.required") {
      throw errorMessage({
        status: 400,
        message: `missing required ${label} field`,
      });
    } else {
      throw errorMessage({
        status: 400,
        message: `${error.details[0].message}`,
      });
    }
  }
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) throw errorMessage({ status: 404 });
  res.json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) throw errorMessage({ status: 404 });
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getAll: catchAsync(getAll),
  getById: catchAsync(getById),
  add: catchAsync(add),
  deleteById: catchAsync(deleteById),
  updateById: catchAsync(updateById),
};
