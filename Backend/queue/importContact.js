const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");


const importQueueName = "contact-import";

const importQueue = new Queue(importQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
    },
});


module.exports = { importQueue, importQueueName };
