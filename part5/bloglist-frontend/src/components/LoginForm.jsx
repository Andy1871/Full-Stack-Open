import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleLogin({ username, password });
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      // error shown by App
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
