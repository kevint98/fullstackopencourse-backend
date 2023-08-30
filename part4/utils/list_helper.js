const dummy = (blogs) => {
  return 1;
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
          delete blog._id;
          delete blog.url;
          delete blog.__v;
          return blog;
        })[0];
};

module.exports = { dummy, totalLikes, favoriteBlog };

//   return blogs.filter((blog) => blog.likes === max);
