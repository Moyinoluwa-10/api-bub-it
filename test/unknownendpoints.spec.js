const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

test("requests to unknown endpoints should return a response with status code of 404", async () => {
  await api.get("/undefined/undefined").expect(404);
  await api.post("/undefined/undefined").expect(404);
  await api.put("/undefined/undefined").expect(404);
  await api.patch("/undefined/undefined").expect(404);
  await api.delete("/undefined/undefined").expect(404);
});

