"use client";

// Specialized admin login — deliberately separate from the reader-facing
// AuthForm (no OAuth buttons, no signup path, no "remember me"). Same "mock
// only" ground rule as the rest of auth on this site: submit resolves to a
// mock session via useMockAuth, always tagged asAdmin since this form's only
// purpose is reaching the gated /admin mockup.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VesselMark } from "@/components/shared/VesselMark";
import { useMockAuth } from "@/lib/auth/mock-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setStatus("error");
      setErrorMessage("Enter your admin email and password to continue.");
      return;
    }

    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      signIn(email, { asAdmin: true });
      window.setTimeout(() => router.push("/admin"), 500);
    }, 600);
  }

  return (
    <section data-section="admin-login-form" className="flex min-h-[80vh] items-center justify-center bg-porcelain px-4 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-hairline bg-porcelain-soft p-6 shadow-[0_16px_40px_-24px_rgba(26,32,44,0.18)] sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <VesselMark className="h-8 w-8 text-sage" />
            <div>
              <h1 className="font-heading text-2xl text-ink">Admin sign-in</h1>
              <p className="mt-1 text-sm text-slate">Restricted to Porcelain Publishing staff.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="admin-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@porcelainpublishing.example"
                className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="admin-password" className="text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            {status === "error" && errorMessage && (
              <p role="alert" className="text-sm text-error">
                {errorMessage}
              </p>
            )}
            {status === "success" && (
              <p role="status" className="text-sm text-success">
                Signed in. Redirecting to the dashboard...
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
              Sign in to admin
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate">
            This is a UI mockup — any email and password combination signs you in.
          </p>
        </div>
      </div>
    </section>
  );
}
