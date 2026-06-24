import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "./baseUrl";
import "./register.css";

const Register = () => {
  let navigate = useNavigate();
  const timerRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterBtnDisable, setIsRegisterBtnDisable] = useState(false);
  const [isFirstOtpSend, setIsFirstOtpSend] = useState(false);
  const [isOtpInputOpen, setIsOtpInputOpen] = useState(false);
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [counter, setCounter] = useState(120);
  const [VerifyDisable, setVerifyDisable] = useState(false);
  const [formData, setFormData] = useState({
    name: "nancy",
    email: "robinsingh@gmail.com",
    password: "abcd",
  });

  async function handelVerify(e) {
    console.log('verifiy');
    e.preventDefault();
    setVerifyDisable(true);
    try {
      let response = await fetch(`${baseUrl()}/auth/sent-otp`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      let data = await response.json();

      if (!data.success) {
        setIsFirstOtpSend(false);
        setError(data.message);
      } else {
        triggerCounter();
        setError("");
        setIsFirstOtpSend(true);
        setIsOtpInputOpen(true);
        setIsRegisterBtnDisable(true);
      }
      console.log(data);
    } catch (error) {
      setError("unable to sent OTP");
      console.log(error);
    }
  }

  function triggerCounter(params) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsCounterRunning(true);
    timerRef.current = setInterval(() => {
      setCounter((pre) => {
        if (pre <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setVerifyDisable(false);
          setIsCounterRunning(false);
          return 120;
        }
        return pre - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function handleChange(e) {
    setVerifyDisable(false)
    setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      let responseForVerifiy = await fetch(`${baseUrl()}/auth/verify-otp`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      let dataForVerifiy = await responseForVerifiy.json();
      console.log(dataForVerifiy);
      if (!dataForVerifiy.success) {
        setError(dataForVerifiy.message);
        return;
      }

      // -----------------------------------------------
      let response = await fetch(`${baseUrl()}/user/register`, {
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
      setError("");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log(error);
    }
  }

  const message = error
    ? error
    : isSuccess
      ? "Account created successfully."
      : "";
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
          <div className="emailBox">
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
            <button
              type="button"
              className="verifybtn"
              onClick={handelVerify}
              disabled={VerifyDisable}
            >
              {isCounterRunning
                ? counter
                : isFirstOtpSend
                  ? "Resend"
                  : "Verifiy"}
            </button>
          </div>

          {isOtpInputOpen ? (
            <div>
              <label className="login-label" htmlFor="otp">
                OTP
              </label>
              <input
                id="otp"
                className="login-input"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="check your mail"
                required
              />
            </div>
          ) : (
            ""
          )}

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

          <button
            className="login-button"
            type="submit"
            disabled={!isRegisterBtnDisable}
          >
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
