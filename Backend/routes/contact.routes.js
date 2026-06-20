const express = require("express");
const { createContact, searchContacts, getContactsByList, getContact, updateContact, deleteContact } = require("../controllers/contact.cotroller");
const router = express.Router();



router.post("/", createContact);
router.get("/search", searchContacts);
router.get("/list/:listId", getContactsByList);
router.get("/:contactId", getContact);
router.put("/:contactId", updateContact);
router.delete("/:contactId", deleteContact);


module.exports = router