import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { baseUrl } from "../baseUrl";
import { Link, useNavigate } from "react-router-dom";
import { sendingAuthCode } from "../../utils/authCodeLogin";

export default function Login() {
  const [username, setUsername] = useState("luicy@gmail.com");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogined, isLoginedSet] = useState(false);
  const [error, errorSet] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("message", handlingPopUpMessage);
    return () => {
      window.removeEventListener("message", handlingPopUpMessage);
    };
  }, []);

  const handlingPopUpMessage = async (e) => {
    let { code, from } = e.data;
    if (from === "Git_auth") {
      let { message, isLogin } = await sendingAuthCode({
        code,
        from,
        origin: e.origin,
      });
      if (isLogin) {
        navigate("/");
      }
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let { code, iss: origin } = tokenResponse;
      let { message, isLogin } = await sendingAuthCode({
        code,
        from: "Google_auth",
        origin,
      });
      if (isLogin) {
        navigate("/");
      }
    },
    flow: "auth-code",

    onError: (error) => console.log("Login Failed:", error),
  });

  function handleGitHubSignIn() {
    const clientId = "Ov23libALxbcDvmBJaII";
    const redirectUri = "http://localhost:5500/gitcallback";
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
    window.open(githubUrl, "popup", "width=500 height=700 left=500 top=100");
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const response = await fetch(`${baseUrl()}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (data.error) {
        return errorSet(data.message);
      }

      isLoginedSet(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      errorSet("server offline");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your credentials to login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-900"
            >
              Username
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 focus-within:ring-2 focus-within:ring-gray-900">
              <User className="size-4 text-gray-400" aria-hidden="true" />
              <input
                id="username"
                type="email"
                value={username}
                required
                onChange={(e) => {
                  (setUsername(e.target.value), errorSet(""));
                }}
                placeholder="Enter your email"
                className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-900"
            >
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 focus-within:ring-2 focus-within:ring-gray-900">
              <Lock className="size-4 text-gray-400" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => {
                  (setPassword(e.target.value), errorSet(""));
                }}
                placeholder="Enter your password"
                className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gray-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Login
          </button>

          {/* Error or Success Message */}
          <div className="text-red-600">{error}</div>

          {isLogined && (
            <div className="text-green-400">
              Login successfully. Redirecting...
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social sign-in */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
                />
              </svg>
              Sign in with Google
            </button>

            <button
              type="button"
              onClick={handleGitHubSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
          <div className="flex">
            <a
              href="#"
              className=" text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
              onClick={() => {
                console.log("clicked on forget pass");
              }}
            >
              Forgot password?
            </a>
            <Link
              to="/register"
              className=" ml-auto text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
