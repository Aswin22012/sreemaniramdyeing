import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      // console.log("UserData::=>",response.data.user);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("Role", response.data.user.role);
      localStorage.setItem("Dept", response.data.user.department);
      login(response.data.token);

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdOutlineAlternateEmail className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash className="icon-right" onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye className="icon-right" onClick={() => setShowPassword(true)} />
            )}
          </div>
          <button type="submit">Sign In</button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
