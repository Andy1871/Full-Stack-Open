import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useBlogs } from "../stores/blogStore";

const BlogList = () => {
  const blogs = useBlogs();
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ my: 2 }}>
        Blogs
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 600 }}>
        {sortedBlogs.map((blog) => (
          <Card key={blog.id} variant="outlined">
            <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Stack sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{blog.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {blog.author}
                  </Typography>
                </Stack>
                <Chip label={`${blog.likes} likes`} size="small" />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </>
  );
};

export default BlogList;