import request from "supertest";
import redis from "../src/lib/redis";

describe("Rate Limiter", () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ENABLE_LIMITER = "true";

    if (!redis.isOpen) {
      await redis.connect();
    }

    app = (await import("../src/app")).default;
  });

  afterAll(async () => {
    delete process.env.ENABLE_LIMITER;

    if (redis.isOpen) {
      await redis.quit();
    }
  });

  it("should block after too many requests", async () => {
    let lastRes: any;

    for (let i = 0; i < 25; i++) {
      lastRes = await request(app)
        .post("/api/v1/shorten")
        .send({
          url: "https://google.com"
        });
    }

    expect(lastRes).toBeDefined();
    expect(lastRes.statusCode).toBe(429);
  });
});