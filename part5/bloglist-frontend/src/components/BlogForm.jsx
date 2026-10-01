import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack } from "@mui/material";

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleAddBlog = async (event) => {
    event.preventDefault();

    try {
      await addBlog({
        title: title,
        author: author ? author : "",
        url: url,
      });

      setTitle("");
      setAuthor("");
      setUrl("");
      navigate("/");
    } catch {
      // empty as handled in App
    }
  };

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={handleAddBlog}>
        <Stack spacing={1} sx={{ maxWidth: 300 }}>
          <TextField
            id="blog-title"
            label="title"
            type="text"
            variant="outlined"
            margin="normal"
            size="small"
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            id="blog-author"
            label="author"
            type="text"
            variant="outlined"
            margin="normal"
            size="small"
            value={author}
            onChange={handleAuthorChange}
          />
          <TextField
            id="blog-url"
            label="url"
            type="text"
            variant="outlined"
            margin="normal"
            size="small"
            value={url}
            onChange={handleUrlChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
          >
            create
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default BlogForm;
