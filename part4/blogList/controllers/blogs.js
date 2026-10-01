const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    ...body,
    user: user.id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    const populatedBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
    });
    response.status(201).json(populatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "only creator of blog can delete" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;
  blog.user = user;

  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  response.json(populatedBlog);
});

module.exports = blogsRouter;
