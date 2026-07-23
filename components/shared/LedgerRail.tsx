"use client";

// The Ledger Rail — the one named rhythm device applied uniformly across
// every section of About, Journal Detail, and Book Detail (design-tokens.json
// named_rules "Layout-rhythm lock"): a left-aligned heading, with a
// right-side support block that changes shape per section's content while
// the shell itself never changes.

import { useRef } from "react";
import { useFadeUp } from "@/lib/motion/useFadeUp";

export function LedgerRail({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section
      ref={ref}
      data-section={id}
      className="border-t border-hairline py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-16">
          <div>
            <h2 className="font-heading text-2xl text-ink sm:text-3xl">{heading}</h2>
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
