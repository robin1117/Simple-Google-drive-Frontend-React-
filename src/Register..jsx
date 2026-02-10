import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  let navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "nancy",
    email: "robinsingh@gmail.com",
    password: "abcd",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let response = await fetch("http://localhost:5000/user/register", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    let data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      // navigate("/");
    }, 2000);
  }

  const message = error ? error : isSuccess ? "Account created successfully." : "";
  const messageState = error ? "is-error" : isSuccess ? "is-success" : "";

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">Simple Drive</div>
          <h2>Create your account</h2>
          <p>Start organizing files across devices in minutes.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="login-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />

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
            placeholder="Create a password"
            required
          />

          <button className="login-button" type="submit">
            Create account
          </button>

          {message ? (
            <div className={`login-message ${messageState}`}>{message}</div>
          ) : null}
        </form>

        <div className="login-footer">
          Already have an account?{" "}
          <Link className="login-link" to={"/login"}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
