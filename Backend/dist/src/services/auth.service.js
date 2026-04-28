"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meService = exports.loginService = exports.registerService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const registerService = async (email, password) => {
    const existing = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existing) {
        throw new Error("Email already exists");
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            email,
            password: hashed,
        },
    });
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};
exports.registerService = registerService;
const loginService = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const ok = await bcryptjs_1.default.compare(password, user.password);
    if (!ok) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};
exports.loginService = loginService;
const meService = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            createdAt: true,
        },
    });
    return user;
};
exports.meService = meService;
