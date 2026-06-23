"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActor, requireRole, Unauthorized } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import { createSubmissionSchema, commentSchema, presignSchema } from "@/lib/validation";
import { buildSubmissionKey, presignUpload, verifyUploadedPdf, deleteObject } from "@/lib/storage/submissions";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Writer-side actions. The author of the submission is always the signed-in
// user; ownership is re-checked on every mutation.

const REPLACEABLE: db.SubmissionStatus[] = ["submitted", "changes_requested"];

async function ownedSubmission(submissionId: string) {
  const actor = await getActor();
  const sub = await db.getSubmission(submissionId);
  if (!sub || sub.authorUserId !== actor.id) throw new Unauthorized("Not your submission");
  return { actor, sub };
}

export async function createSubmission(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let newId: string;
  try {
    const actor = await requireRole("writer");
    const parsed = createSubmissionSchema.safeParse({
      journalId: formData.get("journalId"),
      title: formData.get("title"),
      abstract: formData.get("abstract") ?? "",
      targetEditionId: formData.get("targetEditionId") ?? "",
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
    const d = parsed.data;
    newId = await db.createSubmission({
      journalId: d.journalId,
      authorUserId: actor.id,
      title: d.title,
      abstract: d.abstract ? d.abstract : null,
      targetEditionId: d.targetEditionId ? d.targetEditionId : null,
    });
  } catch (err) {
    return toActionState(err);
  }
  redirect(`/admin/writer/${newId}`);
}

// Issue a presigned PUT for the writer to upload their PDF directly to storage.
export async function requestUploadUrl(input: { submissionId: string; contentType: string }): Promise<
  ActionState & { url?: string; key?: string }
> {
  try {
    const parsed = presignSchema.safeParse(input);
    if (!parsed.success) return fail("Only PDF uploads are allowed");
    const { sub } = await ownedSubmission(parsed.data.submissionId);
    if (!REPLACEABLE.includes(sub.status)) return fail("This submission can no longer be changed");
    const key = buildSubmissionKey(sub.journalId, sub.id);
    const url = await presignUpload(key);
    return { ...ok, url, key };
  } catch (err) {
    return toActionState(err);
  }
}

// After the browser PUTs the file, confirm it's a valid PDF and attach it.
export async function confirmUpload(input: { submissionId: string; key: string }): Promise<ActionState> {
  try {
    const { sub } = await ownedSubmission(input.submissionId);
    if (!REPLACEABLE.includes(sub.status)) return fail("This submission can no longer be changed");
    if (!input.key.startsWith(`submissions/${sub.journalId}/${sub.id}/`)) return fail("Bad upload key");
    const check = await verifyUploadedPdf(input.key);
    if (!check.ok) {
      await deleteObject(input.key).catch(() => {});
      return fail(check.reason);
    }
    const oldKey = sub.pdfKey;
    await db.setSubmissionPdf(sub.id, input.key);
    if (oldKey && oldKey !== input.key) await deleteObject(oldKey).catch(() => {});
    revalidatePath(`/admin/writer/${sub.id}`);
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function postWriterReply(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = commentSchema.safeParse({
      submissionId: formData.get("submissionId"),
      body: formData.get("body"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
    const { actor, sub } = await ownedSubmission(parsed.data.submissionId);
    await db.addComment({
      submissionId: sub.id,
      authorUserId: actor.id,
      senderRole: "writer",
      body: parsed.data.body,
    });
    // a reply to a change request moves it back into the editor's queue
    if (sub.status === "changes_requested") await db.setSubmissionStatus(sub.id, "in_review");
    revalidatePath(`/admin/writer/${sub.id}`);
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
