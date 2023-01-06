const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const urlModel = require("../models/urlModel");
const { connect, cleanup, disconnect } = require("./conn");

describe("Url Route", () => {
  const url = {
    longUrl: "https://github.com",
  };

  const url2 = {
    _id: "63b7ad502c10ff49bb2ca6f3",
    urlCode: "SzsK65wDy",
    longUrl: "https://github.com",
    shortUrl: "https://api-shortener.vercel.app/SzsK65wDy",
    createdAt: "Fri Jan 06 2023 05:10:40 GMT+0000 (Coordinated Universal Time)",
    __v: 0,
  };

  beforeAll(() => connect());
  afterEach(() => cleanup());
  afterAll(() => disconnect());

  it("should create a shortUrl", async () => {
    const response = await api
      .post("/api/v0/url/shorten")
      .set("content-type", "application/json")
      .send(url);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("ShortURL created successfully");
    expect(response.body.url).toHaveProperty("longUrl");
    expect(response.body.url).toHaveProperty("shortUrl");
    expect(response.body.url).toHaveProperty("urlCode");
    expect(response.body.url).toHaveProperty("createdAt");
  });

  it("should return a shortUrl if one already exists", async () => {
    await urlModel.create(url2);

    const response = await api
      .post("/api/v0/url/shorten")
      .set("content-type", "application/json")
      .send(url);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("ShortURL already created");
    expect(response.body.url).toHaveProperty("longUrl");
    expect(response.body.url).toHaveProperty("shortUrl");
    expect(response.body.url).toHaveProperty("urlCode");
    expect(response.body.url).toHaveProperty("createdAt");
  });
});

