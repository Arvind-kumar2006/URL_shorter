import {Router} from "express";
import {createShortUrl , redirectToOriginal , listLinks , deactivateLink} from "../controller/url.controller";
import { shortenLimiter } from "../middleware/rateLimit";
import { validateRequest } from "../middleware/validateRequest";
import { shortenSchema , listLinksSchema , shortCodeParamSchema} from "../validators/url.schema";
const router = Router();

router.post("/shorten", validateRequest(shortenSchema), shortenLimiter, createShortUrl);
router.get("/links" , validateRequest(listLinksSchema), listLinks);
router.delete("/links/:shortCode" , validateRequest(shortCodeParamSchema), deactivateLink);
router.get("/:shortCode" , validateRequest(shortCodeParamSchema), redirectToOriginal);

export default router;