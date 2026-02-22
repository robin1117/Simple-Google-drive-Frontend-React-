import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "robinsingh1117@gmail.com",
    password: "12345",
  });
  const [isLogined, isLoginedSet] = useState(false);
  const [error, errorSet] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    errorSet("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.error) {
      return errorSet(data.error);
    }
    isLoginedSet(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  const message = error ? error : isLogined ? "Logged in successfully." : "";
  const messageState = error ? "is-error" : isLogined ? "is-success" : "";

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">Simple Drive</div>
          <h2>Welcome back</h2>
          <p>Sign in to keep your folders synced and secure.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="login-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />

          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <button className="login-button" type="submit">
            Log in
          </button>

          {message ? (
            <div className={`login-message ${messageState}`}>{message}</div>
          ) : null}
        </form>

        <div className="login-footer">
          New here?{" "}
          <Link className="login-link" to={"/register"}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
