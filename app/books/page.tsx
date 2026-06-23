import type { Metadata } from "next";
import { booksByRecency } from "@/lib/db/queries";
import { Container, PageHeader } from "@/app/components/ui";
import { BookCard } from "@/app/components/cards";
import { FilterBar } from "@/app/components/filter-bar";
import { Reveal } from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Browse books from Porcelaine Publishing — filter by topic, author, and year.",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = (sp.q as string)?.toLowerCase() ?? "";
  const topic = (sp.topic as string) ?? "";
  const author = (sp.author as string) ?? "";
  const year = (sp.year as string) ?? "";
  const sort = (sp.sort as string) ?? "recent";

  const all = await booksByRecency();
  const topics = [...new Set(all.map((b) => b.topic))].filter((t): t is string => !!t).sort();
  const authorOpts = [...new Set(all.flatMap((b) => b.authors))].sort();
  const years = [...new Set(all.map((b) => b.publishedOn?.slice(0, 4)))]
    .filter((y): y is string => !!y)
    .sort((a, b) => b.localeCompare(a));

  let list = all;
  if (q)
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.synopsis ?? "").toLowerCase().includes(q),
    );
  if (topic) list = list.filter((b) => b.topic === topic);
  if (author) list = list.filter((b) => b.authors.includes(author));
  if (year) list = list.filter((b) => (b.publishedOn ?? "").startsWith(year));

  if (sort === "title")
    list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <PageHeader
        eyebrow="The catalogue"
        title="Books"
        intro="Monographs and collected essays from Porcelaine's authors. Access details for each title will follow."
      />
      <Container className="pb-8">
        <FilterBar
          resultCount={list.length}
          facets={[
            { key: "topic", label: "Topic", options: topics },
            { key: "author", label: "Author", options: authorOpts },
            { key: "year", label: "Year", options: years },
          ]}
        />
      </Container>

      <Container className="pb-24">
        {list.length === 0 ? (
          <p className="py-16 text-center font-serif text-2xl text-muted">
            No books match these filters.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b, i) => (
              <Reveal key={b.id} delay={(i % 3) * 70}>
                <BookCard book={b} authors={b.authors} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
