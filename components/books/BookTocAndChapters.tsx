"use client";

// book-detail-toc + book-detail-chapters as one stateful module: the TOC
// is a numbered anchor-link column -- numbering is legitimate
// here, this is a real ordered table of contents -- and book-detail-chapters
// is the chapter preview list it points into. An
// IntersectionObserver (never a scroll listener) tracks which chapter is in
// view and marks its TOC entry with an accent-sage left rule.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LedgerRail } from "@/components/shared/LedgerRail";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";
import type { Book } from "@/lib/types";

export function BookTocAndChapters({ book }: { book: Book }) {
  const [activeChapter, setActiveChapter] = useState<string | null>(book.chapters[0]?.id ?? null);
  const listRef = useRef<HTMLDivElement>(null);
  useBatchReveal(listRef, "[data-reveal-item]");

  useEffect(() => {
    const els = book.chapters
      .map((c) => document.getElementById(`chapter-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveChapter(topMost.target.id.replace("chapter-", ""));
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [book.chapters]);

  return (
    <>
      {/* renders data-section="book-detail-toc" via LedgerRail's id prop */}
      <LedgerRail id="book-detail-toc" heading="Table of contents">
        <ol className="space-y-1">
          {book.chapters.map((chapter) => {
            const active = activeChapter === chapter.id;
            return (
              <li key={chapter.id}>
                <a
                  href={`#chapter-${chapter.id}`}
                  className={`flex gap-3 border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                    active ? "border-sage text-ink" : "border-transparent text-slate hover:text-ink"
                  }`}
                >
                  <span className="font-mono-bib text-slate/70">
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  {chapter.title}
                </a>
              </li>
            );
          })}
        </ol>
      </LedgerRail>

      {/* renders data-section="book-detail-chapters" via LedgerRail's id prop */}
      <LedgerRail id="book-detail-chapters" heading="Chapter previews">
        <div ref={listRef} className="divide-y divide-hairline">
          {book.chapters.map((chapter) => (
            <article
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              data-reveal-item
              className="scroll-mt-24 py-6 first:pt-0"
            >
              <h3 className="kiln-hover relative w-fit font-heading text-lg text-ink">
                <Link href={`#chapter-${chapter.id}`}>
                  {chapter.number}. {chapter.title}
                </Link>
                <span aria-hidden className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
              </h3>
              <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-slate">
                {chapter.preview}
              </p>
              <Link
                href={`#chapter-${chapter.id}`}
                className="mt-2 inline-block text-sm font-medium text-slate hover:text-ink"
              >
                Read &rarr;
              </Link>
            </article>
          ))}
        </div>
      </LedgerRail>
    </>
  );
}
