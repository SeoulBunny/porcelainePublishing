"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import * as db from "@/lib/db/queries";
import { updateArticleSchema, deleteArticleSchema } from "@/lib/validation";
import { type ActionState, ok, fail, toActionState } from "@/lib/action-state";

// Admin-only article management. Articles are normally born from edition assembly;
// these let an admin correct a published article's metadata or remove it. Deleting
// cascades its authorship rows, so it requires the slug typed back as confirmation.

const blank = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

export async function updateArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = updateArticleSchema.safeParse({
      articleId: formData.get("articleId"),
      title: formData.get("title"),
      abstract: formData.get("abstract"),
      publishedOn: formData.get("publishedOn"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the fields");
    const { articleId, title, abstract, publishedOn } = parsed.data;
    await db.updateArticle(articleId, { title, abstract: blank(abstract), publishedOn: blank(publishedOn) });
    revalidatePath("/admin/manage/articles");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}

export async function deleteArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const parsed = deleteArticleSchema.safeParse({
      articleId: formData.get("articleId"),
      confirm: formData.get("confirm"),
    });
    if (!parsed.success) return fail("Invalid request");
    const { articleId, confirm } = parsed.data;
    const slug = await db.getArticleSlug(articleId);
    if (!slug) return fail("Article not found");
    if (confirm.trim() !== slug) return fail("Type the article slug exactly to confirm deletion");
    await db.deleteArticle(articleId);
    revalidatePath("/admin/manage/articles");
    return ok;
  } catch (err) {
    return toActionState(err);
  }
}
