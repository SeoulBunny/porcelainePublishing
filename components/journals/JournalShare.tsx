"use client";

// journal-detail-share — Ledger Rail device. Support block is
// the shared ShareRow (copy-link + social icons).

import { LedgerRail } from "@/components/shared/LedgerRail";
import { ShareRow } from "@/components/shared/ShareRow";

export function JournalShare({ title }: { title: string }) {
  return (
    // renders data-section="journal-detail-share" via LedgerRail's id prop
    <LedgerRail id="journal-detail-share" heading="Share this journal">
      <ShareRow title={title} />
    </LedgerRail>
  );
}
