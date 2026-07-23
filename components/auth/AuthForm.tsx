"use client";

// Adapted from the user's auth form (3d8955ec): the centered-card / OAuth /
// separator / form shape survives, recolored from bg-foreground/dark to
// porcelain surfaces, MynaUI Button/Input/Label/Separator primitives
// replaced with the site's own token-driven markup, OAuth buttons restyled
// with neutral hairline borders (no gradient). Serves both signup-form and
// login-form per the user's own note that the component works for both
// flows -- `mode` swaps field set, copy, and submit action. All copy
// rewritten for Porcelain Publishing; the source's MynaUI placeholder text
// is gone entirely. No real backend: submit resolves to a mock success/
// error state and, on success, signs the mock session in via useMockAuth.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { VesselMark } from "@/components/shared/VesselMark";
import { useMockAuth } from "@/lib/auth/mock-auth";

type Mode = "signup" | "login";

function passwordStrength(value: string): { label: string; tone: "error" | "warning" | "success" } | null {
  if (!value) return null;
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const variety = [hasLower, hasUpper, hasDigit].filter(Boolean).length;
  if (value.length < 8) return { label: "Weak", tone: "error" };
  if (value.length >= 12 && variety >= 3) return { label: "Strong", tone: "success" };
  if (variety >= 2) return { label: "Good", tone: "warning" };
  return { label: "Weak", tone: "error" };
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const strength = useMemo(() => passwordStrength(password), [password]);
  const isSignup = mode === "signup";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setStatus("error");
      setErrorMessage("Enter your email and password to continue.");
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords don't match.");
      return;
    }
    if (isSignup && !termsAccepted) {
      setStatus("error");
      setErrorMessage("Accept the terms of service to create an account.");
      return;
    }

    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      signIn(email, { asAdmin: email.startsWith("admin@") });
      window.setTimeout(() => router.push("/"), 700);
    }, 700);
  }

  // renders data-section="signup-form" or data-section="login-form" depending on mode
  return (
    <section
      data-section={isSignup ? "signup-form" : "login-form"}
      className="bg-porcelain px-4 pb-24 pt-8 sm:px-6"
    >
      <div className="mx-auto w-full max-w-sm">
        <div className="rounded-2xl border border-hairline bg-porcelain-soft p-6 shadow-[0_16px_40px_-24px_rgba(26,32,44,0.18)] sm:p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <VesselMark className="h-8 w-8 text-sage" />
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-hairline py-2.5 text-sm font-medium text-ink transition-colors hover:border-slate"
            >
              <FcGoogle className="h-4 w-4" aria-hidden />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-hairline py-2.5 text-sm font-medium text-ink transition-colors hover:border-slate"
            >
              <FaApple className="h-4 w-4" aria-hidden />
              Continue with Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-slate">
            <div className="h-px flex-1 bg-hairline" />
            or
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
            {isSignup && (
              <div className="grid gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-ink">
                  {isSignup ? "Password" : "Password"}
                </label>
                {isSignup && strength && (
                  <span
                    className={`text-xs font-medium ${
                      strength.tone === "error"
                        ? "text-error"
                        : strength.tone === "warning"
                          ? "text-warning"
                          : "text-success"
                    }`}
                  >
                    {strength.label}
                  </span>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
              {isSignup && (
                <p className="text-xs text-slate">Use at least 8 characters, mixing letters and numbers.</p>
              )}
            </div>

            {isSignup && (
              <div className="grid gap-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium text-ink">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
            )}

            {isSignup ? (
              <label className="flex items-start gap-2 text-sm text-slate">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-hairline text-sage focus:ring-sage/40"
                />
                I agree to the{" "}
                <Link href="/terms" className="text-ink underline underline-offset-2 hover:text-slate">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-ink underline underline-offset-2 hover:text-slate">
                  privacy policy
                </Link>
                .
              </label>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-hairline text-sage focus:ring-sage/40"
                  />
                  Remember me
                </label>
                <Link href="/auth/login#forgot" className="text-slate underline underline-offset-2 hover:text-ink">
                  Forgot password?
                </Link>
              </div>
            )}

            {status === "error" && errorMessage && (
              <p role="alert" className="text-sm text-error">
                {errorMessage}
              </p>
            )}
            {status === "success" && (
              <p role="status" className="text-sm text-success">
                {isSignup ? "Account created. Redirecting..." : "Signed in. Redirecting..."}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-sage py-2.5 text-sm font-semibold text-sage-ink transition-colors hover:bg-sage-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" && (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sage-ink/30 border-t-sage-ink"
                />
              )}
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-ink underline underline-offset-2 hover:text-slate">
                  Log in
                </Link>
              </>
            ) : (
              <>
                New to Porcelain?{" "}
                <Link href="/auth/signup" className="text-ink underline underline-offset-2 hover:text-slate">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
