const mongoose = require("mongoose");
const List = require("../models/list.model");
const ImportJob = require("../models/importJob.model");
const { importQueue } = require("../queue/importContact");


const createImportJob = async (req, res) => {
    try {
        const { listId, contacts } = req.body;

        if (!mongoose.isValidObjectId(listId)) {
            return res.status(400).json({ message: "A valid listId is required" });
        }

        if (!Array.isArray(contacts) || contacts.length === 0) {
            return res.status(400).json({ message: "contacts must be a non-empty array" });
        }

        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: "list not found" });
        }

        const importJob = await ImportJob.create({
            listId,
            totalRecords: contacts.length,
        });

        try {
            await importQueue.add(
                "import-contacts",
                {
                    importJobId: importJob._id.toString(),
                    listId,
                    contacts,
                },
                { jobId: importJob._id.toString() }
            );
        } catch (queueError) {
            importJob.status = "Failed";
            importJob.errorMessage = "Could not queue the import job";
            await importJob.save();
            throw queueError;
        }

        res.status(202).json({
            message: "contact import queued successfully",
            importJob,
        });
    } catch (error) {
        console.log("error in create import job controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getImportJob = async (req, res) => {
    try {
        const { importJobId } = req.params;

        if (!mongoose.isValidObjectId(importJobId)) {
            return res.status(400).json({ message: "invalid import job id" });
        }

        const importJob = await ImportJob.findById(importJobId);

        if (!importJob) {
            return res.status(404).json({ message: "import job not found" });
        }

        res.status(200).json({
            message: "import job fetched successfully",
            importJob,
        });
    } catch (error) {
        console.log("error in get import job controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createImportJob, getImportJob };
