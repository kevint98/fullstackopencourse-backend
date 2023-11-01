const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");
const listHelper = require("../utils/list_helper");

describe("when creating new users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    for (let user of listHelper.initialUsers) {
      let password = user.password;
      const passwordHash = await bcrypt.hash(password, 10);

      const userObj = new User({
        username: user.username,
        name: user.name,
        passwordHash,
      });

      await User.insertMany(userObj);
    }
  });

  test("username and password must be given", async () => {
    const newUser = {
      name: "John Doe",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("username must be at least 3 characters long", async () => {
    const user = {
      name: "John Doe",
      username: "oe",
      password: "myname",
    };

    await api.post("/api/users").send(user).expect(400);
  });

  test("password must be at least 3 characters long", async () => {
    const user = {
      name: "John Doe",
      username: "JDoe",
      password: "jd",
    };

    await api.post("/api/users").send(user).expect(400);
  });

  test("username must be unique", async () => {
    const user = {
      name: "Person Two",
      username: "persontwo",
      password: "second",
    };

    await api.post("/api/users").send(user).expect(400);
  });

  test("user is created with valid information", async () => {
    const user = {
      name: "New Person",
      username: "newperson",
      password: "newperson1",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await listHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(listHelper.initialUsers.length + 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
