const Contacts = require("../models/contactsModel");
const cathAsync = require("../utils/catchAsync");

exports.listContacts = cathAsync(async (req, res) => {
  const contacts = await Contacts.find().select("-__v");
  res.status(200).json(contacts);
});

exports.getContactById = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  res.status(200).json(contact);
});

exports.removeContact = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  await Contacts.findByIdAndDelete(contactId);
  res.status(200).json({ message: "contact deleted" });
});

exports.addContact = cathAsync(async (req, res) => {
  const newContact = await Contacts.create(req.body);
  newContact.__v = undefined;
  res.status(201).json(newContact);
});

exports.updateContact = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);

  Object.keys(req.body).forEach((key) => {
    contact[key] = req.body[key];
  });

  const updatedContact = await contact.save();
  updatedContact.__v = undefined;
  res.status(200).json(updatedContact);
});

exports.updateFavoriteStatus = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  contact.favorite = req.body.favorite;

  const updatedContact = await contact.save();

  updatedContact.__v = undefined;
  res.status(200).json(updatedContact);
});
