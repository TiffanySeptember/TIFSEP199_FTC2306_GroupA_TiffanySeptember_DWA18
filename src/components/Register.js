import { useState } from "react";
import { Link } from "react-router-dom";
import "../login.css";

const Register = ({ error, onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    onRegister({ username, password });
  };

  return (
    <div className="login-box">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
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
          Already registered? <Link to="/login">Login</Link>
        </div>
        <button>
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

export default Register;
