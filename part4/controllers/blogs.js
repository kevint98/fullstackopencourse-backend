const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
	const body = req.body;

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
		});

		const savedBlog = await blog.save();

		res.status(201).json(savedBlog);
	}
});

blogsRouter.delete("/:id", async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
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
