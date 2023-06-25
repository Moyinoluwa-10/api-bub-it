const app = require("../app");
const supertest = require("supertest");

describe("Home Route", () => {
  it("should return status an html file", async () => {
    const response = await supertest(app)
      .get("/")
      .set("content-type", "text/html");
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(response.body).toEqual({});
  });

  it("should return error when routed to undefined route", async () => {
    const response = await supertest(app)
      .get("/undefined/undefined")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      msg: "Route does not exist",
    });
  });
});
