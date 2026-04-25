import {
  Request,
  Response,
  NextFunction
} from "express";

import redis from "../lib/redis";

export const slidingRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 if (
  process.env.NODE_ENV === "test" &&
  process.env.ENABLE_LIMITER !== "true"
) {
  return next();
}

  try {
    const limit = 20;
    const windowMs =
      15 * 60 * 1000;

    const now = Date.now();

    const windowStart =
      now - windowMs;

    const ip =
      req.ip || "unknown";

    const key =
      `rate_limit:${ip}`;

    await redis.zRemRangeByScore(
      key,
      0,
      windowStart
    );

    const count =
      await redis.zCard(key);

    if (count >= limit) {
      return res
        .status(429)
        .json({
          status: "error",
          message:
            "Too many requests. Try again later.",
        });
    }

    await redis.zAdd(key, [
      {
        score: now,
        value: `${now}`,
      },
    ]);

    await redis.expire(
      key,
      Math.ceil(
        windowMs / 1000
      )
    );

    next();

  } catch (error) {
    console.error(
      "Rate limiter failed:",
      error
    );

    next();
  }
};