"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slidingRateLimit = void 0;
const redis_1 = __importDefault(require("../lib/redis"));
const slidingRateLimit = async (req, res, next) => {
    if (process.env.NODE_ENV === "test" &&
        process.env.ENABLE_LIMITER !== "true") {
        return next();
    }
    try {
        const limit = 20;
        const windowMs = 15 * 60 * 1000;
        const now = Date.now();
        const windowStart = now - windowMs;
        const ip = req.ip || "unknown";
        const key = `rate_limit:${ip}`;
        await redis_1.default.zRemRangeByScore(key, 0, windowStart);
        const count = await redis_1.default.zCard(key);
        if (count >= limit) {
            return res
                .status(429)
                .json({
                status: "error",
                message: "Too many requests. Try again later.",
            });
        }
        await redis_1.default.zAdd(key, [
            {
                score: now,
                value: `${now}`,
            },
        ]);
        await redis_1.default.expire(key, Math.ceil(windowMs / 1000));
        next();
    }
    catch (error) {
        console.error("Rate limiter failed:", error);
        next();
    }
};
exports.slidingRateLimit = slidingRateLimit;
