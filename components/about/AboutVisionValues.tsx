// about-vision-values — Ledger Rail device continued. Support
// block: 3 named editorial values as plain text with weight/spacing
// hierarchy, no icon-per-item grid (that would repeat a card-grid layout
// family already used elsewhere on the page).

import { LedgerRail } from "@/components/shared/LedgerRail";

const VALUES = [
  {
    name: "Rigor over reach",
    body: "We would rather publish fewer pieces we can stand behind than chase submission volume. Every accepted manuscript passes through editors who work in that discipline.",
  },
  {
    name: "Presentation is respect",
    body: "A reader's attention is not owed to us. Typography, pacing, and image quality are part of how we honor the work someone spent years producing.",
  },
  {
    name: "Access without dilution",
    body: "Open discovery and search should never mean lowering the bar for what gets published. We keep both commitments without trading one against the other.",
  },
] as const;

export function AboutVisionValues() {
  return (
    // renders data-section="about-vision-values" via LedgerRail's id prop
    <LedgerRail id="about-vision-values" heading="Vision and values">
      <dl className="space-y-6">
        {VALUES.map((value) => (
          <div key={value.name}>
            <dt className="font-heading text-lg text-ink">{value.name}</dt>
            <dd className="mt-1 max-w-[65ch] text-sm leading-relaxed text-slate">{value.body}</dd>
          </div>
        ))}
      </dl>
    </LedgerRail>
  );
}
