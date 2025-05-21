import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setcPass] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/;
  const isPasswordValid = (password) => passwordRegex.test(password);


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!/^(?=.{8,16}$)/.test(value)) {
      setPasswordError("Password must be 8-16 characters long.");
    } else if (!/(?=.*[A-Z])/.test(value)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/(?=.*\d)/.test(value)) {
      setPasswordError("Password must contain at least one number.");
    } else if (!/(?=.*[\W_])/.test(value)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError("");
    }
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    if (password != cpass) {
      alert("Check your passwords and try again..");
      setPassword("");
      setcPass("");
    } else {
      try {
        await axios.post("https://sreemaniramdyeing-backend.onrender.com/api/auth/register", {
          name,
          email,
          password,
          role,
          department,
        });
        alert("Registration Successful!");
        navigate("/");
      } catch (error) {
        alert("Registration Failed: " + error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MdOutlineAlternateEmail className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {showPassword ? (
              <FaEyeSlash className="icon-right" onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye className="icon-right" onClick={() => setShowPassword(true)} />
            )}
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}

          <div className="input-box">
            <input
              type={showCPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={cpass}
              onChange={(e) => setcPass(e.target.value)}
              required
            />
            {showCPassword ? (
              <FaEyeSlash className="icon-right" onClick={() => setShowCPassword(false)} />
            ) : (
              <FaEye className="icon-right" onClick={() => setShowCPassword(true)} />
            )}
          </div>
          <div className="input-box">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="" disabled hidden>
                Person Role
              </option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="input-box">
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="" disabled hidden>
                Department Name
              </option>
              <option value="Chemical">Chemical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
