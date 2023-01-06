const app = require("../app");
const supertest = require("supertest");

describe("Send Email Route", () => {
  it("send a mail", async () => {
    const response = await supertest(app)
      .post("/api/v1/send-email")
      .set("content-type", "application/json")
      .send({
        name: "John Doe",
        email: "johndoe@gmail.com",
        message: "Would you like to collaborate?",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("message", "Email sent successfully");
  });
});
