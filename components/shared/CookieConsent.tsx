"use client";

// Standard cookie consent banner (brief.md §9): accept all, essential-only, or
// dismiss. A persistent global element, not one of the manifest's sections —
// it never appears as page content, only as a fixed bottom strip until the
// visitor makes a choice.

import { useEffect, useState } from "react";

const STORAGE_KEY = "porcelain.cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value: "all" | "essential") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore — banner still dismisses for this session
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-porcelain-soft/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-slate">
          We use essential cookies to run this site and optional analytics cookies to understand
          how it&apos;s used. Read our{" "}
          <a href="/privacy#cookie-policy" className="text-ink underline underline-offset-2 hover:text-slate">
            cookie policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:border-slate"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-sage-ink hover:bg-sage-hover"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
