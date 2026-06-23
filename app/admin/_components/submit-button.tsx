"use client";

import { useFormStatus } from "react-dom";

const BASE =
  "eyebrow inline-flex items-center justify-center px-6 py-3 transition-colors duration-[var(--dur)] disabled:opacity-50";

export function SubmitButton({
  children,
  variant = "outline",
  pendingLabel,
}: {
  children: React.ReactNode;
  variant?: "outline" | "solid";
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const styles =
    variant === "solid"
      ? "bg-ink text-porcelain hover:bg-body"
      : "border border-ink text-ink hover:bg-ink hover:text-porcelain";
  return (
    <button type="submit" disabled={pending} className={`${BASE} ${styles}`}>
      {pending ? pendingLabel ?? "Working…" : children}
    </button>
  );
}
