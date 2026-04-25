"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("POST /api/v1/shorten", () => {
    it("should create short URL", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/shorten")
            .send({
            url: "https://google.com"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("shortCode");
        expect(res.body).toHaveProperty("originalUrl");
    });
    it("should fail for invalid URL", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/shorten")
            .send({
            url: "hello"
        });
        expect(res.statusCode).toBe(400);
    });
    it("should fail when url missing", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/shorten")
            .send({});
        expect(res.statusCode).toBe(400);
    });
});
