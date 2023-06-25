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

  const publishedBlog = {
    title: "How to plant a tulip",
    description: "Learn how to plant a tulip",
    body: "Get a pot, add soil, add water, add tulip",
    state: "published",
    tags: "plants tulip sun",
  };

  const fullPublishedBlog = {
    title: "A nice tree",
    description: "Learn about trees",
    body: "What are trees? Trees are plants that have a trunk and branches. They have leaves and flowers. They grow from seeds. They are green. They are good for the environment. They are good for the air. They are good for the soil. They are good for the water. They are good for the animals. They are good for the people. They are good for the world.",
    author: "abiodun badman",
    authorID: "63ba234561c5d516d757a726",
    state: "published",
    tags: "trees",
    reading_time: 2,
    read_count: 4,
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

  it("should get a list of published blogs", async () => {
    const blogPost = await blogModel.create(fullPublishedBlog);
    const blogPost2 = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(publishedBlog);

    const response = await supertest(app).get("/api/v0/blog/");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blogs");
  });

  it("should get a published blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(publishedBlog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .get(`/api/v0/blog/${blogID}`)
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
    expect(response.body.blog.state).toBe("published");
    expect(response.body.blog.read_count).toBe(1);
  });

  it("should get a list of user blogs", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(publishedBlog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .get(`/api/v0/blog/user/${userID}`)
      .set("Authorization", `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blogs");
  });

  it("should create a blog", async () => {
    const response = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(blog);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog created successfully");
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

  it("should delete a blog", async () => {
    const blogPost = await supertest(app)
      .post("/api/v0/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(publishedBlog);
    blogID = blogPost.body.blog._id;

    const response = await supertest(app)
      .delete(`/api/v0/blog/${blogID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog deleted successfully");
  });
});

