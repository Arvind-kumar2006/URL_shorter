import {Router } from "express";
import {getAnalytics} from "../controller/analytics.controller";

const router = Router();
import { validateRequest } from "../middleware/validateRequest";
import { analyticsSchema } from "../validators/url.schema";
import { auth } from "../middleware/auth";

router.get("/analytics/:shortCode",auth , validateRequest(analyticsSchema), getAnalytics);

export default router;