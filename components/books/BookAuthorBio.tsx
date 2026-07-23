// book-detail-author-bio — Ledger Rail device, last of the
// page's 6 sections. Support block is the AuthorBioCard (reused writer
// profile treatment) plus its own bio paragraph.

import { LedgerRail } from "@/components/shared/LedgerRail";
import { AuthorBioCard } from "@/components/shared/AuthorBioCard";
import type { Book } from "@/lib/types";
import { getWriter } from "@/lib/data/writers";

export function BookAuthorBio({ book }: { book: Book }) {
  const authors = book.authorIds.map(getWriter).filter(Boolean);
  if (!authors.length) return null;

  return (
    // renders data-section="book-detail-author-bio" via LedgerRail's id prop
    <LedgerRail id="book-detail-author-bio" heading="About the author">
      <div className="space-y-8">
        {authors.map((author) => (
          <AuthorBioCard key={author!.id} writer={author!} />
        ))}
      </div>
    </LedgerRail>
  );
}
