"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redis.on("error", (err) => {
    console.error("Redis Client Error", err);
});
const shouldConnect = process.env.NODE_ENV !==
    "test" ||
    process.env.ENABLE_LIMITER ===
        "true";
if (shouldConnect) {
    redis.connect()
        .then(() => console.log("Connected to Redis"))
        .catch(console.error);
}
exports.default = redis;
