import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "supersecret"; ;

export const auth =
  (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const header =
        req.headers.authorization;

      if (!header) {
        return res
          .status(401)
          .json({
            message:
              "No token provided",
          });
      }

      const token =
        header.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          JWT_SECRET
        );

      req.user = decoded;

      next();
    } catch {
      return res
        .status(401)
        .json({
          message:
            "Invalid token",
        });
    }
  };