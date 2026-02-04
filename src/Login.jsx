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
    const response = await fetch("http://192.168.1.10:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    let rootDirId = window.localStorage.setItem("rootDirId", data.rootDirId);

    if (data.error) {
      return errorSet(data.error);
    }
    isLoginedSet(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />
        <button type="submit">Login</button>
      </form>
      <div>{error}</div>
      <div>{isLogined ? "Logined Sucess" : ""}</div>

      <Link to={"/register"}>Register</Link>
    </div>
  );
};

export default Login;
