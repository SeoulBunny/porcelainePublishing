"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { SubmitButton } from "@/app/admin/_components/submit-button";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="border border-hairline bg-porcelain px-4 py-3 text-sm text-body">
        Check your email to verify your account, then sign in.
      </p>
    );
  }

  return (
    <form
      action={async (formData: FormData) => {
        setError(null);
        const { error } = await signUp.email({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          callbackURL: "/admin",
        });
        if (error) setError(error.message ?? "Could not create your account.");
        else setDone(true);
      }}
      className="space-y-4"
    >
      {error && (
        <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="eyebrow mb-2 block">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full border border-hairline bg-porcelain px-4 py-3 text-body focus:border-ink focus:outline-none"
        />
      </div>
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
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full border border-hairline bg-porcelain px-4 py-3 text-body focus:border-ink focus:outline-none"
        />
        <p className="mt-2 text-sm text-muted">At least 8 characters.</p>
      </div>
      <SubmitButton pendingLabel="Creating…">Create account</SubmitButton>
    </form>
  );
}
