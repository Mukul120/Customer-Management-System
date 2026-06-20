const IORedis = require("ioredis");


const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 200, 2000),
});


redisConnection.on("connect", () => {
    console.log("Redis connected successfully");
});

redisConnection.on("ready", () => {
    console.log("Redis is ready to accept commands");
});

redisConnection.on("error", (error) => {
    console.log("Redis connection error:", error.message);
});


module.exports = redisConnection;
