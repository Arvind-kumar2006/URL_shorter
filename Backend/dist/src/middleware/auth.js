"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
;
const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res
                .status(401)
                .json({
                message: "No token provided",
            });
        }
        const token = header.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res
            .status(401)
            .json({
            message: "Invalid token",
        });
    }
};
exports.auth = auth;
