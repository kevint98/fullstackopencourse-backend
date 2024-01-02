const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  const user = req.user;

  if (!body.likes) {
    body.likes = 0;
  }

  if (!body.title || !body.url) {
    res.status(400).end();
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  const user = req.user;

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne(blog);
    res
      .status(201)
      .json({ message: "Blog successfully deleted", blog: blog.title });
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
