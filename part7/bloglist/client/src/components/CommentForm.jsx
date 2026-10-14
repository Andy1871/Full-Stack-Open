import { useState } from "react";
import { useBlogActions } from "../stores/blogStore";
import { Box, TextField, Button } from "@mui/material";
import { useNotificationActions } from "../stores/notificationStore";

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const { addComment } = useBlogActions();
  const { setNotification } = useNotificationActions();

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setCommentError("");
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setCommentError("Comment must not be empty");
      return;
    }

    try {
      await addComment(blogId, comment);
      setComment("");
    } catch {
      setNotification("Adding comment failed", "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddComment}
      sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}
    >
      <TextField
        id="blog-comment"
        label="add a comment"
        type="text"
        variant="outlined"
        size="small"
        value={comment}
        onChange={handleCommentChange}
        error={Boolean(commentError)}
        helperText={commentError}
        sx={{ flexGrow: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ height: 40 }}>
        Add comment
      </Button>
    </Box>
  );
};

export default CommentForm;
