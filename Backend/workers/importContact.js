require("dotenv").config();

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const ConnectDb = require("../config/db");
const redisConnection = require("../config/redis");
const Contact = require("../models/contact.model");
const ImportJob = require("../models/importJob.model");
const { importQueueName } = require("../queue/importContact");


const BATCH_SIZE = 100;
const MAX_STORED_ERRORS = 100;

const addError = (errors, record, message) => {
    if (errors.length < MAX_STORED_ERRORS) {
        errors.push({
            index: record.index,
            phone: record.phone || "",
            message,
        });
    }
};

const prepareContact = (contact, index, listId, now) => {
    if (!contact || typeof contact !== "object") {
        return { error: { index, phone: "", message: "contact must be an object" } };
    }

    const name = typeof contact.name === "string" ? contact.name.trim() : "";
    const phone = contact.phone === undefined || contact.phone === null ? "" : String(contact.phone).trim();
    const email = typeof contact.email === "string" ? contact.email.trim() : undefined;

    if (!name) {
        return { error: { index, phone, message: "name is required" } };
    }

    if (!phone) {
        return { error: { index, phone, message: "phone is required" } };
    }

    return {
        contact: {
            index,
            phone,
            document: {
                listId,
                name,
                phone,
                ...(email ? { email } : {}),
                createdAt: now,
                updatedAt: now,
            },
        },
    };
};

const saveProgress = async (importJobId, stats, errors) => {
    await ImportJob.findByIdAndUpdate(importJobId, {
        processedRecords: stats.processedRecords,
        successfulRecords: stats.successfulRecords,
        failedRecords: stats.failedRecords,
        duplicateRecords: stats.duplicateRecords,
        errors,
    });
};

const processImport = async (job) => {
    const { importJobId, listId, contacts } = job.data;
    const importJob = await ImportJob.findById(importJobId);

    if (!importJob) {
        throw new Error("Import job not found");
    }

    const stats = {
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        duplicateRecords: 0,
    };
    const errors = [];
    const objectListId = new mongoose.Types.ObjectId(listId);

    await ImportJob.findByIdAndUpdate(importJobId, {
        status: "Processing",
        errorMessage: null,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        duplicateRecords: 0,
        errors: [],
    });

    for (let start = 0; start < contacts.length; start += BATCH_SIZE) {
        const records = contacts.slice(start, start + BATCH_SIZE);
        const validContacts = [];
        const now = new Date();

        records.forEach((contact, offset) => {
            const prepared = prepareContact(contact, start + offset, objectListId, now);

            if (prepared.error) {
                stats.failedRecords += 1;
                addError(errors, prepared.error, prepared.error.message);
                return;
            }

            validContacts.push(prepared.contact);
        });

        if (validContacts.length > 0) {
            try {
                const result = await Contact.collection.insertMany(
                    validContacts.map((contact) => contact.document),
                    { ordered: false }
                );
                stats.successfulRecords += result.insertedCount;
            } catch (error) {
                const writeErrors = error.writeErrors || [];

                if (writeErrors.length === 0) {
                    throw error;
                }

                const insertedCount = typeof error.result?.insertedCount === "number"
                    ? error.result.insertedCount
                    : validContacts.length - writeErrors.length;

                stats.successfulRecords += insertedCount;

                writeErrors.forEach((writeError) => {
                    const contact = validContacts[writeError.index];
                    const isDuplicate = writeError.code === 11000;

                    if (isDuplicate) {
                        stats.duplicateRecords += 1;
                    } else {
                        stats.failedRecords += 1;
                    }

                    addError(
                        errors,
                        contact,
                        isDuplicate ? "phone already exists in this list" : writeError.errmsg || "could not import contact"
                    );
                });
            }
        }

        stats.processedRecords += records.length;
        await saveProgress(importJobId, stats, errors);
        await job.updateProgress(Math.round((stats.processedRecords / contacts.length) * 100));
    }

    await ImportJob.findByIdAndUpdate(importJobId, {
        status: "Completed",
        processedRecords: stats.processedRecords,
        successfulRecords: stats.successfulRecords,
        failedRecords: stats.failedRecords,
        duplicateRecords: stats.duplicateRecords,
        errors,
    });

    return stats;
};

const startWorker = async () => {
    if (mongoose.connection.readyState === 0) {
        await ConnectDb();
    }

    const worker = new Worker(importQueueName, processImport, {
        connection: redisConnection,
        concurrency: 2,
    });

    worker.on("completed", (job) => {
        console.log(`Import job ${job.id} completed`);
    });

    worker.on("failed", async (job, error) => {
        console.log(`Import job ${job?.id} failed:`, error.message);

        if (job?.data.importJobId) {
            await ImportJob.findByIdAndUpdate(job.data.importJobId, {
                status: "Failed",
                errorMessage: error.message,
            });
        }
    });

    const shutdown = async () => {
        await worker.close();
        await redisConnection.quit();
        await mongoose.connection.close();
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    console.log("Contact import worker is running");
};

if (require.main === module) {
    startWorker().catch((error) => {
        console.log("Could not start import worker:", error.message);
        process.exit(1);
    });
}

module.exports = { startWorker };
