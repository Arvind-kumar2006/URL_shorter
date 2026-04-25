"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLinkService = exports.listLinksService = exports.redirectService = exports.createShortUrlService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const redis_1 = __importDefault(require("../lib/redis"));
const AppError_1 = __importDefault(require("../utils/AppError"));
function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const createShortUrlService = async (input) => {
    const { url, customCode, expiresIn } = input;
    let shortCode = customCode || generateCode();
    // Check if the shortcode already exists
    const existing = await prisma_1.default.url.findUnique({
        where: { shortCode: shortCode }
    });
    if (existing) {
        throw new AppError_1.default("Custom code already in use, please choose another one", 400);
    }
    const created = await prisma_1.default.url.create({
        data: {
            shortCode: shortCode,
            originalUrl: url,
            expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000) : null
        }
    });
    return created;
};
exports.createShortUrlService = createShortUrlService;
const redirectService = async (shortCode, req) => {
    const cacheKey = `url:${shortCode}`;
    let cached = null;
    if (process.env.NODE_ENV !== "test") {
        cached = await redis_1.default.get(cacheKey);
    }
    //   if (cached) {
    //   console.log("CACHE HIT");
    // }
    // else {
    //   console.log("CACHE MISS");
    // }
    if (cached) {
        const url = JSON.parse(cached);
        logClick(url.id, req);
        return url;
    }
    const url = await prisma_1.default.url.findUnique({
        where: { shortCode }
    });
    if (!url) {
        throw new AppError_1.default("Short URL not found", 404);
    }
    if (!url.isActive) {
        throw new AppError_1.default("This link has been deactivated", 410);
    }
    if (url.expiresAt && new Date() > url.expiresAt) {
        throw new AppError_1.default("This link has expired", 410);
    }
    if (process.env.NODE_ENV !== "test") {
        await redis_1.default.setEx(cacheKey, 3600, JSON.stringify(url));
    }
    logClick(url.id, req)
        .catch(console.error);
    return url;
};
exports.redirectService = redirectService;
const listLinksService = async (input) => {
    const { page, limit, sort } = input;
    const skip = ((page) - 1) * limit;
    const [links, total] = await Promise.all([
        prisma_1.default.url.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                [sort]: "desc"
            },
            select: {
                id: true,
                shortCode: true,
                originalUrl: true,
                clickCount: true,
                createdAt: true,
                expiresAt: true,
                isActive: true
            }
        }),
        prisma_1.default.url.count()
    ]);
    return {
        data: links,
        pagination: {
            total, page, limit, totalPages: Math.ceil(total / limit)
        }
    };
};
exports.listLinksService = listLinksService;
const deactivateLinkService = async (shortCode) => {
    await redis_1.default.del(`url:${shortCode}`);
    const existing = await prisma_1.default.url.findUnique({
        where: { shortCode: shortCode }
    });
    if (!existing) {
        throw new AppError_1.default("Short URL not found", 404);
    }
    const updated = await prisma_1.default.url.update({
        where: { shortCode },
        data: {
            isActive: false
        }
    });
    return updated;
};
exports.deactivateLinkService = deactivateLinkService;
// extract click logging 
const logClick = async (urlId, req) => {
    const ipAddress = req.ip ?? "Unknown";
    prisma_1.default.url.update({
        where: { id: urlId },
        data: {
            clickCount: {
                increment: 1
            }
        }
    }).catch(console.error);
    prisma_1.default.click.create({
        data: {
            urlId: urlId,
            ipAddress: ipAddress,
            userAgent: req.headers["user-agent"] || "",
            referrer: req.headers.referer || "direct",
            deviceType: "desktop"
        }
    }).catch(console.error);
};
