"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { SubmitButton } from "@/app/admin/_components/submit-button";

export function SignInForm({ googleEnabled, redirectTo }: { googleEnabled: boolean; redirectTo: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="max-w-md space-y-8 border border-hairline bg-surface p-8">
      {googleEnabled && (
        <>
          <form
            action={async () => {
              await signIn.social({ provider: "google", callbackURL: redirectTo });
            }}
          >
            <SubmitButton variant="solid" pendingLabel="Redirecting…">Continue with Google</SubmitButton>
          </form>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-hairline" />
            <span className="eyebrow text-muted">or</span>
            <span className="h-px flex-1 bg-hairline" />
          </div>
        </>
      )}

      <form
        action={async (formData: FormData) => {
          setError(false);
          const { error } = await signIn.email({
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          });
          if (error) setError(true);
          else window.location.href = redirectTo;
        }}
        className="space-y-4"
      >
        {error && (
          <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            Invalid email or password.
          </p>
        )}
        <div>
          <label htmlFor="email" className="eyebrow mb-2 block">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@institution.edu"
            className="w-full border border-hairline bg-porcelain px-4 py-3 text-body focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="eyebrow mb-2 block">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-hairline bg-porcelain px-4 py-3 text-body focus:border-ink focus:outline-none"
          />
        </div>
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </form>

      <p className="text-sm text-muted">
        No account?{" "}
        <Link href="/register" className="text-ink underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}
