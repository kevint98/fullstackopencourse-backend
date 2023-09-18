const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const listHelper = require("../utils/list_helper");

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(listHelper.initialBlogs);
});

test("dummy returns one", () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	expect(result).toBe(1);
});

describe("total likes", () => {
	test("of empty list is zero", () => {
		const blogs = [];

		result = listHelper.totalLikes(blogs);

		expect(result).toBe(0);
	});

	test("when list has only one blog equals the likes of that", () => {
		const listWithOneBlog = [
			{
				_id: "5a422aa71b54a676234d17f8",
				title: "Go To Statement Considered Harmful",
				author: "Edsger W. Dijkstra",
				url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
				likes: 5,
				__v: 0,
			},
		];

		result = listHelper.totalLikes(listWithOneBlog);

		expect(result).toBe(5);
	});

	test("of a bigger list is calculated right", () => {
		const blogs = [
			{
				_id: "5a422a851b54a676234d17f7",
				title: "React patterns",
				author: "Michael Chan",
				url: "https://reactpatterns.com/",
				likes: 7,
				__v: 0,
			},
			{
				_id: "5a422aa71b54a676234d17f8",
				title: "Go To Statement Considered Harmful",
				author: "Edsger W. Dijkstra",
				url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
				likes: 5,
				__v: 0,
			},
			{
				_id: "5a422b3a1b54a676234d17f9",
				title: "Canonical string reduction",
				author: "Edsger W. Dijkstra",
				url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
				likes: 12,
				__v: 0,
			},
			{
				_id: "5a422b891b54a676234d17fa",
				title: "First class tests",
				author: "Robert C. Martin",
				url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
				likes: 10,
				__v: 0,
			},
			{
				_id: "5a422ba71b54a676234d17fb",
				title: "TDD harms architecture",
				author: "Robert C. Martin",
				url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
				likes: 0,
				__v: 0,
			},
			{
				_id: "5a422bc61b54a676234d17fc",
				title: "Type wars",
				author: "Robert C. Martin",
				url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
				likes: 2,
				__v: 0,
			},
		];

		const result = listHelper.totalLikes(blogs);

		expect(result).toBe(36);
	});
});

describe("favourite blog", () => {
	const blogs = [
		{
			_id: "5a422a851b54a676234d17f7",
			title: "React patterns",
			author: "Michael Chan",
			url: "https://reactpatterns.com/",
			likes: 7,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
			likes: 5,
			__v: 0,
		},
		{
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0,
		},
		{
			_id: "5a422b891b54a676234d17fa",
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: 10,
			__v: 0,
		},
		{
			_id: "5a422ba71b54a676234d17fb",
			title: "TDD harms architecture",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
			likes: 0,
			__v: 0,
		},
		{
			_id: "5a422bc61b54a676234d17fc",
			title: "Type wars",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
			likes: 2,
			__v: 0,
		},
	];

	test("from an empty list returns an empty object", () => {
		const result = listHelper.favoriteBlog([]);

		expect(result).toEqual({});
	});

	test("when a list has only one blog, returns that blog", () => {
		const result = listHelper.favoriteBlog([
			{
				_id: "5a422b891b54a676234d17fa",
				title: "First class tests",
				author: "Robert C. Martin",
				url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
				likes: 10,
				__v: 0,
			},
		]);

		expect(result).toEqual({
			title: "First class tests",
			author: "Robert C. Martin",
			likes: 10,
		});
	});

	test("from a list of many, returns the blog with most likes", () => {
		const result = listHelper.favoriteBlog(blogs);

		expect(result).toEqual({
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			likes: 12,
		});
	});
});

describe("when viewing saved blogs", () => {
	test("the correct number of blogs are returned as json", async () => {
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(listHelper.initialBlogs.length);
	});

	test("the unique identifier property of the blog posts is named id", async () => {
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const blogIds = response.body.map((r) => r.id);

		expect(blogIds[0]).toBeDefined();
	});
});

describe("creating a new blog", () => {
	test("succeeds with valid data", async () => {
		const newBlog = {
			title: "This is a new blog",
			author: "New Author",
			url: "www.url.com",
			likes: 6,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await listHelper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1);
	});

	test("defaults number of likes to 0 if like property is missing", async () => {
		const newBlog = {
			title: "This is a new blog",
			author: "New Author",
			url: "www.url.com",
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await listHelper.blogsInDb();

		const likes = blogsAtEnd.map((b) => b.likes);
		const likeToView = likes[likes.length - 1];

		expect(likeToView).toBe(0);
	});

	test("fails with 400 status code if blog title is missing", async () => {
		const newBlog = {
			author: "New Author",
			url: "www.url.com",
		};

		await api.post("/api/blogs").send(newBlog).expect(400);
	});

	test("fails with 400 status code if blog url is missing", async () => {
		const newBlog = {
			title: "This is a new blog",
			author: "New Author",
		};

		await api.post("/api/blogs").send(newBlog).expect(400);
	});
});

describe("deleting a single blog", () => {
	test("succeeds if a valid id is provided", async () => {
		const blogsAtStart = await listHelper.blogsInDb();

		const blogToDelete = blogsAtStart[0];

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

		const blogsAtEnd = await listHelper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length - 1);
	});
});

describe("updating a single blog", () => {
	test("succeeds when changing the number of likes", async () => {
		const blogsAtStart = await listHelper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send({ likes: 70 })
			.expect(200);

		const blogsAtEnd = await listHelper.blogsInDb();

		const likes = blogsAtEnd.map((b) => b.likes);

		expect(likes).toContain(70);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
