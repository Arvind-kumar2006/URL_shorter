"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/lib/prisma"));
const redis_1 = __importDefault(require("../src/lib/redis"));
afterAll(async () => {
    try {
        await prisma_1.default.$disconnect();
    }
    catch { }
    try {
        if (redis_1.default.isOpen) {
            await redis_1.default.quit();
        }
    }
    catch { }
});
