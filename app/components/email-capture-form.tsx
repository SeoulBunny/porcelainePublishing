"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "done" | "error";

export function EmailCaptureForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="font-serif text-2xl text-ink">
        Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md">
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="eyebrow">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b border-hairline bg-transparent py-2 text-body outline-none focus:border-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow">Email *</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-hairline bg-transparent py-2 text-body outline-none focus:border-ink"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="eyebrow mt-8 border border-ink px-6 py-3 text-ink transition-colors duration-[var(--dur)] hover:bg-ink hover:text-porcelain disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Request access"}
      </button>
      {status === "error" && (
        <p className="mt-4 text-sm text-muted">
          Something went wrong. (Note: the subscribe endpoint is a stub in this
          preview build.)
        </p>
      )}
    </form>
  );
}
