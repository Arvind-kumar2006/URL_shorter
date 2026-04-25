import {Router} from "express";
import {createShortUrl , redirectToOriginal , listLinks , deactivateLink} from "../controller/url.controller";
import { shortenLimiter } from "../middleware/rateLimit";
const router = Router();

router.post("/shorten",shortenLimiter , createShortUrl);
router.get("/links" , listLinks);
router.delete("/links/:shortCode" , deactivateLink);
router.get("/:shortCode" , redirectToOriginal);

export default router;