import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Link as MuiLink, Button } from "@mui/material";

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const id = useParams().id;
  const navigate = useNavigate();

  if (!blog) {
    return null;
  }

  const likeBlog = () => {
    updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id,
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      try {
        await deleteBlog(id);
        navigate("/");
      } catch {
        // empty as handled in app
      }
    }
  };

  const likeButtonHover = {
    ml: 1,
    "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
  };

  const removeButtonHover = {
    ml: 1,
    "&:hover": { bgcolor: "error.main", color: "error.contrastText" },
  };

  return (
    // <div className="blog">
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {blog.title}
      </Typography>

      <Typography variant="body1" gutterBottom>
        by {blog.author}
      </Typography>

      <Typography variant="body2" gutterBottom>
        <MuiLink href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </MuiLink>
      </Typography>

      <Typography variant="body2" gutterBottom>
        Added by {blog.user?.name ?? "unknown"}
      </Typography>

      <Typography>
        {blog.likes} likes{" "}
        {user && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={likeButtonHover}
            onClick={likeBlog}
          >
            like
          </Button>
        )}{" "}
        {user && user.username === blog.user?.username && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={removeButtonHover}
            onClick={handleDelete}
          >
            remove
          </Button>
        )}
      </Typography>
    </Box>
  );
};

export default Blog;
