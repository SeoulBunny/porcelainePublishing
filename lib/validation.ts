import { z } from "zod";

// Shared validation contract for every server action. Client input is never
// trusted: each action parses with these before touching the DB or storage.

// journalId / editionId carry catalogue slug ids (text), not uuids.
export const createSubmissionSchema = z.object({
  journalId: z.string().min(1, "Choose a journal"),
  title: z.string().trim().min(3, "Title is too short").max(300),
  abstract: z.string().trim().max(4000).optional().or(z.literal("")),
  targetEditionId: z.string().optional().or(z.literal("")),
});

export const submissionIdSchema = z.object({
  submissionId: z.string().uuid(),
});

export const commentSchema = z.object({
  submissionId: z.string().uuid(),
  body: z.string().trim().min(1, "Write a message").max(8000),
});

export const setStatusSchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["in_review", "changes_requested", "accepted", "complete"]),
});

// userId is a Better Auth id (text, not a uuid) — validate as a non-empty string.
// Checkbox fields arrive as "on" (checked) or null (absent) → coerce to boolean.
export const setContributorSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  writer: z.coerce.boolean(),
  editor: z.coerce.boolean(),
  admin: z.coerce.boolean(),
});

export const assignEditorSchema = z.object({
  userId: z.string().min(1),
  journalId: z.string().min(1),
});

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export const presignSchema = z.object({
  submissionId: z.string().uuid(),
  contentType: z.literal("application/pdf"),
});

// ── Journal management (admin) ─────────────────────────────────────────────
const optStr = z.string().trim().max(2000).optional().or(z.literal(""));
// FormData fields are strings; treat "" as absent for the optional number.
const optYear = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().int().min(1000).max(9999).optional(),
);
const journalMeta = {
  title: z.string().trim().min(2, "Title is too short").max(300),
  issn: optStr,
  topic: optStr,
  description: optStr,
  tint: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #aabbcc").optional().or(z.literal("")),
  foundedYear: optYear,
};

export const createJournalSchema = z.object({
  // slug seeds the id (j-<slug>); keep it url-safe and stable.
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only").max(120),
  ...journalMeta,
});

// slug is the id seed, so it's fixed after creation — edit metadata only.
export const updateJournalSchema = z.object({
  journalId: z.string().min(1),
  ...journalMeta,
});

export const journalIdSchema = z.object({
  journalId: z.string().min(1),
});

// Delete is destructive (cascades editions + submissions); require the slug typed back.
export const deleteJournalSchema = z.object({
  journalId: z.string().min(1),
  confirm: z.string().min(1),
});

// ── Editions / assembly (editor + admin) ───────────────────────────────────
const optInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().int().min(1).max(100000).optional(),
);

export const createEditionSchema = z.object({
  journalId: z.string().min(1),
  volume: optInt,
  issue: optInt,
  title: z.string().trim().max(300).optional().or(z.literal("")),
  publishedOn: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date").optional().or(z.literal("")),
});

export const attachToEditionSchema = z.object({
  editionId: z.string().min(1),
  submissionId: z.string().uuid(),
});

// ── Article management (admin) ─────────────────────────────────────────────
export const updateArticleSchema = z.object({
  articleId: z.string().min(1),
  title: z.string().trim().min(3, "Title is too short").max(300),
  abstract: z.string().trim().max(4000).optional().or(z.literal("")),
  publishedOn: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date").optional().or(z.literal("")),
});

// Delete is destructive (cascades authorship); require the slug typed back.
export const deleteArticleSchema = z.object({
  articleId: z.string().min(1),
  confirm: z.string().min(1),
});
