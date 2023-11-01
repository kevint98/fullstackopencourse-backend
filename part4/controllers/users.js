const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  if (!username || !password) {
    res.status(400).end();
  } else if (password.length < 3) {
    res
      .status(400)
      .send({ error: "password is shorter than the minimum allowed length" });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  }
});

module.exports = usersRouter;
