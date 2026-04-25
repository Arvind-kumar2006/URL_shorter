import { z } from "zod";

export const shortenSchema = z.object({
  body: z.object({
    url: z
      .string()
      .url("Invalid URL"),

    customCode: z
      .string()
      .max(20, "Max 20 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, _ and - allowed"
      )
      .optional(),

    expiresIn: z
      .coerce.number()
      .int()
      .positive()
      .max(365)
      .optional(),
  }),
});



export const listLinksSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int()
      .positive()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .default(20),

    sort: z
      .enum([
        "createdAt",
        "clickCount"
      ])
      .default("createdAt"),
  }),
});

export const analyticsSchema = z.object({
  params: z.object({
    shortCode: z
      .string()
      .min(1)
      .max(20),
  }),

  query: z.object({
    from: z
      .string()
      .datetime()
      .optional(),

    to: z
      .string()
      .datetime()
      .optional(),

    granularity: z
      .enum([
        "hour",
        "day",
        "week"
      ])
      .default("day"),
  }),
});

export const shortCodeParamSchema = z.object({
  params: z.object({
    shortCode: z.string().min(1).max(20),
  }),
});