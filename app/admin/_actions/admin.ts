"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import { setContributorSchema, assignEditorSchema } from "@/lib/validation";
import { roleFromFlags, kindsFromFlags } from "@/lib/contributor";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Admin-only actions: role management and editor assignment. Admins cannot lock
// themselves (or the last admin) out. (Publishing now happens via issue assembly.)

export async function setContributor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const actor = await requireAdmin();
    const parsed = setContributorSchema.safeParse({
      userId: formData.get("userId"),
      name: formData.get("name"),
      writer: formData.get("writer"),
      editor: formData.get("editor"),
      admin: formData.get("admin"),
    });
    if (!parsed.success) return fail("Invalid request");
    const { userId, name, writer, editor, admin } = parsed.data;
    const role = roleFromFlags({ writer, editor, admin });

    if (userId === actor.id && role !== "admin") return fail("You can't remove your own admin access");
    if (role !== "admin") {
      const current = await db.getRole(userId);
      if (current === "admin") {
        const [{ n }] = await db.countAdmins();
        if (n <= 1) return fail("Can't demote the last administrator");
      }
    }

    await db.setRole(userId, role);
    await db.setContributor(userId, name, kindsFromFlags({ writer, editor }));
    revalidatePath("/admin/manage/users");
    revalidatePath("/authors");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function assignEditor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = assignEditorSchema.safeParse({
      userId: formData.get("userId"),
      journalId: formData.get("journalId"),
    });
    if (!parsed.success) return fail("Pick a user and a journal");
    const { userId, journalId } = parsed.data;
    // assigning a journal implies at least the editor tier
    const current = await db.getRole(userId);
    if (current === "reader" || current === "writer") await db.setRole(userId, "editor");
    await db.assignEditor(userId, journalId);
    revalidatePath("/admin/manage/editors");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function unassignEditor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = assignEditorSchema.safeParse({
      userId: formData.get("userId"),
      journalId: formData.get("journalId"),
    });
    if (!parsed.success) return fail("Invalid request");
    await db.unassignEditor(parsed.data.userId, parsed.data.journalId);
    revalidatePath("/admin/manage/editors");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
