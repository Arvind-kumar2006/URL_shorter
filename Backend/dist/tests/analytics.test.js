"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("GET /api/v1/analytics/:shortCode", () => {
    it("should return analytics for valid short code", async () => {
        // create link
        const createRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/shorten")
            .send({
            url: "https://google.com"
        });
        const code = createRes.body.shortCode;
        // generate clicks
        await (0, supertest_1.default)(app_1.default)
            .get(`/${code}`)
            .redirects(0);
        await (0, supertest_1.default)(app_1.default)
            .get(`/${code}`)
            .redirects(0);
        // analytics request
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/v1/analytics/${code}`);
        expect(res.statusCode)
            .toBe(200);
        expect(res.body)
            .toHaveProperty("shortCode");
        expect(res.body)
            .toHaveProperty("totalClicks");
        expect(res.body)
            .toHaveProperty("uniqueClicks");
        expect(res.body)
            .toHaveProperty("clicksByTime");
        expect(res.body)
            .toHaveProperty("deviceBreakdown");
    });
    it("should return 404 for invalid short code", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/v1/analytics/notfound123");
        expect(res.statusCode)
            .toBe(404);
    });
});
