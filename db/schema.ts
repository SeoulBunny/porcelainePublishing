import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  jsonb,
  date,
  primaryKey,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

// Drizzle schema for Porcelaine Publishing. Two groups:
//  1. Better Auth core tables (user/session/account/verification) — Better Auth
//     owns these; column names are its camelCase defaults, do not rename. ids are
//     text (Better Auth generates them), so every app table FKs user.id as text.
//  2. App tables — the contributor/admin data model (database-design.md). Role +
//     editor scope live here (user_role, journal_editor); Better Auth = identity.
// updated_at stays fresh via $onUpdate (no DB trigger).

// ── Better Auth core ─────────────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

// ── App: authorisation ───────────────────────────────────────────────────────
export const userRole = pgTable("user_role", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("reader"),
}, (t) => [
  check("user_role_role", sql`${t.role} in ('reader','writer','editor','admin')`),
]);

export const journalEditor = pgTable("journal_editor", {
  journalId: text("journal_id").notNull().references(() => journal.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.journalId, t.userId] })]);

// ── App: people / catalogue ──────────────────────────────────────────────────
// Catalogue PKs are text — they carry the mock-data slug ids (e.g. "j-ceramic")
// so seeding the catalogue lines up 1:1 with what lib/data references.
export const person = pgTable("person", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: text("kind").array().notNull().default(sql`'{author}'::text[]`),
  affiliation: text("affiliation"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  orcid: text("orcid"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
});

export const journal = pgTable("journal", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  issn: text("issn"),
  topic: text("topic"),
  description: text("description"),
  coverUrl: text("cover_url"),
  tint: text("tint"),
  foundedYear: integer("founded_year"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const edition = pgTable("edition", {
  id: text("id").primaryKey(),
  journalId: text("journal_id").notNull().references(() => journal.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  volume: integer("volume"),
  issue: integer("issue"),
  title: text("title"),
  summary: text("summary"),
  coverUrl: text("cover_url"),
  publishedOn: date("published_on"),
}, (t) => [
  uniqueIndex("edition_journal_slug").on(t.journalId, t.slug),
  index("idx_edition_journal_date").on(t.journalId, t.publishedOn),
]);

export const article = pgTable("article", {
  id: text("id").primaryKey(),
  editionId: text("edition_id").notNull().references(() => edition.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  body: jsonb("body"),
  doi: text("doi"),
  keywords: text("keywords").array(),
  publishedOn: date("published_on"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("idx_article_edition").on(t.editionId)]);

export const articleAuthor = pgTable("article_author", {
  articleId: text("article_id").notNull().references(() => article.id, { onDelete: "cascade" }),
  personId: text("person_id").notNull().references(() => person.id, { onDelete: "cascade" }),
  ord: integer("ord").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.articleId, t.personId] })]);

export const book = pgTable("book", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  isbn: text("isbn"),
  topic: text("topic"),
  synopsis: text("synopsis"),
  coverUrl: text("cover_url"),
  tint: text("tint"),
  publishedOn: date("published_on"),
  accessNote: text("access_note"),
});

export const bookAuthor = pgTable("book_author", {
  bookId: text("book_id").notNull().references(() => book.id, { onDelete: "cascade" }),
  personId: text("person_id").notNull().references(() => person.id, { onDelete: "cascade" }),
  ord: integer("ord").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.bookId, t.personId] })]);

// ── App: submissions / review workflow ───────────────────────────────────────
export const submission = pgTable("submission", {
  id: uuid("id").primaryKey().defaultRandom(),
  journalId: text("journal_id").notNull().references(() => journal.id, { onDelete: "cascade" }),
  authorUserId: text("author_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  abstract: text("abstract"),
  pdfKey: text("pdf_key"),
  status: text("status").notNull().default("submitted"),
  targetEditionId: text("target_edition_id").references(() => edition.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  check("submission_status", sql`${t.status} in ('submitted','in_review','changes_requested','accepted','complete','published')`),
  index("idx_submission_journal_status").on(t.journalId, t.status),
  index("idx_submission_author").on(t.authorUserId, t.status),
]);

export const reviewComment = pgTable("review_comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submission.id, { onDelete: "cascade" }),
  authorUserId: text("author_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  senderRole: text("sender_role").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  check("review_comment_sender", sql`${t.senderRole} in ('writer','editor')`),
  index("idx_review_comment_submission").on(t.submissionId, t.createdAt),
]);

export const subscriber = pgTable("subscriber", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
