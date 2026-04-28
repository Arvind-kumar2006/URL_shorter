import { Request, Response, NextFunction } from "express";

import {
  registerService,
  loginService,
  meService,
} from "../services/auth.service";

export const register =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } =
        req.body;

      const data =
        await registerService(
          email,
          password
        );

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

export const login =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } =
        req.body;

      const data =
        await loginService(
          email,
          password
        );

      res.json(data);
    } catch (error) {
      next(error);
    }
  };

export const me =
  async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user =
        await meService(
          req.user.userId
        );

      res.json(user);
    } catch (error) {
      next(error);
    }
  };