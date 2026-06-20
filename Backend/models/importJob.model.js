const mongoose = require("mongoose");


const importJobSchema = new mongoose.Schema(
    {
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
            required: true,
        },

        totalRecords: {
            type: Number,
            required: true,
        },

        processedRecords: {
            type: Number,
            default: 0,
        },

        successfulRecords: {
            type: Number,
            default: 0,
        },

        failedRecords: {
            type: Number,
            default: 0,
        },

        duplicateRecords: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Failed"],
            default: "Pending",
        },

        errorMessage: {
            type: String,
            default: null,
        },

        errors: [
            {
                _id: false,
                index: Number,
                phone: String,
                message: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ImportJob", importJobSchema);
