import request from "supertest";
import app from "../src/app";

describe(
  "GET /api/v1/analytics/:shortCode",
  () => {

  it(
    "should return analytics for valid short code",
    async () => {

      // create link
      const createRes =
        await request(app)
          .post("/api/v1/shorten")
          .send({
            url:
              "https://google.com"
          });

      const code =
        createRes.body.shortCode;

      // generate clicks
      await request(app)
        .get(`/${code}`)
        .redirects(0);

      await request(app)
        .get(`/${code}`)
        .redirects(0);

      // analytics request
      const res =
        await request(app)
          .get(
            `/api/v1/analytics/${code}`
          );

      expect(res.statusCode)
        .toBe(200);

      expect(res.body)
        .toHaveProperty(
          "shortCode"
        );

      expect(res.body)
        .toHaveProperty(
          "totalClicks"
        );

      expect(res.body)
        .toHaveProperty(
          "uniqueClicks"
        );

      expect(res.body)
        .toHaveProperty(
          "clicksByTime"
        );

      expect(res.body)
        .toHaveProperty(
          "deviceBreakdown"
        );
    }
  );

  it(
    "should return 404 for invalid short code",
    async () => {

      const res =
        await request(app)
          .get(
            "/api/v1/analytics/notfound123"
          );

      expect(res.statusCode)
        .toBe(404);
    }
  );

});