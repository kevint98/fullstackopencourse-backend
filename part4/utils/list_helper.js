const Blog = require("../models/blog");
const User = require("../models/user");

const dummy = (blogs) => {
  return 1;
};

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  const blogList = blogs.map((blog) => blog.likes);
  const max = Math.max(...blogList);

  return blogs.length === 0
    ? {}
    : blogs
        .filter((blog) => blog.likes === max)
        .map((blog) => {
          return {
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
          };
        })[0];
};

const initialUsers = [
  {
    name: "Person One",
    username: "personone",
    password: "first",
  },
  {
    name: "Person Two",
    username: "persontwo",
    password: "second",
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  dummy,
  initialBlogs,
  blogsInDb,
  totalLikes,
  favoriteBlog,
  initialUsers,
  usersInDb,
};
