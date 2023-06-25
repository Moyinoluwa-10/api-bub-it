const supertest = require("supertest");
const app = require("../app");
const blogModel = require("../models/blog.model");
const { connect, cleanup, disconnect } = require("./database");

describe("Blog Route", () => {
  let userID;
  let blogID;

  const user = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    password: "password1",
    username: "johndoe",
    country: "nigeria",
  };

  const blog = {
    title: "How to Start a Blog That Makes You Money",
    description: "Learn how to start a blog that makes you money",
    body: "Anyone can start a blog that makes money. Seriously. Some of you can even generate enough money from your blog to quit your job. Don't believe me? My blog gets over 2,436,100 visitors annually and generates more than one million dollars in revenue.",
    tags: "money blog business",
  };

  beforeAll(() => connect());

  beforeEach(async () => {
    const signupResponse = await supertest(app).post("/signup").send(user);

    userID = signupResponse.body.user._id;

    const loginResponse = await supertest(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: user.email,
        password: user.password,
      });

    token = loginResponse.body.token;
  });

  afterEach(() => cleanup());

  afterAll(() => disconnect());

  it("should get a draft blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(blog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .get(`/api/v0/blog/draft/${blogID}`)
      .set("Authorization", `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blog");
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("reading_time");
    expect(response.body.blog).toHaveProperty("author");
    expect(response.body.blog).toHaveProperty("createdAt");
    expect(response.body.blog.state).toBe("draft");
    expect(response.body.blog.read_count).toBe(0);
  });

  it("should update a draft blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(blog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .patch(`/api/v0/blog/draft/${blogID}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Rising Sun" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Draft blog updated successfully");
    expect(response.body.blog.title).toBe("Rising Sun");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("author");
    expect(response.body.blog.state).toBe("draft");
  });

  it("should publish a draft blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(blog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .patch(`/api/v0/blog/draft/publish/${blogID}`)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog published successfully");
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog.state).toBe("published");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should delete a draft blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(blog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .delete(`/api/v0/blog/draft/${blogID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Draft blog deleted successfully");
  });
});

