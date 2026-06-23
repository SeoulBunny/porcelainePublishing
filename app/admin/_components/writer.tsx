"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { createSubmission, postWriterReply, requestUploadUrl, confirmUpload } from "@/app/admin/_actions/submissions";
import type { ActionState } from "@/lib/action-state";
import type { JournalRef } from "@/lib/db/queries";

const FIELD = "w-full border border-hairline bg-surface px-4 py-3 text-body focus:border-ink focus:outline-none";
const LABEL = "eyebrow mb-2 block";

function ErrorNote({ state }: { state: ActionState }) {
  if (state.ok || !state.error) return null;
  return <p className="text-sm text-red-700" role="alert">{state.error}</p>;
}

export function NewSubmissionForm({ journals }: { journals: JournalRef[] }) {
  const [state, action] = useActionState(createSubmission, { ok: true });
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label className={LABEL} htmlFor="journalId">Target journal</label>
        <select id="journalId" name="journalId" required className={FIELD} defaultValue="">
          <option value="" disabled>Choose a journal…</option>
          {journals.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={LABEL} htmlFor="title">Working title</label>
        <input id="title" name="title" required minLength={3} maxLength={300} className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="abstract">Abstract <span className="text-muted">(optional)</span></label>
        <textarea id="abstract" name="abstract" rows={5} maxLength={4000} className={FIELD} />
      </div>
      <ErrorNote state={state} />
      <p className="text-sm text-muted">You’ll upload your PDF on the next screen.</p>
      <SubmitButton variant="solid" pendingLabel="Creating…">Create submission</SubmitButton>
    </form>
  );
}

export function PdfUpload({ submissionId, hasPdf }: { submissionId: string; hasPdf: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    if (file.type !== "application/pdf") return setError("File must be a PDF.");
    if (file.size > 15 * 1024 * 1024) return setError("PDF exceeds the 15 MB limit.");

    setBusy(true);
    try {
      const signed = await requestUploadUrl({ submissionId, contentType: "application/pdf" });
      if (!signed.ok || !signed.url || !signed.key) throw new Error(signed.error ?? "Upload failed");
      const put = await fetch(signed.url, {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");
      const confirmed = await confirmUpload({ submissionId, key: signed.key });
      if (!confirmed.ok) throw new Error(confirmed.error ?? "Upload rejected");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="eyebrow inline-flex cursor-pointer items-center border border-ink px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-porcelain">
        {busy ? "Uploading…" : hasPdf ? "Replace PDF" : "Upload PDF"}
        <input type="file" accept="application/pdf" hidden onChange={onChange} disabled={busy} />
      </label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}

export function ReplyForm({ submissionId }: { submissionId: string }) {
  const [state, action] = useActionState(postWriterReply, { ok: true });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="submissionId" value={submissionId} />
      <textarea
        name="body" rows={3} required maxLength={8000}
        placeholder="Reply to the editor…"
        className={FIELD}
      />
      <ErrorNote state={state} />
      <SubmitButton pendingLabel="Sending…">Send reply</SubmitButton>
    </form>
  );
}
