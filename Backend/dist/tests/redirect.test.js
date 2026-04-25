"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("GET /:shortCode", () => {
    it("should redirect to original URL", async () => {
        const createRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/shorten")
            .send({
            url: "https://google.com"
        });
        const code = createRes.body.shortCode;
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/${code}`)
            .redirects(0);
        expect(res.statusCode)
            .toBe(302);
        expect(res.headers.location)
            .toContain("google.com");
    });
    it("should return 404 for invalid short code", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/notfound123")
            .redirects(0);
        expect(res.statusCode)
            .toBe(404);
    });
});
