const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorCountsObj = _.countBy(blogs, "author");
  const [author, count] = _.maxBy(
    Object.entries(authorCountsObj),
    (pair) => pair[1],
  );

  return { author, blogs: count };
};

//Object.entries(authorCountsObj) gives us an array of two-item arrays
//pair[0] is author name, pair[1] is the count
// so (pair) => pair[1] extracts the number for us to compare the max.

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorsBlogs = _.groupBy(blogs, "author");
  const authorLikesArray = Object.entries(authorsBlogs).map(
    ([author, authorBlogs]) => {
      return { author, likes: _.sumBy(authorBlogs, "likes") };
    },
  );

  return _.maxBy(authorLikesArray, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
