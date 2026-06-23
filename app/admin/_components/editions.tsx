"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { createEdition, attachToEdition } from "@/app/admin/_actions/editions";
import type { ActionState } from "@/lib/action-state";
import type { EditionRef } from "@/lib/db/queries";

const FIELD = "border border-hairline bg-surface px-3 py-2 text-body focus:border-ink focus:outline-none";

function ErrorNote({ state }: { state: ActionState }) {
  if (state.ok || !state.error) return null;
  return <p className="mt-1 text-sm text-red-700" role="alert">{state.error}</p>;
}

export function editionLabel(e: EditionRef): string {
  const vi = [e.volume != null ? `Vol ${e.volume}` : null, e.issue != null ? `Issue ${e.issue}` : null]
    .filter(Boolean).join(" · ");
  return e.title ? `${e.title}${vi ? ` (${vi})` : ""}` : vi || e.slug;
}

export function CreateEditionForm({ journalId }: { journalId: string }) {
  const [state, action] = useActionState(createEdition, { ok: true });
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="journalId" value={journalId} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Volume</span>
        <input name="volume" inputMode="numeric" className={`${FIELD} w-24`} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Issue</span>
        <input name="issue" inputMode="numeric" className={`${FIELD} w-24`} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Title (optional)</span>
        <input name="title" className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Published on</span>
        <input type="date" name="publishedOn" className={FIELD} />
      </label>
      <SubmitButton pendingLabel="Creating…">Create issue</SubmitButton>
      <ErrorNote state={state} />
    </form>
  );
}

export function AttachForm({ submissionId, editions }: { submissionId: string; editions: EditionRef[] }) {
  const [state, action] = useActionState(attachToEdition, { ok: true });
  if (editions.length === 0) {
    return <p className="text-sm text-muted">Create an issue first.</p>;
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="submissionId" value={submissionId} />
      <select name="editionId" required defaultValue="" className={FIELD} aria-label="Issue">
        <option value="" disabled>Choose an issue…</option>
        {editions.map((e) => <option key={e.id} value={e.id}>{editionLabel(e)}</option>)}
      </select>
      <SubmitButton variant="solid" pendingLabel="Publishing…">Add to issue</SubmitButton>
      <ErrorNote state={state} />
    </form>
  );
}
