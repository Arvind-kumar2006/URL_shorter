import request from "supertest";
import app from "../src/app";

describe("GET /:shortCode", () => {

  it("should redirect to original URL", async () => {
    const createRes = await request(app)
      .post("/api/v1/shorten")
      .send({
        url: "https://google.com"
      });

    const code =
      createRes.body.shortCode;

    const res = await request(app)
      .get(`/${code}`)
      .redirects(0);

    expect(res.statusCode)
      .toBe(302);

    expect(res.headers.location)
      .toContain("google.com");
  });

  it("should return 404 for invalid short code", async () => {
    const res = await request(app)
      .get("/notfound123")
      .redirects(0);

    expect(res.statusCode)
      .toBe(404);
  });

});