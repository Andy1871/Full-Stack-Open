import { useState, useEffect } from "react";

import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
// import Togglable from "./components/Togglable";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import BlogForm from "./components/BlogForm";
import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (error) {
      setNotification({
        text: "Wrong username or password",
        type: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      throw error;
    }
  };

  const handleLogout = async () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      setNotification({
        text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification({
        text: "Creating a blog failed",
        type: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      throw error;
    }
  };

  const updateBlog = async (id, changedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, changedBlog);
      setBlogs(
        blogs.map((b) => (b.id !== id ? b : { ...returnedBlog, user: b.user })),
      );
    } catch {
      setNotification({
        text: `Blog '${changedBlog.title}' was already removed from the server`,
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      setNotification({
        text: "Deleting blog failed",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      throw error;
    }
  };

  // const blogFormRef = useRef();

  // const blogForm = () => (
  //   <Togglable buttonLabel="create new blog" ref={blogFormRef}>
  //     <BlogForm user={user} addBlog={addBlog} />
  //   </Togglable>
  // );

  const match = useMatch("/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3" } };

  return (
    <Container sx={{ mt: 10 }}>
      <AppBar postition="static">
        <Toolbar>
          <Typography
            variant="button"
            component="h1"
            sx={{ flexGrow: 1, fontSize: "1rem" }}
          >
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={hoverStyle}
              >
                new blog
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
                logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/:id"
          element={
            <Blog
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          }
        />
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/create" element={<BlogForm addBlog={addBlog} />} />
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
      </Routes>
    </Container>
  );

  // return (
  //   <div>
  //     <Notification
  //       errorMessage={errorMessage}
  //       successMessage={successMessage}
  //     />
  //     {!user && loginForm()}
  //     {user && (
  //       <>
  //         <h2>blogs</h2>
  //         <div>
  //           <span>
  //             {user.name} logged in
  //             <button onClick={handleLogout}>logout</button>
  //           </span>
  //           {blogForm()}
  //         </div>

  //         {sortedBlogs.map((blog) => (
  //           <Blog
  //             key={blog.id}
  //             blog={blog}
  //             likeBlog={likeBlog}
  //             deleteBlog={deleteBlog}
  //             user={user}
  //           />
  //         ))}
  //       </>
  //     )}
  //   </div>
  // );
};

export default App;
