"use client";

// about-writers-grid — grid, not the Ledger Rail rail shell, since this
// section's content is inherently card-based (distinct from the narrative
// sections around it). A grid section breaking the rhythm here is
// intentional variety, called out explicitly in the manifest, not a missed
// rhythm application.

import { useRef } from "react";
import { writers } from "@/lib/data/writers";
import { WriterCard } from "@/components/shared/WriterCard";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";

export function AboutWritersGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  useBatchReveal(gridRef);

  return (
    <section data-section="about-writers-grid" className="border-t border-hairline bg-porcelain-soft/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl text-ink sm:text-4xl">Writers &amp; editors</h2>
        <p className="mt-3 max-w-2xl text-base text-slate">
          The editorial board and contributing scholars behind Porcelain&apos;s catalog.
        </p>
        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {writers.map((writer) => (
            <WriterCard key={writer.id} writer={writer} />
          ))}
        </div>
      </div>
    </section>
  );
}
