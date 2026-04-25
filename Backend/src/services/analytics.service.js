"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getAnalyticsService = async (shortCode) => {
    const url = await prisma_1.default.url.findUnique({
        where: { shortCode },
    });
    if (!url) {
        throw new AppError_1.default("Short URL not found", 404);
    }
    // =========================
    // Total Clicks
    // =========================
    const totalClicks = await prisma_1.default.click.count({
        where: {
            urlId: url.id,
        },
    });
    // =========================
    // Unique Clicks
    // =========================
    const uniqueResult = await prisma_1.default.$queryRaw `
    SELECT COUNT(DISTINCT ip_address) AS count
    FROM clicks
    WHERE url_id = ${url.id}
  `;
    const uniqueClicks = Number(uniqueResult[0]?.count || 0);
    // =========================
    // Clicks By Time
    // =========================
    const clicksByTime = await prisma_1.default.$queryRaw `
    SELECT
      DATE(click_at) AS period,
      COUNT(*) AS clicks
    FROM clicks
    WHERE url_id = ${url.id}
    GROUP BY DATE(click_at)
    ORDER BY period ASC
  `;
    // =========================
    // Top Referrers
    // =========================
    const topReferrers = await prisma_1.default.$queryRaw `
    SELECT
      COALESCE(referrer, 'direct') AS referrer,
      COUNT(*) AS clicks
    FROM clicks
    WHERE url_id = ${url.id}
    GROUP BY referrer
    ORDER BY clicks DESC
    LIMIT 5
  `;
    // =========================
    // Device Breakdown
    // =========================
    const deviceRows = await prisma_1.default.$queryRaw `
    SELECT
      COALESCE(device_type, 'unknown') AS device,
      COUNT(*) AS clicks
    FROM clicks
    WHERE url_id = ${url.id}
    GROUP BY device_type
  `;
    const deviceBreakdown = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
    };
    for (const row of deviceRows) {
        const key = row.device;
        if (key in deviceBreakdown) {
            deviceBreakdown[key] =
                Number(row.clicks);
        }
    }
    // =========================
    // Final Response
    // =========================
    return {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        totalClicks,
        uniqueClicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        clicksByTime: clicksByTime.map((item) => ({
            period: item.period
                .toISOString()
                .split("T")[0],
            clicks: Number(item.clicks),
        })),
        topReferrers: topReferrers.map((item) => ({
            referrer: item.referrer ||
                "direct",
            clicks: Number(item.clicks),
        })),
        deviceBreakdown,
    };
};
exports.getAnalyticsService = getAnalyticsService;
