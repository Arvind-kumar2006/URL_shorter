import prisma from "../lib/prisma";
import AppError from "../utils/AppError";

export const getAnalyticsService = async (
  shortCode: string
) => {
  const url = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (!url) {
    throw new AppError(
      "Short URL not found",
      404
    );
  }

  // =========================
  // Total Clicks
  // =========================
  const totalClicks =
    await prisma.click.count({
      where: {
        urlId: url.id,
      },
    });

  // =========================
  // Unique Clicks
  // =========================
  const uniqueResult =
    await prisma.$queryRaw<
      { count: bigint }[]
    >`
    SELECT COUNT(DISTINCT ip_address) AS count
    FROM clicks
    WHERE url_id = ${url.id}
  `;

  const uniqueClicks = Number(
    uniqueResult[0]?.count || 0
  );

  // =========================
  // Clicks By Time
  // =========================
  const clicksByTime =
    await prisma.$queryRaw<
      {
        period: Date;
        clicks: bigint;
      }[]
    >`
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
  const topReferrers =
    await prisma.$queryRaw<
      {
        referrer: string | null;
        clicks: bigint;
      }[]
    >`
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
  const deviceRows =
    await prisma.$queryRaw<
      {
        device: string | null;
        clicks: bigint;
      }[]
    >`
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
    const key =
      row.device as keyof typeof deviceBreakdown;

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

    clicksByTime:
      clicksByTime.map((item) => ({
        period:
          item.period
            .toISOString()
            .split("T")[0],
        clicks: Number(
          item.clicks
        ),
      })),

    topReferrers:
      topReferrers.map((item) => ({
        referrer:
          item.referrer ||
          "direct",
        clicks: Number(
          item.clicks
        ),
      })),

    deviceBreakdown,
  };
};