import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

// check that the form calls the event handler it received as props
// with the right details when a new blog is created

test("<BlogForm /> updates parent with the correct blog details onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm addBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const saveButton = screen.getByText("save");

  await user.type(titleInput, "Test Title");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "https://test.com");
  await user.click(saveButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test Title");
  expect(createBlog.mock.calls[0][0].author).toBe("Test Author");
  expect(createBlog.mock.calls[0][0].url).toBe("https://test.com");
});
