import {Router} from "express";
import {createShortUrl , redirectToOriginal , listLinks , deactivateLink} from "../controller/url.controller";
import { slidingRateLimit } from "../middleware/rateLimit";
import { validateRequest } from "../middleware/validateRequest";
import { shortenSchema , listLinksSchema , shortCodeParamSchema} from "../validators/url.schema";
import { getQRCode } from "../controller/QR.controller";
const router = Router();

router.post("/shorten", validateRequest(shortenSchema), slidingRateLimit, createShortUrl);
router.get("/links" , validateRequest(listLinksSchema), listLinks);
router.delete("/links/:shortCode" , validateRequest(shortCodeParamSchema), deactivateLink);
router.get("/qr/:shortCode", getQRCode);
router.get("/:shortCode" , validateRequest(shortCodeParamSchema), redirectToOriginal);



export default router;