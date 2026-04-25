import rateLimit from "express-rate-limit";

export const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many requests from this IP, try again later."
  }
});