import {Router } from "express";
import {getAnalytics} from "../controller/analytics.controller";

const router = Router();


router.get("/analytics/:shortCode" , getAnalytics);

export default router;