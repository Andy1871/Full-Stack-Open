const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Andy",
    url: "https://example.com",
    likes: 3,
  },
  {
    title: "Blog number 2",
    author: "Benjy",
    url: "https://benjy.com",
    likes: 8,
  },
];

let token;
let testUser;

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("password", 10);
  testUser = new User({ username: "testuser", passwordHash });
  await testUser.save();

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser", password: "password" });

  token = loginResponse.body.token;

  await Blog.deleteMany({});
  const blogsWithUser = initialBlogs.map((blog) => ({
    ...blog,
    user: testUser._id,
  }));
  await Blog.insertMany(blogsWithUser);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("verifies the unique identifier property of blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test("a valid blog is added", async () => {
  const newBlog = {
    title: "Testing a new addition",
    author: "Test User",
    url: "https://newblog.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);
  console.log(titles);

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  assert(titles.includes("Testing a new addition"));
});

test("adding a blog fails with 401 if token is not provided", async () => {
  const newBlog = {
    title: "No Token",
    author: "No Token",
    url: "https://notoken.com",
    likes: 0,
  };

  const blogsAtStart = await Blog.find({});

  await api.post("/api/blogs").send(newBlog).expect(401);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
});

test("if likes property is missing, default likes to 0", async () => {
  const newBlog = {
    title: "Testing no likes",
    author: "Test User",
    url: "https://nolikes.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("if new blog has missing title, backend provides status code 400", async () => {
  const newBlog = {
    author: "Test User",
    url: "https://notitle.com",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("if new blog has missing url, backend provides status code 400", async () => {
  const newBlog = {
    title: "missing url test",
    author: "Test User",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("deletion of a blog - succeeds with 204 if id is valid", async () => {
  const blogsAtStart = await api.get("/api/blogs");
  const blogToDelete = blogsAtStart.body[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await api.get("/api/blogs");

  const ids = blogsAtEnd.body.map((blog) => blog.id);
  assert(!ids.includes(blogToDelete.id));

  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);
});

test("Increasing likes by 1 updates the blog post", async () => {
  const blogsAtStart = await api.get("/api/blogs");
  const blogToUpdate = blogsAtStart.body[0];

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
