"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLink = exports.listLinks = exports.redirectToOriginal = exports.createShortUrl = void 0;
const url_service_1 = require("../services/url.service");
const url_service_2 = require("../services/url.service");
const qr_1 = require("../utils/qr");
const createShortUrl = async (req, res, next) => {
    try {
        const result = await (0, url_service_1.createShortUrlService)(req.body);
        const shortUrl = `${process.env.BASE_URL}/${result.shortCode}`;
        const qrCode = await (0, qr_1.generateQRCode)(shortUrl);
        res.status(201).json({
            shortCode: result.shortCode,
            shortenSchema: `${req.protocol}://${req.get('host')}/${result.shortCode}`,
            originalUrl: result.originalUrl,
            expiresAt: result.expiresAt,
            createdAt: result.createdAt,
            qrCode: qrCode
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};
exports.createShortUrl = createShortUrl;
const redirectToOriginal = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
        console.log("Received short code:", code); // Debug log
        const url = await (0, url_service_2.redirectService)(code, req);
        return res.redirect(302, url.originalUrl);
    }
    catch (error) {
        next(error);
    }
};
exports.redirectToOriginal = redirectToOriginal;
const listLinks = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const sort = req.query.sort === "clicks" ? "clickCount" : "createdAt";
        // Call the service to get the list of links
        const result = await (0, url_service_2.listLinksService)({ page, limit, sort });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.listLinks = listLinks;
const deactivateLink = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
        const result = await (0, url_service_2.deactivateLinkService)(code);
        return res.status(200).json({
            message: "Link deactivated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateLink = deactivateLink;
