import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect } from "vitest";
import Blog from "./Blog";

const blog = {
  id: 1,
  title: "Blog title",
  author: "Blog author",
  url: "https://blog.com",
  likes: 5,
  user: {
    username: "testuser",
    name: "Test User",
  },
};

const renderBlog = (user) =>
  render(
    <MemoryRouter>
      <Blog
        blog={blog}
        user={user}
        updateBlog={() => {}}
        deleteBlog={() => {}}
      />
    </MemoryRouter>,
  );

test("blog info and number of likes displayed to unauthenticated users, buttons not displayed", () => {
  renderBlog(null);

  expect(screen.getByText("Blog author: Blog title")).toBeDefined();
  expect(screen.getByText("https://blog.com")).toBeDefined();
  expect(screen.getByText("likes: 5")).toBeDefined();
  expect(screen.getByText("Added by Test User")).toBeDefined();

  expect(screen.queryByRole("button")).toBeNull();
});

test("authenticated users that are not the blog's creator are only shown the like button", async () => {
  renderBlog({ username: "wronguser", name: "Wrong User" });

  expect(screen.getByRole("button", { name: "like" })).toBeDefined();
  expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
});

test("the blog's creator is also shown the delete button", async () => {
  renderBlog({ username: "testuser", name: "Test User" });

  expect(screen.getByRole("button", { name: "like" })).toBeDefined();
  expect(screen.getByRole("button", { name: "remove" })).toBeDefined();
});
