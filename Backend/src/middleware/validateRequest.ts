import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: z.ZodTypeAny) =>
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        next();

      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: error.issues.map((item) => ({
              field: item.path.join("."),
              message: item.message,
            })),
          });
        }

        next(error);
      }
    };