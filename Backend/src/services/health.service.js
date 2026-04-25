"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const healthService = async () => {
    await prisma_1.default.$queryRaw `SELECT 1`;
    return {
        status: "ok",
        postgres: "connected",
        uptime: Math.floor(process.uptime()),
        timeStamp: new Date().toISOString()
    };
};
exports.healthService = healthService;
