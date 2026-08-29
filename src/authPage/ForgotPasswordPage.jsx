import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestingUrlResetPassword } from "../apis/POST_login_apis";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isBtnDiabled, setisBtnDiabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setisBtnDiabled(true);
    let res = await requestingUrlResetPassword({ email });
    setisBtnDiabled(false);

    if (res.status == 200) {
      setSubmitted(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Check your email
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              If an account exists for{" "}
              <span className="font-medium text-gray-700">{email}</span>,
              we&apos;ll send a password reset link shortly.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-900"
                >
                  Email address
                </label>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 focus-within:ring-2 focus-within:ring-gray-900">
                  <Mail className="size-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button
                disabled={isBtnDiabled}
                type="submit"
                className="rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition-colors disabled:text-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Send reset link
              </button>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 "
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to sign in
              </Link>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
