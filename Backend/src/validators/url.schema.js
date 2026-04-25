"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortCodeParamSchema = exports.analyticsSchema = exports.listLinksSchema = exports.shortenSchema = void 0;
const zod_1 = require("zod");
exports.shortenSchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z
            .string()
            .url("Invalid URL"),
        customCode: zod_1.z
            .string()
            .max(20, "Max 20 characters")
            .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and - allowed")
            .optional(),
        expiresIn: zod_1.z
            .coerce.number()
            .int()
            .positive()
            .max(365)
            .optional(),
    }),
});
exports.listLinksSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce
            .number()
            .int()
            .positive()
            .default(1),
        limit: zod_1.z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),
        sort: zod_1.z
            .enum([
            "createdAt",
            "clickCount"
        ])
            .default("createdAt"),
    }),
});
exports.analyticsSchema = zod_1.z.object({
    params: zod_1.z.object({
        shortCode: zod_1.z
            .string()
            .min(1)
            .max(20),
    }),
    query: zod_1.z.object({
        from: zod_1.z
            .string()
            .datetime()
            .optional(),
        to: zod_1.z
            .string()
            .datetime()
            .optional(),
        granularity: zod_1.z
            .enum([
            "hour",
            "day",
            "week"
        ])
            .default("day"),
    }),
});
exports.shortCodeParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        shortCode: zod_1.z.string().min(1).max(20),
    }),
});
