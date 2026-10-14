import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import userService from "../services/users";
import PageNotFound from "./PageNotFound";

const User = () => {
  const [users, setUsers] = useState(null);
  const id = useParams().id;

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users));
  }, []);

  if (users === null) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return <PageNotFound />;
  }

  return (
    <Box sx={{ maxWidth: 600, mt: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            @{user.username}
          </Typography>
        </Box>
        <Chip
          label={`${user.blogs.length} ${user.blogs.length === 1 ? "blog" : "blogs"}`}
          sx={{ ml: "auto" }}
        />
      </Stack>

      <Typography variant="h6" gutterBottom>
        Added blogs
      </Typography>

      {user.blogs.length > 0 ? (
        <Paper variant="outlined">
          <List disablePadding>
            {user.blogs.map((blog, index) => (
              <Box key={blog.id}>
                {index > 0 && <Divider />}
                <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                  <ListItemText
                    primary={blog.title}
                    secondary={`by ${blog.author} · ${blog.likes} likes`}
                  />
                </ListItemButton>
              </Box>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No blogs added yet
        </Typography>
      )}
    </Box>
  );
};

export default User;