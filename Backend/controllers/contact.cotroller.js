const Contact = require("../models/contact.model");


const createContact = async (req, res) => {
    try {
        const { listId, name, phone, email } = req.body;

        if (!listId || !name || !phone) {
            return res.status(400).json({ message: "listId, name and phone are required" });
        }

        const contact = await Contact.create({ listId, name, phone, email });

        res.status(201).json({
            message: "contact created successfully",
            contact,
        });
    } catch (error) {
        console.log("error in create contact controller:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({ message: "A contact with this phone already exists in this list" });
        }

        res.status(500).json({ message: error.message });
    }
};

const searchContacts = async (req, res) => {
    try {
        const { query = "", listId } = req.query;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchQuery = new RegExp(escapedQuery, "i");
        const filter = {
            $or: [
                { name: searchQuery },
                { phone: searchQuery },
                { email: searchQuery },
            ],
        };

        if (listId) filter.listId = listId;

        const contacts = await Contact.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message: "contacts fetched successfully",
            contacts,
        });
    } catch (error) {
        console.log("error in search contacts controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { name, phone, email, listId } = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (email !== undefined) updates.email = email;
        if (listId !== undefined) updates.listId = listId;

        const contact = await Contact.findByIdAndUpdate(
            contactId,
            updates,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({ message: "contact not found" });
        }

        res.status(200).json({
            message: "contact updated successfully",
            contact,
        });
    } catch (error) {
        console.log("error in update contact controller:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({ message: "A contact with this phone already exists in this list" });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.contactId);

        if (!contact) {
            return res.status(404).json({ message: "contact not found" });
        }

        res.status(200).json({
            message: "contact deleted successfully",
        });
    } catch (error) {
        console.log("error in delete contact controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getContactsByList = async (req, res) => {
    try {
        const contacts = await Contact.find({ listId: req.params.listId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "contacts fetched successfully",
            contacts,
        });
    } catch (error) {
        console.log("error in get contacts by list controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};


const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);

        if (!contact) {
            return res.status(404).json({ message: "contact not found" });
        }

        res.status(200).json({
            message: "contact fetched successfully",
            contact,
        });
    } catch (error) {
        console.log("error in get contact controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getContactsByList, getContact, updateContact, deleteContact, createContact, searchContacts };
