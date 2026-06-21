import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPerson,
  people,
  getArticlesByAuthor,
  getBooksByAuthor,
  getJournal,
  editions,
  journals,
} from "@/lib/data";
import type { Person, PersonKind } from "@/lib/data";
import { getContributorBySlug } from "@/lib/db/queries";
import { Breadcrumbs, Container, MetaRow, Tag } from "@/app/components/ui";
import { Monogram } from "@/app/components/monogram";

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.slug }));
}

// Mock placeholders first; fall back to a DB-linked contributor (sparse profile:
// no mock articles/books, editor scope lives in journal_editor, not here).
async function resolvePerson(slug: string): Promise<Person | null> {
  const mock = getPerson(slug);
  if (mock) return mock;
  const c = await getContributorBySlug(slug);
  if (!c) return null;
  return {
    id: c.id,
    slug,
    name: c.name,
    kind: c.kind as PersonKind[],
    affiliation: c.affiliation ?? "",
    bio: c.bio ?? "",
    orcid: c.orcid ?? undefined,
    editorOf: [],
  };
}

export async function generateMetadata(
  props: PageProps<"/authors/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const person = await resolvePerson(slug);
  if (!person) return {};
  return { title: person.name, description: person.bio };
}

export default async function AuthorPage(props: PageProps<"/authors/[slug]">) {
  const { slug } = await props.params;
  const person = await resolvePerson(slug);
  if (!person) notFound();

  const authoredArticles = getArticlesByAuthor(person.id);
  const authoredBooks = getBooksByAuthor(person.id);
  const editedJournals = (person.editorOf ?? [])
    .map((s) => getJournal(s))
    .filter(Boolean);

  return (
    <Container className="pt-20 pb-24 md:pt-28">
      <Breadcrumbs
        trail={[
          { href: "/authors", label: "Authors & Editors" },
          { label: person.name },
        ]}
      />

      <div className="grid gap-12 border-b border-hairline pb-14 md:grid-cols-[220px_1fr] md:gap-16">
        <div className="max-w-[220px]">
          <Monogram name={person.name} />
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {person.kind.map((k) => (
              <Tag key={k}>{k}</Tag>
            ))}
          </div>
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] text-ink">
            {person.name}
          </h1>
          <p className="mt-3 text-lg text-muted">{person.affiliation}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {person.bio}
          </p>
          {person.orcid && (
            <p className="eyebrow mt-6">ORCID · {person.orcid}</p>
          )}
        </div>
      </div>

      {editedJournals.length > 0 && (
        <section className="mt-14">
          <h2 className="eyebrow mb-6">Editor of</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {editedJournals.map(
              (j) =>
                j && (
                  <Link
                    key={j.id}
                    href={`/journals/${j.slug}`}
                    className="font-serif text-2xl text-ink link-underline"
                  >
                    {j.title}
                  </Link>
                ),
            )}
          </div>
        </section>
      )}

      {authoredArticles.length > 0 && (
        <section className="mt-14">
          <h2 className="eyebrow mb-2">Articles</h2>
          <ul>
            {authoredArticles.map((a) => {
              const ed = editions.find((e) => e.id === a.editionId);
              const j = ed && journals.find((x) => x.id === ed.journalId);
              return (
                <li key={a.id} className="border-t border-hairline">
                  <Link href={`/articles/${a.slug}`} className="group block py-6">
                    <h3 className="font-serif text-2xl text-ink group-hover:underline">
                      {a.title}
                    </h3>
                    <div className="mt-2">
                      <MetaRow
                        items={[
                          j?.title,
                          new Date(a.publishedOn).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          }),
                        ]}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {authoredBooks.length > 0 && (
        <section className="mt-14">
          <h2 className="eyebrow mb-2">Books</h2>
          <ul>
            {authoredBooks.map((b) => (
              <li key={b.id} className="border-t border-hairline">
                <Link href={`/books/${b.slug}`} className="group block py-6">
                  <h3 className="font-serif text-2xl text-ink group-hover:underline">
                    {b.title}
                  </h3>
                  <div className="mt-2">
                    <MetaRow items={[b.topic, b.publishedOn.slice(0, 4)]} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
