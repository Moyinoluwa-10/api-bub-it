const supertest = require("supertest");
const app = require("../app");
// const urlModel = require("../models/urlModel");
const { connect, disconnect } = require("./db");

describe("Url Route", () => {
  const url = {
    longUrl: "https://jdsafadj.nhhsjs",
  };

  beforeAll(() => connect);

  afterAll(() => disconnect);

  it("should create a shortUrl", async () => {
    const response = await supertest(app)
      .post("/api/v0/url/shorten")
      .set("content-type", "application/json")
      .send({ longUrl: "https://mamesake.com" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Server Error");
    expect(response.body.url).toHaveProperty("longUrl");
    expect(response.body.url).toHaveProperty("shortUrl");
    expect(response.body.url).toHaveProperty("urlCode");
    expect(response.body.url).toHaveProperty("createdAt");
  });
});

