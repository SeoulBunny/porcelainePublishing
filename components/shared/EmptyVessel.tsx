import { VesselMark } from "@/components/shared/VesselMark";

/**
 * The "Unglazed vessel" empty-state substitute (design-tokens.json
 * devices.emptyState): stands in for a missing cover/portrait image. Never a
 * gray box or broken-image glyph — a flat neutral panel bearing the vessel
 * silhouette at a third scale plus the title's initial letter.
 */
export function EmptyVessel({ initial, className }: { initial: string; className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-hairline/60 ${className ?? ""}`}
    >
      <VesselMark className="h-10 w-10 text-slate/35" strokeWidth={1.1} />
      <span className="font-heading text-2xl text-ink">{initial}</span>
    </div>
  );
}
