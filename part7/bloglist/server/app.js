const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const { errorHandler, tokenExtractor } = require("./utils/middleware");
const loginRouter = require("./controllers/login");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(express.json());

app.use(tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.use(errorHandler);

module.exports = app;
