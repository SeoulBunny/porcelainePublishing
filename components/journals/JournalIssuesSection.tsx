"use client";

// journal-detail-issue-selector + journal-detail-articles as one stateful
// module (selecting an issue updates the article list below without a full
// page reload), each rendering its own Ledger Rail section (markers "C" and
// "D"). Article rows are a distinct genre from the Kiln-Stamp cover card
// (list rows, not cover-dominant tiles) since articles carry no cover art of
// their own.

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { LedgerRail } from "@/components/shared/LedgerRail";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";
import type { Journal } from "@/lib/types";
import { getWriter } from "@/lib/data/writers";

export function JournalIssuesSection({ journal }: { journal: Journal }) {
  const [issueIndex, setIssueIndex] = useState(0);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  useBatchReveal(listRef, "[data-reveal-item]");

  const issue = journal.issues[issueIndex];

  const articles = useMemo(() => {
    if (!issue) return [];
    const q = query.trim().toLowerCase();
    if (!q) return issue.articles;
    return issue.articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.abstract.toLowerCase().includes(q),
    );
  }, [issue, query]);

  return (
    <>
      {/* renders data-section="journal-detail-issue-selector" via LedgerRail's id prop */}
      <LedgerRail id="journal-detail-issue-selector" heading="Browse issues">
        <label htmlFor="issue-select" className="mb-1.5 block text-sm font-medium text-ink">
          Volume &amp; issue
        </label>
        <select
          id="issue-select"
          value={issueIndex}
          onChange={(e) => setIssueIndex(Number(e.target.value))}
          className="w-full max-w-xs rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
        >
          {journal.issues.map((iss, i) => (
            <option key={`${iss.volume}-${iss.number}`} value={i}>
              Vol. {iss.volume}, No. {iss.number} &middot; {iss.publishedAt}
            </option>
          ))}
        </select>
      </LedgerRail>

      {/* renders data-section="journal-detail-articles" via LedgerRail's id prop */}
      <LedgerRail id="journal-detail-articles" heading="Articles in this issue">
        <div className="mb-6">
          <label htmlFor="article-search" className="sr-only">
            Search articles in this issue
          </label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles in this issue"
            className="w-full max-w-sm rounded-full border border-hairline bg-porcelain px-4 py-2 text-sm text-ink placeholder:text-slate/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          />
        </div>

        {articles.length === 0 ? (
          <p className="text-sm text-slate">No articles match your search in this issue.</p>
        ) : (
          <div ref={listRef} className="divide-y divide-hairline">
            {articles.map((article) => {
              const authors = article.authorIds.map(getWriter).filter(Boolean);
              return (
                <article key={article.id} data-reveal-item className="py-6 first:pt-0">
                  <h3 className="kiln-hover relative w-fit font-heading text-lg text-ink">
                    <Link href={`/journals/${journal.slug}#${article.id}`}>{article.title}</Link>
                    <span aria-hidden className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    {authors.map((a) => a!.name).join(", ")} &middot;{" "}
                    <span className="font-mono-bib">{article.publishedAt}</span>
                  </p>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-slate">
                    {article.abstract}
                  </p>
                  <Link
                    href={`/journals/${journal.slug}#${article.id}`}
                    className="mt-2 inline-block text-sm font-medium text-slate hover:text-ink"
                  >
                    Read &rarr;
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </LedgerRail>
    </>
  );
}
