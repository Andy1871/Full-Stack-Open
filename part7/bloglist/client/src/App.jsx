import { useEffect } from "react";

import BlogList from "./components/BlogList";
// import blogService from "./services/blogs";
// import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
// import Togglable from "./components/Togglable";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import BlogForm from "./components/BlogForm";
import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import PageNotFound from "./components/PageNotFound";
import { useBlogActions } from "./stores/blogStore";
import { useUser, useUserActions } from "./stores/userStore";
import UserList from "./components/UserList";
import User from "./components/User";

const App = () => {
  const { initialize } = useBlogActions();
  const navigate = useNavigate();
  const user = useUser();
  const { logout } = useUserActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // const blogFormRef = useRef();

  // const blogForm = () => (
  //   <Togglable buttonLabel="create new blog" ref={blogFormRef}>
  //     <BlogForm user={user} addBlog={addBlog} />
  //   </Togglable>
  // );

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" } };

  return (
    <Container>
      <AppBar position="static">
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
          <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
            users
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

      <Notification />

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[location.pathname]}
      >
        <Routes>
          <Route path="/blogs/:id" element={<Blog user={user} />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
