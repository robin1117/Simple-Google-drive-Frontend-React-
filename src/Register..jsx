import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  let navigate = useNavigate();
  const [isSusscess, setIsSusscess] = useState(false);
  const [IsError, setIsError] = useState("");
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
    let response = await fetch("http://192.168.1.10:5000/user/register", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    let data = await response.json();

    if (data.error) {
      setIsError(data.error);
      reutrn;
    }

    setIsSusscess(true);
    setTimeout(() => {
      // navigate("/");
    }, 2000);
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
      }}
    >
      <h2>{isSusscess ? "Register SucessFull" : "Registration"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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
        <button
          style={{ backgroundColor: `${isSusscess ? "green" : "red"}` }}
          type="submit"
        >
          Register
        </button>
      </form>
      <div>{IsError}</div>
      <Link to={"/login"}>Login</Link>
    </div>
  );
};

export default Register;
