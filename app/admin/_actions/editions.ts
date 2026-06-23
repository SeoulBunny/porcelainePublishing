"use server";

import { revalidatePath } from "next/cache";
import { getActor, assertCanEditJournal } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import { createEditionSchema, attachToEditionSchema } from "@/lib/validation";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Editor/admin issue assembly. Editors are scoped to their journals via
// assertCanEditJournal (admins bypass); journalId is always re-derived from the
// edition/submission, never trusted from the form.

const blank = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

export async function createEdition(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const actor = await getActor();
    const parsed = createEditionSchema.safeParse({
      journalId: formData.get("journalId"),
      volume: formData.get("volume"),
      issue: formData.get("issue"),
      title: formData.get("title"),
      publishedOn: formData.get("publishedOn"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the fields");
    const { journalId, volume, issue, title, publishedOn } = parsed.data;
    await assertCanEditJournal(actor, journalId);
    await db.createEdition({
      journalId,
      volume: volume ?? null,
      issue: issue ?? null,
      title: blank(title),
      publishedOn: blank(publishedOn),
    });
    revalidatePath("/admin/editor/assemble");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function attachToEdition(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const actor = await getActor();
    const parsed = attachToEditionSchema.safeParse({
      editionId: formData.get("editionId"),
      submissionId: formData.get("submissionId"),
    });
    if (!parsed.success) return fail("Pick an issue");
    const { editionId, submissionId } = parsed.data;

    const sub = await db.getSubmission(submissionId);
    if (!sub) return fail("Submission not found");
    const editionJournalId = await db.getEditionJournalId(editionId);
    if (!editionJournalId) return fail("Issue not found");
    if (editionJournalId !== sub.journalId) return fail("That issue belongs to another journal");
    if (sub.status !== "accepted" && sub.status !== "complete") {
      return fail("Only accepted or complete submissions can be published");
    }
    await assertCanEditJournal(actor, sub.journalId);

    await db.attachSubmissionToEdition(submissionId, editionId);
    revalidatePath("/admin/editor/assemble");
    revalidatePath("/admin/manage/publish");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
