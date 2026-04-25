"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("GET /api/v1/qr/:shortCode", () => {
    it("should return png qr code", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/v1/qr/test123");
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"])
            .toContain("image/png");
    });
});
