const bcrypt = require("bcrypt");
const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({ username: "testuser", name: "test", passwordHash });

    await user.save();
  });

  // invalid user = username is already taken. 
  test("user is not created if username already exists", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testuser",
      name: "test",
      password: "test",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  // invalid user = no username, status code 400
  test("user is not created if no username provided", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "test",
      password: "test",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("`username` is required"));

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  // invalid user = username < 3 characters
  test("user is not created if username < 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "an",
      name: "test",
      password: "test",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("shorter than the minimum allowed length"),
    );

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  // invalid user = missing password
  test("user is not created if password not provided", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "an",
      name: "test",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  // invalid user = password < 3 characters
  test("user is not created if password < 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "an",
      name: "test",
      password: "pw",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
