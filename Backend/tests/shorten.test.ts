import request from "supertest";
import app from "../src/app";

describe("POST /api/v1/shorten", () => {

  it("should create short URL", async () => {
    const res = await request(app)
      .post("/api/v1/shorten")
      .send({
        url: "https://google.com"
      });

    expect(res.statusCode).toBe(201);

    expect(res.body).toHaveProperty(
      "shortCode"
    );

    expect(res.body).toHaveProperty(
      "originalUrl"
    );
  });

  it("should fail for invalid URL", async () => {
    const res = await request(app)
      .post("/api/v1/shorten")
      .send({
        url: "hello"
      });

    expect(res.statusCode).toBe(400);
  });

  it("should fail when url missing", async () => {
    const res = await request(app)
      .post("/api/v1/shorten")
      .send({});

    expect(res.statusCode).toBe(400);
  });

});