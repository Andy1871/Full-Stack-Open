import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useUserActions } from "../stores/userStore";
import { useNotificationActions } from "../stores/notificationStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUserActions()
  const { setNotification } = useNotificationActions()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ username, password });
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      setNotification("Wrong username or password", "error");
    }
  };

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="standard-username-input"
            label="username"
            type="text"
            variant="standard"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            id="standard-password-input"
            label="password"
            type="password"
            variant="standard"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
