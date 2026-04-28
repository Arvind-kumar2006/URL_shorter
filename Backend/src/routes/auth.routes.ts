import express from "express";

import {
  register,
  login,
  me,
} from "../controller/auth.controller";

import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/auth/register",
  register
);

router.post(
  "/auth/login",
  login
);

router.get(
  "/auth/me",
  auth,
  me
);

export default router;