"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQRCode = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const getQRCode = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
        const buffer = await qrcode_1.default.toBuffer(shortUrl);
        res.setHeader("Content-Type", "image/png");
        return res.send(buffer);
    }
    catch (error) {
        next(error);
    }
};
exports.getQRCode = getQRCode;
