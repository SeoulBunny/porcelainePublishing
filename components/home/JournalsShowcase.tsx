"use client";

// home-latest-journals — canonical implementation of the sitewide Kiln-Stamp
// signature (design-tokens.json devices.cardTreatment). Grid of the 3 latest
// journal covers using the shared KilnCard; batch entrance reveal via
// useBatchReveal. No eyebrow here (this page's one-per-three ration is spent,
// if at all, on home-cta below).

import Link from "next/link";
import { useRef } from "react";
import { KilnCard } from "@/components/shared/KilnCard";
import { latestJournals } from "@/lib/data/journals";
import { getWriter } from "@/lib/data/writers";
import { coverImage, portraitImage } from "@/lib/images";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";

export function JournalsShowcase() {
  const gridRef = useRef<HTMLDivElement>(null);
  useBatchReveal(gridRef);
  const journals = latestJournals(3);

  return (
    <section data-section="home-latest-journals" className="bg-porcelain py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl text-ink sm:text-4xl">Latest journals</h2>
          <Link
            href="/journals"
            className="kiln-hover relative text-sm font-medium text-slate hover:text-ink"
          >
            View all journals
            <span aria-hidden className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
          </Link>
        </div>

        <div ref={gridRef} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {journals.map((journal) => {
            const editor = getWriter(journal.editorIds[0] ?? "");
            const latestIssue = journal.issues[0];
            return (
              <KilnCard
                key={journal.id}
                href={`/journals/${journal.slug}`}
                title={journal.title}
                coverSrc={coverImage(journal.coverSeed)}
                meta={
                  latestIssue
                    ? `Vol. ${latestIssue.volume}, No. ${latestIssue.number}`
                    : journal.frequency
                }
                authorName={editor?.name ?? "Editor"}
                authorHref={editor ? `/about#${editor.id}` : "/about"}
                authorAvatarSrc={editor ? portraitImage(editor.avatarSeed, 96) : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
