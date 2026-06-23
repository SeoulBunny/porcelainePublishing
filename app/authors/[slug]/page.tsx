import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Person, PersonKind } from "@/lib/data/types";
import {
  getContributorBySlug,
  getArticlesByAuthor,
  getBooksByAuthor,
  getEditedJournals,
  listContributorsForDirectory,
} from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, MetaRow, Tag } from "@/app/components/ui";
import { Monogram } from "@/app/components/monogram";

export async function generateStaticParams() {
  return (await listContributorsForDirectory()).map((c) => ({ slug: c.slug }));
}

// One catalogue person by slug. Articles/books come from authorship joins; editor
// scope from journal_editor (empty for seeded people with no linked user).
async function resolvePerson(slug: string): Promise<Person | null> {
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

  const authoredArticles = await getArticlesByAuthor(person.id);
  const authoredBooks = await getBooksByAuthor(person.id);
  const editedJournals = await getEditedJournals(person.id);

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
            {authoredArticles.map((a) => (
              <li key={a.id} className="border-t border-hairline">
                <Link href={`/articles/${a.slug}`} className="group block py-6">
                  <h3 className="font-serif text-2xl text-ink group-hover:underline">
                    {a.title}
                  </h3>
                  <div className="mt-2">
                    <MetaRow
                      items={[
                        a.journalTitle,
                        formatDate(a.publishedOn, { month: "short", year: "numeric" }),
                      ]}
                    />
                  </div>
                </Link>
              </li>
            ))}
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
                    <MetaRow items={[b.topic ?? undefined, b.publishedOn?.slice(0, 4)]} />
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
