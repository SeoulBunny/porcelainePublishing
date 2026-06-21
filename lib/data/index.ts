// Query helpers over the mock dataset. These emulate the indexed Postgres
// queries described in _workflow/memory/database-design.md, so each function
// here maps to one future SQL query. Swap the bodies, keep the signatures.

import { journals } from "./journals";
import { editions } from "./editions";
import { articles } from "./articles";
import { books } from "./books";
import { people } from "./people";
import type { Article, Book, Edition, Journal, Person } from "./types";

export type { Article, ArticleBlock, Book, Edition, Journal, Person, PersonKind } from "./types";
export { journals, editions, articles, books, people };

const byDateDesc = (a: { publishedOn: string }, b: { publishedOn: string }) =>
  b.publishedOn.localeCompare(a.publishedOn);

// ── People ──────────────────────────────────────────────────────────────
export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}
export function getPeopleByIds(ids: string[]): Person[] {
  return ids
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is Person => Boolean(p));
}

// ── Journals & editions ─────────────────────────────────────────────────
export function getJournal(slug: string): Journal | undefined {
  return journals.find((j) => j.slug === slug);
}
export function getEditionsForJournal(journalId: string): Edition[] {
  return editions.filter((e) => e.journalId === journalId).sort(byDateDesc);
}
export function getEdition(journalId: string, editionSlug: string): Edition | undefined {
  return editions.find((e) => e.journalId === journalId && e.slug === editionSlug);
}
export function latestEditionDate(journalId: string): string {
  const eds = getEditionsForJournal(journalId);
  return eds[0]?.publishedOn ?? "0000-00-00";
}

/** Journals sorted by their most-recent edition (recent-first). */
export function journalsByRecency(): Journal[] {
  return [...journals].sort((a, b) =>
    latestEditionDate(b.id).localeCompare(latestEditionDate(a.id)),
  );
}

// ── Articles ────────────────────────────────────────────────────────────
export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
export function getArticlesForEdition(editionId: string): Article[] {
  return articles.filter((a) => a.editionId === editionId).sort(byDateDesc);
}
export function getArticlesByAuthor(personId: string): Article[] {
  return articles.filter((a) => a.authorIds.includes(personId)).sort(byDateDesc);
}

// ── Books ───────────────────────────────────────────────────────────────
export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
export function booksByRecency(): Book[] {
  return [...books].sort(byDateDesc);
}
export function getBooksByAuthor(personId: string): Book[] {
  return books.filter((b) => b.authorIds.includes(personId)).sort(byDateDesc);
}

// ── Facets for filter bars ──────────────────────────────────────────────
export function journalTopics(): string[] {
  return [...new Set(journals.map((j) => j.topic))].sort();
}
export function bookTopics(): string[] {
  return [...new Set(books.map((b) => b.topic))].sort();
}
/** Distinct author names appearing across a journal's articles. */
export function authorNamesForJournals(): string[] {
  const ids = new Set(articles.flatMap((a) => a.authorIds));
  return getPeopleByIds([...ids])
    .map((p) => p.name)
    .sort();
}
export function bookAuthorNames(): string[] {
  const ids = new Set(books.flatMap((b) => b.authorIds));
  return getPeopleByIds([...ids])
    .map((p) => p.name)
    .sort();
}
export function journalYears(): number[] {
  return [...new Set(editions.map((e) => Number(e.publishedOn.slice(0, 4))))].sort(
    (a, b) => b - a,
  );
}
export function bookYears(): number[] {
  return [...new Set(books.map((b) => Number(b.publishedOn.slice(0, 4))))].sort(
    (a, b) => b - a,
  );
}

// Convenience: authors of a journal (for card metadata + filtering)
export function authorNamesForJournal(journalId: string): string[] {
  const editionIds = new Set(
    editions.filter((e) => e.journalId === journalId).map((e) => e.id),
  );
  const ids = new Set(
    articles.filter((a) => editionIds.has(a.editionId)).flatMap((a) => a.authorIds),
  );
  return getPeopleByIds([...ids]).map((p) => p.name);
}
