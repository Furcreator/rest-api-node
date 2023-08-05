const express = require("express");
const router = express.Router();

const {
  checkContactId,
  checkCreateContactData,
  checkUpdateContactData,
  checkUpdateStatus,
} = require("../../middlewares/contactsMiddlewares");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavoriteStatus,
} = require("../../controllers/contactsControllers");
const { protect } = require("../../middlewares/usersMiddlewares");

router.use(protect);

// get all contacts
router.get("/", listContacts);
// post new contact
router.post("/", checkCreateContactData, addContact);
// check corect id by contacts
router.use("/:contactId", checkContactId);
// get contact by id
router.get("/:contactId", getContactById);
// delete contact
router.delete("/:contactId", removeContact);
// update contact
router.put("/:contactId", checkUpdateContactData, updateContact);
// update favorite
router.patch("/:contactId/favorite", checkUpdateStatus, updateFavoriteStatus);

module.exports = router;
