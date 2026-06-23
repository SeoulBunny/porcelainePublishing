// Mock-data shapes — mirror the Postgres schema in
// _workflow/memory/database-design.md so swapping to real DB queries is mechanical.

export type PersonKind = "author" | "editor";

export interface Person {
  id: string;
  slug: string;
  name: string;
  kind: PersonKind[];
  affiliation: string;
  bio: string;
  orcid?: string;
  /** journal slugs this person edits (editor scope) */
  editorOf?: string[];
}

export interface Article {
  id: string;
  slug: string;
  editionId: string;
  title: string;
  abstract: string;
  /** ordered author ids */
  authorIds: string[];
  keywords: string[];
  doi: string;
  publishedOn: string; // ISO date
  /** array of paragraph/heading/quote blocks */
  body: ArticleBlock[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export interface Edition {
  id: string;
  journalId: string;
  slug: string; // unique per journal, e.g. "vol-12-issue-2"
  volume: number;
  issue: number;
  title: string;
  summary: string;
  publishedOn: string; // ISO date
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  issn: string;
  topic: string;
  description: string;
  foundedYear: number;
  /** restrained tint for the typographic cover plate */
  tint: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  isbn: string;
  topic: string;
  synopsis: string;
  authorIds: string[];
  publishedOn: string; // ISO date
  accessNote: string;
  tint: string;
}
