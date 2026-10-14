import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Link as MuiLink,
  Button,
  Divider,
} from "@mui/material";
import PageNotFound from "./PageNotFound";
import { useBlogActions, useBlogs, useBlogsLoaded } from "../stores/blogStore";
import { useNotificationActions } from "../stores/notificationStore";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Blog = ({ user }) => {
  const id = useParams().id;
  const navigate = useNavigate();
  const { setNotification } = useNotificationActions();
  const { like, remove } = useBlogActions();
  const loaded = useBlogsLoaded();
  const blogs = useBlogs();
  const blog = blogs.find((b) => b.id === id);

  if (!loaded) {
    return <p>loading...</p>;
  }

  if (!blog) {
    return <PageNotFound />;
  }

  const likeBlog = async () => {
    try {
      await like(blog.id);
    } catch {
      setNotification(
        `Blog '${blog.title}' was already removed from the server`,
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      try {
        await remove(blog.id);
        navigate("/");
      } catch {
        setNotification("Deleting blog failed", "error");
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
        Added by {blog.user.name}
      </Typography>

      <Typography gutterBottom>
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

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <CommentForm blogId={blog.id} />
      <CommentList comments={blog.comments} />
    </Box>
  );
};

export default Blog;
