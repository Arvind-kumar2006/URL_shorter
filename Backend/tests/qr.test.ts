import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/qr/:shortCode", () => {
  it("should return png qr code", async () => {
    const res = await request(app)
      .get("/api/v1/qr/test123");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"])
      .toContain("image/png");
  });
});