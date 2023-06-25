const supertest = require("supertest");
const app = require("../app");
const userModel = require("../models/user.models");
const { connect, cleanup, disconnect } = require("./database");

describe("Auth Routes", () => {
  beforeAll(() => connect());
  afterEach(() => cleanup());
  afterAll(() => disconnect());

  it("should signup a user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/signup")
      .set("content-type", "application/json")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("msg", "Signup successful!");
    expect(response.body).toHaveProperty("status", true);
  });

  it("should login a user", async () => {
    // create user in the db
    const user = await userModel.create({
      email: "johndoe@gmail.com",
      password: "password",
    });

    // login user
    const response = await supertest(app)
      .post("/api/v1/auth/login")
      .set("content-type", "application/json")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("msg", "User logged in successfully");
    expect(response.body).toHaveProperty("status", true);
  });
});
