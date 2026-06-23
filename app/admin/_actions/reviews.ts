"use server";

import { revalidatePath } from "next/cache";
import { getActor, assertCanEditJournal, Unauthorized } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import { commentSchema, setStatusSchema } from "@/lib/validation";
import { presignDownload } from "@/lib/storage/submissions";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Editor-side actions. Scope is re-derived from journal_editor on every call —
// an editor can only touch submissions of journals they're assigned to (admins
// bypass scope).

async function scopedSubmission(submissionId: string) {
  const actor = await getActor();
  const sub = await db.getSubmission(submissionId);
  if (!sub) throw new Unauthorized("Submission not found");
  await assertCanEditJournal(actor, sub.journalId);
  return { actor, sub };
}

// Presigned, short-lived link to view/download the submitted PDF.
export async function getDownloadUrl(submissionId: string): Promise<ActionState & { url?: string }> {
  try {
    const { sub } = await scopedSubmission(submissionId);
    if (!sub.pdfKey) return fail("No PDF uploaded yet");
    const url = await presignDownload(sub.pdfKey, sub.title.slice(0, 60));
    return { ...ok, url };
  } catch (err) {
    return toActionState(err);
  }
}

export async function postEditorComment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = commentSchema.safeParse({
      submissionId: formData.get("submissionId"),
      body: formData.get("body"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
    const { actor, sub } = await scopedSubmission(parsed.data.submissionId);
    await db.addComment({
      submissionId: sub.id,
      authorUserId: actor.id,
      senderRole: "editor",
      body: parsed.data.body,
    });
    if (sub.status === "submitted") await db.setSubmissionStatus(sub.id, "in_review");
    revalidatePath(`/admin/editor/${sub.id}`);
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function setStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = setStatusSchema.safeParse({
      submissionId: formData.get("submissionId"),
      status: formData.get("status"),
    });
    if (!parsed.success) return fail("Invalid status");
    const { sub } = await scopedSubmission(parsed.data.submissionId);
    await db.setSubmissionStatus(sub.id, parsed.data.status);
    revalidatePath(`/admin/editor/${sub.id}`);
    revalidatePath(`/admin/writer/${sub.id}`);
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
