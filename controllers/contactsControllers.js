const Contacts = require("../models/contactsModel");
const cathAsync = require("../utils/catchAsync");

// get all contact
exports.listContacts = cathAsync(async (req, res) => {
  const contacts = await Contacts.find({ owner: req.user.id }).select(
    "-__v -owner"
  );
  res.status(200).json(contacts);
});

// get contact by id
exports.getContactById = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  contact.owner = undefined;
  res.status(200).json(contact);
});

// delete contact
exports.removeContact = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  await Contacts.findByIdAndDelete(contactId);
  res.status(200).json({ message: "contact deleted" });
});

// new contact
exports.addContact = cathAsync(async (req, res) => {
  const cont = { ...req.body, owner: req.user.id };
  const newContact = await Contacts.create(cont);
  newContact.__v = undefined;
  newContact.owner = undefined;
  res.status(201).json(newContact);
});

// update contact
exports.updateContact = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);

  Object.keys(req.body).forEach((key) => {
    contact[key] = req.body[key];
  });

  const updatedContact = await contact.save();
  updatedContact.__v = undefined;
  updatedContact.owner = undefined;
  res.status(200).json(updatedContact);
});

// update contact status
exports.updateFavoriteStatus = cathAsync(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  contact.favorite = req.body.favorite;

  const updatedContact = await contact.save();

  updatedContact.__v = undefined;
  updatedContact.owner = undefined;
  res.status(200).json(updatedContact);
});
