const supertest = require("supertest");
const app = require("../app");
const urlModel = require("../models/url.models");
const { connect, cleanup, disconnect } = require("./database");

describe("URL Route", () => {
  let userID;
  let urlID;
  let verificationToken;
  const agent = supertest.agent(app);

  const user = {
    email: "johndoe@gmail.com",
    password: "password",
    isVerified: true,
  };

  const adminUser = {
    email: "john@gmail.com",
    password: "secret",
    isVerified: true,
    role: "admin",
  };

  const url = {
    longUrl: "https://google.com",
  };

  const customUrl = {
    longUrl: "https://google.com",
    custom: "google",
  };

  beforeAll(() => connect());

  beforeEach(async () => {
    await agent.post("/api/v1/auth/signup").send(user);

    await agent
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
  });

  afterEach(() => cleanup());

  afterAll(() => disconnect());

  it("create a short URL", async () => {
    const response = await agent.post("/api/v1/urls/shorten").send(url);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "msg",
      "ShortURL created successfully"
    );
    expect(response.body).toHaveProperty("url");
  });

  it("should generate a qrcode for a short URL", async () => {
    const res = await agent.post("/api/v1/urls/shorten").send(url);
    urlID = res.body.url._id;
    const response = await agent.get(`/api/v1/urls/generate/${urlID}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "Qrcode generated successfully"
    );
    expect(response.body).toHaveProperty("qrcode");
    expect(response.body).toHaveProperty("url");
  });

  it("should disable a short URL", async () => {
    const res = await agent.post("/api/v1/urls/shorten").send(url);
    urlID = res.body.url._id;
    const response = await agent.get(`/api/v1/urls/disable/${urlID}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "ShortURL disabled successfully"
    );
    expect(response.body).toHaveProperty("url");
    expect(response.body).toHaveProperty("url.active", false);
  });

  it("should enable a short URL", async () => {
    const res = await agent.post("/api/v1/urls/shorten").send(url);
    urlID = res.body.url._id;
    const response = await agent.get(`/api/v1/urls/enable/${urlID}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "ShortURL enabled successfully"
    );
    expect(response.body).toHaveProperty("url");
    expect(response.body).toHaveProperty("url.active", true);
  });

  it("return a list of all URLs", async () => {
    await agent.post("/api/v1/auth/signup").send(adminUser);
    await agent
      .post("/api/v1/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });

    const response = await agent.get("/api/v1/urls/all");

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "All shortURLs fetched successfully"
    );
    expect(response.body).toHaveProperty("urls");
    expect(response.body).toHaveProperty("count");
  });

  it("should get a short URL", async () => {
    const res = await agent.post("/api/v1/urls/shorten").send(url);
    urlID = res.body.url._id;
    const response = await agent.get(`/api/v1/urls/${urlID}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "ShortURL fetched successfully"
    );
    expect(response.body).toHaveProperty("url");
  });

  it("should return the URLs of a particular user", async () => {
    await agent
      .post("/api/v1/urls/shorten")
      .send({ longUrl: "https://google.com" });
    await agent
      .post("/api/v1/urls/shorten")
      .send({ longUrl: "https://github.com" });
    const response = await agent.get("/api/v1/urls/user");

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "msg",
      "All shortURLs fetched successfully"
    );
    expect(response.body).toHaveProperty("urls");
    expect(response.body).toHaveProperty("count", 2);
  });

  it("should delete a short URL", async () => {
    const res = await agent.post("/api/v1/urls/shorten").send(url);
    urlID = res.body.url._id;
    const response = await agent.delete(`/api/v1/urls/${urlID}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "ShortURL deleted successfully",
    });
  });

  it("should return 401 Unauthorized if not authenticated", async () => {
    const response = await supertest(app).get("/api/v1/urls/users");

    // Assertions
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ msg: "Authentication Invalid" });
  });
});
