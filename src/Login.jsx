import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "./baseUrl";

const Login = () => {
  let navigate = useNavigate();
  // Default values set kar di hain taaki use zyada mehnat na karni pade
  const [formData, setFormData] = useState({
    email: "themostbeautiful@neha.com", 
    password: "", 
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
    const response = await fetch(`${baseUrl()}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.error) {
      // Error message ko bhi thoda filmy rakhte hain
      return errorSet("Galat password! Itni jaldi bhool gayi? 😏");
    }
    isLoginedSet(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  // Success message ko customize kiya
  const message = error ? error : isLogined ? "Access Granted! Chalo......." : "";
  const messageState = error ? "is-error" : isLogined ? "is-success" : "";

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          {/* Badge badal diya */}
          <div className="login-badge">NEHA ONLY</div> 
          <h2>Identify Yourself!</h2>
          <p>Are you the real Neha? Prove it by entering the secret key. 🔐</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            V.I.P Email
          </label>
          <input
            id="email"
            className="login-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="themostbeautiful@neha.com"
            required
          />

          <label className="login-label" htmlFor="password">
            Secret Password (Hint: Sundar...)
          </label>
          <input
            id="password"
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Kuch yaad aaya?"
            required
          />

          <button className="login-button" type="submit">
            Unlock Cuteness ✨
          </button>

          {message ? (
            <div className={`login-message ${messageState}`}>{message}</div>
          ) : null}
        </form>

        <div className="login-footer">
          Guest access?{" "}
          <span style={{color: '#8b5cf6', cursor:"pointer", textDecoration: 'underline'}} onClick={()=>{navigate("/register");}}>
           le for strangers!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;