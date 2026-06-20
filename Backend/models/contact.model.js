const mongoose = require("mongoose")


const contactSchema = new mongoose.Schema(
    {
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        email: {
            type: String,
        },
    },
    { timestamps: true }
);

contactSchema.index(
    {
        listId: 1,
        phone: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Contact", contactSchema);