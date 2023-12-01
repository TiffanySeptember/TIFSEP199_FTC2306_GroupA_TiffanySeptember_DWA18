import { useState } from "react";
import { Link } from "react-router-dom";
import "../login.css";

const Login = ({ error, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    onLogin({ username, password });
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="user-box">
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Username</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="link-box">
          Not registered? <Link to="/register">Create an account</Link>
        </div>
        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
