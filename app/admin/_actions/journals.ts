"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import type { JournalMeta } from "@/lib/db/queries";
import { createJournalSchema, updateJournalSchema, deleteJournalSchema } from "@/lib/validation";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Admin-only journal management. Journals were previously seed-only; admins can
// now add, edit and (destructively) remove them. Deleting a journal cascades its
// editions and submissions, so it requires the slug typed back as confirmation.

const blank = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

function metaFrom(d: { title: string; issn?: string; topic?: string; description?: string; tint?: string; foundedYear?: number }): JournalMeta {
  return {
    title: d.title,
    issn: blank(d.issn),
    topic: blank(d.topic),
    description: blank(d.description),
    tint: blank(d.tint),
    foundedYear: d.foundedYear ?? null,
  };
}

export async function createJournal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = createJournalSchema.safeParse({
      slug: formData.get("slug"),
      title: formData.get("title"),
      issn: formData.get("issn"),
      topic: formData.get("topic"),
      description: formData.get("description"),
      tint: formData.get("tint"),
      foundedYear: formData.get("foundedYear"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the fields");
    await db.createJournal(parsed.data.slug, metaFrom(parsed.data));
    revalidatePath("/admin/manage/journals");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function updateJournal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = updateJournalSchema.safeParse({
      journalId: formData.get("journalId"),
      title: formData.get("title"),
      issn: formData.get("issn"),
      topic: formData.get("topic"),
      description: formData.get("description"),
      tint: formData.get("tint"),
      foundedYear: formData.get("foundedYear"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the fields");
    await db.updateJournal(parsed.data.journalId, metaFrom(parsed.data));
    revalidatePath("/admin/manage/journals");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function deleteJournal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = deleteJournalSchema.safeParse({
      journalId: formData.get("journalId"),
      confirm: formData.get("confirm"),
    });
    if (!parsed.success) return fail("Invalid request");
    const { journalId, confirm } = parsed.data;
    const journals = await db.listJournalsFull();
    const target = journals.find((j) => j.id === journalId);
    if (!target) return fail("Journal not found");
    if (confirm.trim() !== target.slug) return fail("Type the journal slug exactly to confirm deletion");
    await db.deleteJournal(journalId);
    revalidatePath("/admin/manage/journals");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
