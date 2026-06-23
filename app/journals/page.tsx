import type { Metadata } from "next";
import { journalsByRecency } from "@/lib/db/queries";
import { Container, PageHeader } from "@/app/components/ui";
import { JournalCard } from "@/app/components/cards";
import { FilterBar } from "@/app/components/filter-bar";
import { Reveal } from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "Journals",
  description:
    "Browse Porcelaine Publishing's academic journals — filter by topic, author, and year.",
};

export default async function JournalsPage({
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

  const all = await journalsByRecency();
  const topics = [...new Set(all.map((j) => j.topic))].filter((t): t is string => !!t).sort();
  const authorOpts = [...new Set(all.flatMap((j) => j.authors))].sort();
  const years = [...new Set(all.map((j) => j.latestDate?.slice(0, 4)))]
    .filter((y): y is string => !!y)
    .sort((a, b) => b.localeCompare(a));

  let list = all;
  if (q)
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        (j.description ?? "").toLowerCase().includes(q),
    );
  if (topic) list = list.filter((j) => j.topic === topic);
  if (author) list = list.filter((j) => j.authors.includes(author));
  if (year) list = list.filter((j) => (j.latestDate ?? "").startsWith(year));

  if (sort === "title")
    list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <PageHeader
        eyebrow="The catalogue"
        title="Journals"
        intro="Eleven peer-reviewed journals across the humanities and sciences. Each is published in dated editions; the most recent appear first."
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
            No journals match these filters.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((j, i) => (
              <Reveal key={j.id} delay={(i % 3) * 70}>
                <JournalCard
                  journal={j}
                  latestDate={j.latestDate}
                  authors={j.authors}
                />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
