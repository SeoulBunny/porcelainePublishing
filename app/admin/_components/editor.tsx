"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "./submit-button";
import { getDownloadUrl, postEditorComment, setStatus } from "@/app/admin/_actions/reviews";
import type { ActionState } from "@/lib/action-state";
import type { SubmissionStatus } from "@/lib/db/queries";

const FIELD = "w-full border border-hairline bg-surface px-4 py-3 text-body focus:border-ink focus:outline-none";

function ErrorNote({ state }: { state: ActionState }) {
  if (state.ok || !state.error) return null;
  return <p className="text-sm text-red-700" role="alert">{state.error}</p>;
}

export function DownloadButton({ submissionId, disabled }: { submissionId: string; disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setError(null);
    setBusy(true);
    try {
      const res = await getDownloadUrl(submissionId);
      if (!res.ok || !res.url) throw new Error(res.error ?? "Could not open PDF");
      window.open(res.url, "_blank", "noopener");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open PDF");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={open}
        disabled={disabled || busy}
        className="eyebrow inline-flex items-center border border-ink px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-porcelain disabled:opacity-50"
      >
        {busy ? "Opening…" : disabled ? "No PDF yet" : "View / download PDF"}
      </button>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}

export function EditorCommentForm({ submissionId }: { submissionId: string }) {
  const [state, action] = useActionState(postEditorComment, { ok: true });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="submissionId" value={submissionId} />
      <textarea name="body" rows={4} required maxLength={8000} placeholder="Comments for revision…" className={FIELD} />
      <ErrorNote state={state} />
      <SubmitButton pendingLabel="Sending…">Send to writer</SubmitButton>
    </form>
  );
}

const ACTIONS: { status: Exclude<SubmissionStatus, "submitted" | "published">; label: string; variant: "outline" | "solid" }[] = [
  { status: "in_review", label: "Mark in review", variant: "outline" },
  { status: "changes_requested", label: "Request changes", variant: "outline" },
  { status: "accepted", label: "Accept", variant: "outline" },
  { status: "complete", label: "Mark complete → pass to journal", variant: "solid" },
];

export function StatusControls({ submissionId }: { submissionId: string }) {
  const [state, action] = useActionState(setStatus, { ok: true });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {ACTIONS.map((a) => (
          <form key={a.status} action={action}>
            <input type="hidden" name="submissionId" value={submissionId} />
            <input type="hidden" name="status" value={a.status} />
            <SubmitButton variant={a.variant}>{a.label}</SubmitButton>
          </form>
        ))}
      </div>
      <ErrorNote state={state} />
    </div>
  );
}
