"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { setContributor, assignEditor, unassignEditor } from "@/app/admin/_actions/admin";
import { createJournal, updateJournal, deleteJournal } from "@/app/admin/_actions/journals";
import { updateArticle, deleteArticle } from "@/app/admin/_actions/articles";
import type { ActionState } from "@/lib/action-state";
import type { UserRow, JournalFull, ArticleAdminRow } from "@/lib/db/queries";

const FIELD = "border border-hairline bg-surface px-3 py-2 text-body focus:border-ink focus:outline-none";

function ErrorNote({ state }: { state: ActionState }) {
  if (state.ok || !state.error) return null;
  return <p className="mt-1 text-sm text-red-700" role="alert">{state.error}</p>;
}

// Writer→author, Editor→editor listing; Admin sets the access tier. Saving
// grants the permission role AND lists the user on /authors (see setContributor).
export function ContributorForm({ user }: { user: UserRow }) {
  const [state, action] = useActionState(setContributor, { ok: true });
  const has = (k: string) => user.kind.includes(k);
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="name" value={user.name ?? user.email} />
      <label className="flex items-center gap-1.5 text-sm text-ink">
        <input type="checkbox" name="writer" defaultChecked={has("author")} /> Writer
      </label>
      <label className="flex items-center gap-1.5 text-sm text-ink">
        <input type="checkbox" name="editor" defaultChecked={has("editor")} /> Editor
      </label>
      <label className="flex items-center gap-1.5 text-sm text-ink">
        <input type="checkbox" name="admin" defaultChecked={user.role === "admin"} /> Admin
      </label>
      <SubmitButton>Save</SubmitButton>
      <ErrorNote state={state} />
    </form>
  );
}

export function AssignEditorForm({ journalId, users }: { journalId: string; users: UserRow[] }) {
  const [state, action] = useActionState(assignEditor, { ok: true });
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="journalId" value={journalId} />
      <select name="userId" required defaultValue="" className={FIELD} aria-label="Assign editor">
        <option value="" disabled>Add an editor…</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
      </select>
      <SubmitButton>Assign</SubmitButton>
      <ErrorNote state={state} />
    </form>
  );
}

export function RemoveEditorButton({ journalId, userId }: { journalId: string; userId: string }) {
  const [state, action] = useActionState(unassignEditor, { ok: true });
  return (
    <form action={action} className="inline">
      <input type="hidden" name="journalId" value={journalId} />
      <input type="hidden" name="userId" value={userId} />
      <button type="submit" className="eyebrow text-muted hover:text-red-700 link-underline">Remove</button>
      <ErrorNote state={state} />
    </form>
  );
}

// Create (journal omitted) or edit (journal provided) a journal. Slug seeds the
// id and is fixed after creation, so it only shows in create mode.
export function JournalForm({ journal }: { journal?: JournalFull }) {
  const editing = !!journal;
  const [state, action] = useActionState(editing ? updateJournal : createJournal, { ok: true });
  return (
    <form action={action} className="grid max-w-2xl gap-3 sm:grid-cols-2">
      {editing && <input type="hidden" name="journalId" value={journal!.id} />}
      {!editing && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="eyebrow">Slug</span>
          <input name="slug" required placeholder="ceramic-histories" className={FIELD} />
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Title</span>
        <input name="title" required defaultValue={journal?.title ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Topic</span>
        <input name="topic" defaultValue={journal?.topic ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">ISSN</span>
        <input name="issn" defaultValue={journal?.issn ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Founded year</span>
        <input name="foundedYear" inputMode="numeric" defaultValue={journal?.foundedYear ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Tint (hex)</span>
        <input name="tint" placeholder="#aabbcc" defaultValue={journal?.tint ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="eyebrow">Description</span>
        <textarea name="description" rows={2} defaultValue={journal?.description ?? ""} className={FIELD} />
      </label>
      <div className="sm:col-span-2">
        <SubmitButton variant="solid" pendingLabel="Saving…">{editing ? "Save changes" : "Add journal"}</SubmitButton>
        <ErrorNote state={state} />
      </div>
    </form>
  );
}

// Edit a published article's metadata (title/abstract/date). Body typesetting is
// a separate content step, so it's not editable here.
export function ArticleEditForm({ article }: { article: ArticleAdminRow }) {
  const [state, action] = useActionState(updateArticle, { ok: true });
  return (
    <form action={action} className="grid max-w-2xl gap-3">
      <input type="hidden" name="articleId" value={article.id} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Title</span>
        <input name="title" required defaultValue={article.title} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Abstract</span>
        <textarea name="abstract" rows={3} defaultValue={article.abstract ?? ""} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="eyebrow">Published on</span>
        <input type="date" name="publishedOn" defaultValue={article.publishedOn ?? ""} className={FIELD} />
      </label>
      <div>
        <SubmitButton variant="solid" pendingLabel="Saving…">Save changes</SubmitButton>
        <ErrorNote state={state} />
      </div>
    </form>
  );
}

// Destructive: deleting cascades authorship. Requires typing the article slug.
export function DeleteArticleButton({ article }: { article: ArticleAdminRow }) {
  const [state, action] = useActionState(deleteArticle, { ok: true });
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="articleId" value={article.id} />
      <input name="confirm" placeholder={`type "${article.slug}"`} className={FIELD} aria-label={`Confirm delete ${article.slug}`} />
      <button type="submit" className="eyebrow border border-red-700 px-4 py-2 text-red-700 hover:bg-red-700 hover:text-porcelain">
        Delete
      </button>
      <ErrorNote state={state} />
    </form>
  );
}

// Destructive: deleting cascades editions + submissions. Requires typing the slug.
export function DeleteJournalButton({ journal }: { journal: JournalFull }) {
  const [state, action] = useActionState(deleteJournal, { ok: true });
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="journalId" value={journal.id} />
      <input name="confirm" placeholder={`type "${journal.slug}"`} className={FIELD} aria-label={`Confirm delete ${journal.slug}`} />
      <button type="submit" className="eyebrow border border-red-700 px-4 py-2 text-red-700 hover:bg-red-700 hover:text-porcelain">
        Delete
      </button>
      <ErrorNote state={state} />
    </form>
  );
}

