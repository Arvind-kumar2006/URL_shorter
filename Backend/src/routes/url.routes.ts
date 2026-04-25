import {Router} from "express";
import {createShortUrl , redirectToOriginal , listLinks , deactivateLink} from "../controller/url.controller";

const router = Router();

router.post("/shorten" , createShortUrl);
router.get("/links" , listLinks);
router.delete("/links/:shortCode" , deactivateLink);
router.get("/:shortCode" , redirectToOriginal);

export default router;