import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { resetPasswordUsingUrl } from "../apis/POST_login_apis";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      let token = searchParams.get("token");

      let response = await resetPasswordUsingUrl({ token, password });
      if (response.status == 200) {
        setSubmitted(true);
      }
    } catch (error) {
      setError("link is already expired/used");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Password updated</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your password has been changed successfully.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your new password twice to confirm it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <PasswordField
            id="password"
            label="New password"
            value={password}
            onChange={setPassword}
            visible={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Update password
          </button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
          </Link>
        </form>
      </div>
    </main>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 focus-within:ring-2 focus-within:ring-gray-900">
        <LockKeyhole className="size-4 text-gray-400" aria-hidden="true" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          required
          className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
