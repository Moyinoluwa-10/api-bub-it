const app = require("../app");
const supertest = require("supertest");

describe("Home Route", () => {
  it("should return status true and a message", async () => {
    const response = await supertest(app)
      .get("/")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to your Blog",
      status: true,
    });
  });

  it("should return error when routed to undefined route", async () => {
    const response = await supertest(app)
      .get("/undefined/undefined")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "Route not found",
    });
  });
});
