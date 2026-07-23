// book-detail-meta — Ledger Rail device. Support block is a
// compact key-value list (pages/language/subject-tags/publisher) rather
// than a bordered spec table, avoiding the border-t+border-b-per-row
// anti-pattern. Subject tags link to filtered books-grid views.

import Link from "next/link";
import { LedgerRail } from "@/components/shared/LedgerRail";
import type { Book } from "@/lib/types";

export function BookMeta({ book }: { book: Book }) {
  const facts: [string, string][] = [
    ["Pages", String(book.pages)],
    ["Language", book.language],
    ["Publisher", book.publisher],
  ];

  return (
    // renders data-section="book-detail-meta" via LedgerRail's id prop
    <LedgerRail id="book-detail-meta" heading="Book details">
      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate/70">{label}</p>
            <p className="mt-0.5 text-sm text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-ink">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {book.subjectTags.map((tag) => (
            <Link
              key={tag}
              href={{ pathname: "/books", query: { subject: tag } }}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-slate transition-colors hover:border-sage hover:text-ink"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </LedgerRail>
  );
}
