const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test",
        username: "testing",
        password: "password",
      },
    });
    await page.goto("http://localhost:5173");
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "testing", "password");

      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "new blog", exact: true }),
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "testing", "fail");

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("Wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByRole("button", { name: "login" })).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "testing", "password");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "Blog Title",
        "Mr Test User",
        "http://blogtitle.com",
      );

      const blogItem = page
        .getByRole("listitem")
        .filter({ hasText: "Blog Title" });
      await expect(blogItem).toBeVisible();
      await expect(blogItem).toContainText("by Mr Test User");
    });

    test("logged-in user can like blogs", async ({ page }) => {
      await createBlog(
        page,
        "Blog Title",
        "Mr Test User",
        "http://blogtitle.com",
      );

      await page.getByRole("link", { name: "Blog Title" }).click();

      await expect(page.getByText("likes: 0")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes: 1")).toBeVisible();
    });

    test("logged-in user can delete a blog", async ({ page }) => {
      await createBlog(
        page,
        "Blog Title",
        "Mr Test User",
        "http://blogtitle.com",
      );

      await page.getByRole("link", { name: "Blog Title" }).click();

      let dialogMessage;
      page.once("dialog", async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });

      const removeButton = page.getByRole("button", { name: "remove" });
      await expect(removeButton).toBeVisible();
      await removeButton.click();

      expect(dialogMessage).toBe('Delete blog "Blog Title"?');

      await expect(page.getByRole("heading", { name: "blogs" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Blog Title" })).toHaveCount(
        0,
      );
    });
  });

  //   test("Only the user who added a blog see's the delete button", async ({
  //     page,
  //     request,
  //   }) => {
  //     await request.post("http://localhost:3003/api/users", {
  //       data: {
  //         name: "Test user 2",
  //         username: "testing2",
  //         password: "password",
  //       },
  //     });
  //     // login as first user
  //     await loginWith(page, "testing", "password");

  //     // create blog
  //     await createBlog(
  //       page,
  //       "Blog Title",
  //       "Mr Test User",
  //       "http://blogtitle.com",
  //     );

  //     // open blog and check for remove button
  //     const blog = page.locator(".blog").filter({ hasText: "Blog Title" });
  //     await blog.getByRole("button", { name: "view" }).click();
  //     await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

  //     // logout, then login as second user
  //     await page.getByRole("button", { name: "logout" }).click();

  //     await loginWith(page, "testing2", "password");

  //     // check for blog, then view and check button does not exist
  //     await expect(page.getByText("Blog Title")).toBeVisible();
  //     await blog.getByRole("button", { name: "view" }).click();
  //     await expect(
  //       page.getByRole("button", { name: "remove" }),
  //     ).not.toBeVisible();
  //   });

  //   test("that blogs are arranged in descending order of likes", async ({
  //     request,
  //     page,
  //   }) => {
  //     const loginResponse = await request.post(
  //       "http://localhost:3003/api/login",
  //       {
  //         data: { username: "testing", password: "password" },
  //       },
  //     );

  //     const { token } = await loginResponse.json();

  //     await request.post("http://localhost:3003/api/blogs", {
  //       headers: { Authorization: `Bearer ${token}` },
  //       data: {
  //         title: "Blog with the least likes",
  //         author: "testing",
  //         url: "http://testingblog1.com",
  //         likes: 3,
  //       },
  //     });

  //     await request.post("http://localhost:3003/api/blogs", {
  //       headers: { Authorization: `Bearer ${token}` },
  //       data: {
  //         title: "Blog with second most likes",
  //         author: "testing",
  //         url: "http://testingblog2.com",
  //         likes: 9,
  //       },
  //     });

  //     await request.post("http://localhost:3003/api/blogs", {
  //       headers: { Authorization: `Bearer ${token}` },
  //       data: {
  //         title: "Blog with the most likes",
  //         author: "testing",
  //         url: "http://testingblog3.com",
  //         likes: 25,
  //       },
  //     });

  //     await page.reload();

  //     await loginWith(page, "testing", "password");

  //     await expect(page.locator(".blog").first()).toBeVisible();

  //     const titles = await page.locator(".blog").allTextContents();
  //     console.log(titles);

  //     expect(titles[0]).toContain("Blog with the most likes");
  //     expect(titles[1]).toContain("Blog with second most likes");
  //     expect(titles[2]).toContain("Blog with the least likes");
  //   });
});
