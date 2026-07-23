"use client";

// book-detail-share — Ledger Rail device. Identical mechanic to
// JournalShare (copy-link + social icons via ShareRow).

import { LedgerRail } from "@/components/shared/LedgerRail";
import { ShareRow } from "@/components/shared/ShareRow";

export function BookShare({ title }: { title: string }) {
  return (
    // renders data-section="book-detail-share" via LedgerRail's id prop
    <LedgerRail id="book-detail-share" heading="Share this book">
      <ShareRow title={title} />
    </LedgerRail>
  );
}
