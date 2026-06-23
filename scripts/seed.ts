// Seed the public catalogue from the typed mock data so the contributor flow has
// real journals/editions to target and the catalogue can swap to Postgres later.
// Idempotent (upsert on id). Run: npm run db:seed
import { db } from "../db";
import { person, journal, edition, article, articleAuthor, book, bookAuthor } from "../db/schema";
import { journals } from "../lib/data/journals";
import { editions } from "../lib/data/editions";
import { articles } from "../lib/data/articles";
import { books } from "../lib/data/books";
import { people } from "../lib/data/people";

async function main() {
  for (const p of people) {
    const row = { id: p.id, slug: p.slug, name: p.name, kind: p.kind, affiliation: p.affiliation, bio: p.bio, orcid: p.orcid ?? null };
    await db.insert(person).values(row).onConflictDoUpdate({ target: person.id, set: row });
  }

  for (const j of journals) {
    const row = { id: j.id, slug: j.slug, title: j.title, issn: j.issn, topic: j.topic, description: j.description, tint: j.tint, foundedYear: j.foundedYear };
    await db.insert(journal).values(row).onConflictDoUpdate({ target: journal.id, set: row });
  }

  for (const e of editions) {
    const row = { id: e.id, journalId: e.journalId, slug: e.slug, volume: e.volume, issue: e.issue, title: e.title, summary: e.summary, publishedOn: e.publishedOn };
    await db.insert(edition).values(row).onConflictDoUpdate({ target: edition.id, set: row });
  }

  for (const a of articles) {
    const row = { id: a.id, editionId: a.editionId, slug: a.slug, title: a.title, abstract: a.abstract, body: a.body, doi: a.doi, keywords: a.keywords, publishedOn: a.publishedOn };
    await db.insert(article).values(row).onConflictDoUpdate({ target: article.id, set: row });
    for (let i = 0; i < a.authorIds.length; i++) {
      await db
        .insert(articleAuthor)
        .values({ articleId: a.id, personId: a.authorIds[i], ord: i })
        .onConflictDoUpdate({ target: [articleAuthor.articleId, articleAuthor.personId], set: { ord: i } });
    }
  }

  for (const b of books) {
    const row = { id: b.id, slug: b.slug, title: b.title, isbn: b.isbn, topic: b.topic, synopsis: b.synopsis, tint: b.tint, publishedOn: b.publishedOn, accessNote: b.accessNote };
    await db.insert(book).values(row).onConflictDoUpdate({ target: book.id, set: row });
    for (let i = 0; i < b.authorIds.length; i++) {
      await db
        .insert(bookAuthor)
        .values({ bookId: b.id, personId: b.authorIds[i], ord: i })
        .onConflictDoUpdate({ target: [bookAuthor.bookId, bookAuthor.personId], set: { ord: i } });
    }
  }

  console.log(
    `seeded: ${people.length} people, ${journals.length} journals, ${editions.length} editions, ${articles.length} articles, ${books.length} books`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
