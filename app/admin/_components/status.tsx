import type { SubmissionStatus } from "@/lib/db/queries";

const LABELS: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  changes_requested: "Changes requested",
  accepted: "Accepted",
  complete: "Complete",
  published: "Published",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className="eyebrow inline-block border border-hairline bg-surface px-3 py-1 text-muted">
      {LABELS[status]}
    </span>
  );
}

export function statusLabel(status: SubmissionStatus): string {
  return LABELS[status];
}
