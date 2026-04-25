import {Router } from "express";
import {getAnalytics} from "../controller/analytics.controller";

const router = Router();
import { validateRequest } from "../middleware/validateRequest";
import { analyticsSchema } from "../validators/url.schema";

router.get("/analytics/:shortCode" , validateRequest(analyticsSchema), getAnalytics);

export default router;