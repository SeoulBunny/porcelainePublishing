// about-history — Ledger Rail device continued. Support block:
// a compact horizontal timeline strip (Seoul founding through present),
// static (non-interactive) text/date pairs.

import { LedgerRail } from "@/components/shared/LedgerRail";

const MILESTONES = [
  { year: "2014", label: "Founded in Seoul with a single linguistics journal." },
  { year: "2018", label: "First book imprint launches alongside four active journals." },
  { year: "2022", label: "Contributor base expands past twenty countries." },
  { year: "2026", label: "Gallery-quality platform relaunch, built around the maker's mark." },
] as const;

export function AboutHistory() {
  return (
    // renders data-section="about-history" via LedgerRail's id prop
    <LedgerRail id="about-history" heading="History">
      <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {MILESTONES.map((m) => (
          <li key={m.year} className="border-t border-hairline pt-4">
            <p className="font-mono-bib text-sm text-slate">{m.year}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{m.label}</p>
          </li>
        ))}
      </ol>
    </LedgerRail>
  );
}
