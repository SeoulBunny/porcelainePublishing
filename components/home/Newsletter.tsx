"use client";

// home-newsletter — a slim inline strip (not a boxed card, distinct layout
// family from home-cta above it), carrying the "subscribe" intent distinct
// from home-cta's "create account" intent. Validation is inline text, never
// a toast, per the manifest.

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <section data-section="home-newsletter" className="border-t border-hairline bg-porcelain py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate">
          Get new issues and chapters in your inbox, roughly once a month.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:w-auto">
          <div className="flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="you@university.edu"
              className="w-full min-w-0 rounded-full border border-hairline bg-porcelain-soft px-4 py-2 text-sm text-ink placeholder:text-slate/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-sage px-5 py-2 text-sm font-semibold text-sage-ink transition-colors hover:bg-sage-hover"
            >
              Subscribe
            </button>
          </div>
          {status === "success" && (
            <p className="text-xs text-success">You&apos;re subscribed. Welcome aboard.</p>
          )}
          {status === "error" && (
            <p className="text-xs text-error">Enter a valid email address to subscribe.</p>
          )}
        </form>
      </div>
    </section>
  );
}
