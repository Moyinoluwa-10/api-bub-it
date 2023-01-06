const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

describe("Home Route", () => {
  it("Should return status true and a message", async () => {
    const response = await api.get("/").set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      message: "Welcome to shortener",
    });
  });

  it("Should return error when routed to undefined route", async () => {
    const response = await api
      .get("/undefined/undefined")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "Route not found",
    });
  });
});
