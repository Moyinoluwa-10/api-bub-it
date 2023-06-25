const supertest = require("supertest");
const app = require("../app");

test("requests to unknown endpoints should return a response with status code of 404", async () => {
  await supertest(app).get("/undefined/undefined").expect(404);
  await supertest(app).post("/undefined/undefined").expect(404);
  await supertest(app).put("/undefined/undefined").expect(404);
  await supertest(app).patch("/undefined/undefined").expect(404);
  await supertest(app).delete("/undefined/undefined").expect(404);
});

