import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import {
  user,
  userRole,
  journalEditor,
  journal,
  edition,
  article,
  articleAuthor,
  person,
  submission,
  reviewComment,
} from "@/db/schema";
import { pickReviewJournal } from "@/lib/review-scope";

// Data-access for the contributor/admin system, typed Drizzle queries (no string
// SQL). Identity/accounts are owned by Better Auth; this module covers app role,
// editor scope, submissions and the review thread. Public-catalogue reads still
// come from lib/data (mock) this pass; seed.ts loads the same rows into Postgres.

export type Role = "reader" | "writer" | "editor" | "admin";
export type SubmissionStatus =
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "accepted"
  | "complete"
  | "published";
export type SenderRole = "writer" | "editor";

export type JournalRef = { id: string; slug: string; title: string };
export type EditionRef = { id: string; slug: string; title: string | null; volume: number | null; issue: number | null };
export type JournalFull = {
  id: string; slug: string; title: string;
  issn: string | null; topic: string | null; description: string | null;
  tint: string | null; foundedYear: number | null;
};
export type JournalMeta = {
  title: string; issn: string | null; topic: string | null;
  description: string | null; tint: string | null; foundedYear: number | null;
};

export type UserRow = { id: string; name: string | null; email: string; role: Role; kind: string[] };

export type Submission = {
  id: string;
  journalId: string;
  journalTitle: string;
  authorUserId: string;
  authorName: string | null;
  title: string;
  abstract: string | null;
  pdfKey: string | null;
  status: SubmissionStatus;
  targetEditionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReviewComment = {
  id: string;
  submissionId: string;
  authorUserId: string;
  authorName: string | null;
  senderRole: SenderRole;
  body: string;
  createdAt: string;
};

const iso = (d: Date) => d.toISOString();

// ── Journals / editions (selectors) ──────────────────────────────────────
export function listJournals(): Promise<JournalRef[]> {
  return db
    .select({ id: journal.id, slug: journal.slug, title: journal.title })
    .from(journal)
    .orderBy(journal.title);
}

export function listEditionsForJournal(journalId: string): Promise<EditionRef[]> {
  return db
    .select({
      id: edition.id,
      slug: edition.slug,
      title: edition.title,
      volume: edition.volume,
      issue: edition.issue,
    })
    .from(edition)
    .where(eq(edition.journalId, journalId))
    .orderBy(sql`${edition.publishedOn} desc nulls last`);
}

export function listJournalsByIds(ids: string[]): Promise<JournalRef[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db
    .select({ id: journal.id, slug: journal.slug, title: journal.title })
    .from(journal)
    .where(inArray(journal.id, ids))
    .orderBy(journal.title);
}

// ── Journal CRUD (admin) ──────────────────────────────────────────────────
export function listJournalsFull(): Promise<JournalFull[]> {
  return db
    .select({
      id: journal.id, slug: journal.slug, title: journal.title,
      issn: journal.issn, topic: journal.topic, description: journal.description,
      tint: journal.tint, foundedYear: journal.foundedYear,
    })
    .from(journal)
    .orderBy(journal.title);
}

export async function createJournal(slug: string, meta: JournalMeta): Promise<string> {
  const id = `j-${slug}`;
  await db.insert(journal).values({ id, slug, ...meta });
  return id;
}

export async function updateJournal(id: string, meta: JournalMeta): Promise<void> {
  await db.update(journal).set(meta).where(eq(journal.id, id));
}

export async function deleteJournal(id: string): Promise<void> {
  // FK cascade clears editions (→articles), journal_editor and submissions (→comments).
  await db.delete(journal).where(eq(journal.id, id));
}

export async function getJournalCounts(id: string): Promise<{ submissions: number; editions: number }> {
  const [s] = await db.select({ n: count() }).from(submission)
    .where(and(eq(submission.journalId, id), sql`${submission.deletedAt} is null`));
  const [e] = await db.select({ n: count() }).from(edition).where(eq(edition.journalId, id));
  return { submissions: s?.n ?? 0, editions: e?.n ?? 0 };
}

// ── Roles & editor scope ─────────────────────────────────────────────────
export async function getRole(userId: string): Promise<Role> {
  const [row] = await db.select({ role: userRole.role }).from(userRole).where(eq(userRole.userId, userId));
  return (row?.role as Role) ?? "reader";
}

export async function getEditorJournalIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ journalId: journalEditor.journalId })
    .from(journalEditor)
    .where(eq(journalEditor.userId, userId));
  return rows.map((r) => r.journalId);
}

export async function ensureDefaultRole(userId: string): Promise<void> {
  await db.insert(userRole).values({ userId, role: "reader" }).onConflictDoNothing();
}

export async function setRole(userId: string, role: Role): Promise<void> {
  await db
    .insert(userRole)
    .values({ userId, role })
    .onConflictDoUpdate({ target: userRole.userId, set: { role } });
}

export function listUsersWithRoles(): Promise<UserRow[]> {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: sql<Role>`coalesce(${userRole.role}, 'reader')`,
      kind: sql<string[]>`coalesce(${person.kind}, '{}')`,
    })
    .from(user)
    .leftJoin(userRole, eq(userRole.userId, user.id))
    .leftJoin(person, eq(person.userId, user.id))
    .orderBy(user.createdAt);
}

export async function countAdmins(): Promise<{ n: number }[]> {
  const [row] = await db.select({ n: count() }).from(userRole).where(eq(userRole.role, "admin"));
  return [{ n: row?.n ?? 0 }];
}

export async function assignEditor(userId: string, journalId: string): Promise<void> {
  await db.insert(journalEditor).values({ journalId, userId }).onConflictDoNothing();
}

export async function unassignEditor(userId: string, journalId: string): Promise<void> {
  await db
    .delete(journalEditor)
    .where(and(eq(journalEditor.journalId, journalId), eq(journalEditor.userId, userId)));
}

// ── Public contributors (authors/editors directory) ──────────────────────
export type PublicContributor = {
  id: string; slug: string; name: string; kind: string[]; affiliation: string | null;
};

export function listPublicContributors(): Promise<PublicContributor[]> {
  return db
    .select({ id: person.id, slug: person.slug, name: person.name, kind: person.kind, affiliation: person.affiliation })
    .from(person)
    .where(sql`${person.userId} is not null`)
    .orderBy(person.name);
}

// Upsert (or delete when no kinds) the catalogue person linked to a user.
export async function setContributor(
  userId: string, name: string, kinds: ("author" | "editor")[],
): Promise<void> {
  const id = `p-u-${userId.slice(0, 16)}`;
  if (kinds.length === 0) { await db.delete(person).where(eq(person.id, id)); return; }
  // ponytail: id-tail keeps slug unique across duplicate names; prettier slug if it ever bites
  const slug = `${slugify(name)}-${userId.slice(0, 4)}`;
  await db
    .insert(person)
    .values({ id, slug, name, kind: kinds, userId })
    .onConflictDoUpdate({ target: person.id, set: { name, slug, kind: kinds } });
}

export async function getContributorBySlug(slug: string) {
  const [row] = await db
    .select({ id: person.id, name: person.name, kind: person.kind, affiliation: person.affiliation, bio: person.bio, orcid: person.orcid })
    .from(person)
    .where(eq(person.slug, slug));
  return row ?? null;
}

export function listEditorsForJournal(journalId: string): Promise<UserRow[]> {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: sql<Role>`coalesce(${userRole.role}, 'reader')`,
      kind: sql<string[]>`coalesce(${person.kind}, '{}')`,
    })
    .from(journalEditor)
    .innerJoin(user, eq(user.id, journalEditor.userId))
    .leftJoin(userRole, eq(userRole.userId, user.id))
    .leftJoin(person, eq(person.userId, user.id))
    .where(eq(journalEditor.journalId, journalId))
    .orderBy(sql`${user.name} asc nulls last`);
}

// ── Submissions ──────────────────────────────────────────────────────────
const submissionCols = {
  id: submission.id,
  journalId: submission.journalId,
  journalTitle: journal.title,
  authorUserId: submission.authorUserId,
  authorName: user.name,
  title: submission.title,
  abstract: submission.abstract,
  pdfKey: submission.pdfKey,
  status: submission.status,
  targetEditionId: submission.targetEditionId,
  createdAt: submission.createdAt,
  updatedAt: submission.updatedAt,
};

type RawSubmission = {
  status: string;
  createdAt: Date;
  updatedAt: Date;
} & Omit<Submission, "status" | "createdAt" | "updatedAt">;

const toSubmission = (r: RawSubmission): Submission => ({
  ...r,
  status: r.status as SubmissionStatus,
  createdAt: iso(r.createdAt),
  updatedAt: iso(r.updatedAt),
});

function selectSubmissions() {
  return db
    .select(submissionCols)
    .from(submission)
    .innerJoin(journal, eq(journal.id, submission.journalId))
    .innerJoin(user, eq(user.id, submission.authorUserId));
}

export async function createSubmission(input: {
  journalId: string;
  authorUserId: string;
  title: string;
  abstract: string | null;
  targetEditionId: string | null;
}): Promise<string> {
  const [row] = await db
    .insert(submission)
    .values({
      journalId: input.journalId,
      authorUserId: input.authorUserId,
      title: input.title,
      abstract: input.abstract,
      targetEditionId: input.targetEditionId,
    })
    .returning({ id: submission.id });
  if (!row) throw new Error("Failed to create submission");
  return row.id;
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const rows = await selectSubmissions().where(and(eq(submission.id, id), sql`${submission.deletedAt} is null`));
  return rows[0] ? toSubmission(rows[0]) : null;
}

export async function listSubmissionsByAuthor(authorUserId: string): Promise<Submission[]> {
  const rows = await selectSubmissions()
    .where(and(eq(submission.authorUserId, authorUserId), sql`${submission.deletedAt} is null`))
    .orderBy(desc(submission.updatedAt));
  return rows.map(toSubmission);
}

// Internal: the unscoped read. Only reachable through getReviewQueue's admin
// branch — do not call from a request handler directly, it has no scope filter.
async function listAllSubmissions(): Promise<Submission[]> {
  const rows = await selectSubmissions()
    .where(sql`${submission.deletedAt} is null`)
    .orderBy(desc(submission.updatedAt));
  return rows.map(toSubmission);
}

export type ReviewQueue = { allowed: JournalRef[]; selected: string | null; submissions: Submission[] };

// The single entry point for the editor/admin review queue. Scope is resolved
// here, not by callers: an editor's `allowed` set is their assignments, the
// picked journal is clamped to that set (see pickReviewJournal), and the
// submission read is always filtered to it. The page only renders the result.
export async function getReviewQueue(
  actor: { id: string; role: Role },
  requested: string | null,
): Promise<ReviewQueue> {
  const allowed = actor.role === "admin"
    ? await listJournals()
    : await listJournalsByIds(await getEditorJournalIds(actor.id));
  const selected = pickReviewJournal(actor.role, allowed.map((j) => j.id), requested);
  const submissions = selected
    ? await listSubmissionsForJournals([selected])
    : actor.role === "admin" ? await listAllSubmissions() : [];
  return { allowed, selected, submissions };
}

export async function listSubmissionsByStatus(status: SubmissionStatus): Promise<Submission[]> {
  const rows = await selectSubmissions()
    .where(and(eq(submission.status, status), sql`${submission.deletedAt} is null`))
    .orderBy(desc(submission.updatedAt));
  return rows.map(toSubmission);
}

export async function listSubmissionsForJournals(journalIds: string[]): Promise<Submission[]> {
  if (journalIds.length === 0) return [];
  const rows = await selectSubmissions()
    .where(and(inArray(submission.journalId, journalIds), sql`${submission.deletedAt} is null`))
    .orderBy(desc(submission.updatedAt));
  return rows.map(toSubmission);
}

export async function setSubmissionPdf(id: string, pdfKey: string): Promise<void> {
  await db.update(submission).set({ pdfKey }).where(eq(submission.id, id));
}

export async function setSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  await db.update(submission).set({ status }).where(eq(submission.id, id));
}

export async function softDeleteSubmission(id: string): Promise<void> {
  await db.update(submission).set({ deletedAt: new Date() }).where(eq(submission.id, id));
}

// ── Review thread ────────────────────────────────────────────────────────
export async function listComments(submissionId: string): Promise<ReviewComment[]> {
  const rows = await db
    .select({
      id: reviewComment.id,
      submissionId: reviewComment.submissionId,
      authorUserId: reviewComment.authorUserId,
      authorName: user.name,
      senderRole: reviewComment.senderRole,
      body: reviewComment.body,
      createdAt: reviewComment.createdAt,
    })
    .from(reviewComment)
    .innerJoin(user, eq(user.id, reviewComment.authorUserId))
    .where(eq(reviewComment.submissionId, submissionId))
    .orderBy(reviewComment.createdAt);
  return rows.map((r) => ({ ...r, senderRole: r.senderRole as SenderRole, createdAt: iso(r.createdAt) }));
}

export async function addComment(input: {
  submissionId: string;
  authorUserId: string;
  senderRole: SenderRole;
  body: string;
}): Promise<void> {
  await db.insert(reviewComment).values(input);
}

// ── Editions / assembly ───────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "untitled";

export async function getEditionJournalId(editionId: string): Promise<string | null> {
  const [row] = await db.select({ journalId: edition.journalId }).from(edition).where(eq(edition.id, editionId));
  return row?.journalId ?? null;
}

// Create an issue of a journal. id/slug derive from the journal slug + vol/issue;
// the (journalId, slug) unique index rejects duplicates.
export async function createEdition(input: {
  journalId: string;
  volume: number | null;
  issue: number | null;
  title: string | null;
  publishedOn: string | null;
}): Promise<string> {
  const [j] = await db.select({ slug: journal.slug }).from(journal).where(eq(journal.id, input.journalId));
  if (!j) throw new Error("Journal not found");
  const tag = `${input.volume ?? "x"}-${input.issue ?? "x"}-${randomUUID().slice(0, 4)}`;
  const id = `e-${j.slug}-${tag}`;
  const slug = `vol-${input.volume ?? "x"}-issue-${input.issue ?? "x"}`;
  await db.insert(edition).values({
    id, journalId: input.journalId, slug,
    volume: input.volume, issue: input.issue, title: input.title, publishedOn: input.publishedOn,
  });
  return id;
}

export function listPublishableSubmissions(journalId: string): Promise<Submission[]> {
  return selectSubmissions()
    .where(and(
      eq(submission.journalId, journalId),
      inArray(submission.status, ["accepted", "complete"]),
      sql`${submission.deletedAt} is null`,
    ))
    .orderBy(desc(submission.updatedAt))
    .then((rows) => rows.map(toSubmission));
}

// Put a finished submission into an edition: create an article stub (typesetting
// the body is a later content step), carry over authorship when the author has a
// catalogue person, then mark the working submission published and archive it.
export async function attachSubmissionToEdition(submissionId: string, editionId: string): Promise<void> {
  const sub = await getSubmission(submissionId);
  if (!sub) throw new Error("Submission not found");
  const articleId = `a-${randomUUID()}`;
  const slug = `${slugify(sub.title)}-${randomUUID().slice(0, 6)}`;
  await db.insert(article).values({
    id: articleId, editionId, slug, title: sub.title, abstract: sub.abstract,
  });
  // Authorship only if the submitting user is linked to a catalogue person.
  const [p] = await db.select({ id: person.id }).from(person).where(eq(person.userId, sub.authorUserId));
  if (p) await db.insert(articleAuthor).values({ articleId, personId: p.id, ord: 0 }).onConflictDoNothing();
  await db.update(submission)
    .set({ status: "published", targetEditionId: editionId, deletedAt: new Date() })
    .where(eq(submission.id, submissionId));
}

// ── Article management (admin) ─────────────────────────────────────────────
export type ArticleAdminRow = {
  id: string; title: string; slug: string; abstract: string | null;
  journalTitle: string;
  editionTitle: string | null; volume: number | null; issue: number | null;
  publishedOn: string | null;
};
export type ArticleMeta = { title: string; abstract: string | null; publishedOn: string | null };

export function listArticlesForAdmin(): Promise<ArticleAdminRow[]> {
  return db
    .select({
      id: article.id,
      title: article.title,
      slug: article.slug,
      abstract: article.abstract,
      journalTitle: journal.title,
      editionTitle: edition.title,
      volume: edition.volume,
      issue: edition.issue,
      publishedOn: article.publishedOn,
    })
    .from(article)
    .innerJoin(edition, eq(edition.id, article.editionId))
    .innerJoin(journal, eq(journal.id, edition.journalId))
    .orderBy(desc(article.createdAt));
}

export async function updateArticle(id: string, meta: ArticleMeta): Promise<void> {
  await db.update(article)
    .set({ title: meta.title, abstract: meta.abstract, publishedOn: meta.publishedOn })
    .where(eq(article.id, id));
}

// Hard delete; article_author rows cascade. Edition/journal untouched.
export async function deleteArticle(id: string): Promise<void> {
  await db.delete(article).where(eq(article.id, id));
}

export async function getArticleSlug(id: string): Promise<string | null> {
  const [row] = await db.select({ slug: article.slug }).from(article).where(eq(article.id, id));
  return row?.slug ?? null;
}

// Is this user a scoped editor of the journal? (admins bypass at the call site)
export async function isEditorOfJournal(userId: string, journalId: string): Promise<boolean> {
  const rows = await db
    .select({ one: sql`1` })
    .from(journalEditor)
    .where(and(eq(journalEditor.userId, userId), eq(journalEditor.journalId, journalId)));
  return rows.length > 0;
}
