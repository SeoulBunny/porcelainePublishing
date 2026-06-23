import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJournalBySlug, listJournalEditions, journalsByRecency } from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, CoverPlate, MetaRow, Tag } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";

export async function generateStaticParams() {
  return (await journalsByRecency()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journals/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const journal = await getJournalBySlug(slug);
  if (!journal) return {};
  return { title: journal.title, description: journal.description };
}

export default async function JournalPage(props: PageProps<"/journals/[slug]">) {
  const { slug } = await props.params;
  const journal = await getJournalBySlug(slug);
  if (!journal) notFound();

  const editions = await listJournalEditions(journal.id);
  const editorNames = journal.authors;
  const journalByline =
    editorNames && editorNames.length
      ? editorNames.slice(0, 2).join(", ")
      : `Est. ${journal.foundedYear}`;

  return (
    <Container className="pt-20 pb-24 md:pt-28">
      <Breadcrumbs
        trail={[
          { href: "/", label: "Home" },
          { href: "/journals", label: "Journals" },
          { label: journal.title },
        ]}
      />

      <div className="grid gap-12 border-b border-hairline pb-14 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="eyebrow mb-4">{journal.topic}</p>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-ink">
            {journal.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {journal.description}
          </p>
        </div>
        <div className="space-y-8">
          <div className="group max-w-[260px]">
            <CoverPlate
              kicker={journal.topic ?? undefined}
              title={journal.title}
              tint={journal.tint ?? ""}
              seed={journal.id}
              byline={journalByline}
            />
          </div>
          <dl className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-hairline pb-3">
            <dt className="eyebrow">ISSN</dt>
            <dd className="text-body">{journal.issn}</dd>
          </div>
          <div className="flex justify-between border-b border-hairline pb-3">
            <dt className="eyebrow">Founded</dt>
            <dd className="text-body">{journal.foundedYear}</dd>
          </div>
          <div className="flex justify-between border-b border-hairline pb-3">
            <dt className="eyebrow">Editions</dt>
            <dd className="text-body">{editions.length}</dd>
          </div>
          </dl>
        </div>
      </div>

      <h2 className="eyebrow mt-14 mb-8">Editions</h2>
      <ul className="space-y-px">
        {editions.map((ed, i) => {
          const count = ed.articleCount;
          return (
            <Reveal as="li" key={ed.id} delay={i * 50}>
              <Link
                href={`/journals/${journal.slug}/${ed.slug}`}
                className="group flex flex-col gap-5 border-t border-hairline py-7 md:flex-row md:items-start md:justify-between"
              >
                <div className="flex flex-1 items-start gap-6">
                  <div className="w-20 shrink-0 sm:w-24">
                    <CoverPlate
                      kicker={`Vol. ${ed.volume}`}
                      title={ed.title ?? ""}
                      tint={journal.tint ?? ""}
                      seed={ed.id}
                      byline={journal.title}
                    />
                  </div>
                  <div className="max-w-2xl">
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-xl text-muted">
                        Vol. {ed.volume} · No. {ed.issue}
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif text-2xl text-ink group-hover:underline">
                      {ed.title}
                    </h3>
                    <p className="mt-2 text-body">{ed.summary}</p>
                  </div>
                </div>
                <MetaRow
                  items={[
                    `${count} ${count === 1 ? "article" : "articles"}`,
                    formatDate(ed.publishedOn, { month: "long", year: "numeric" }),
                  ]}
                />
              </Link>
            </Reveal>
          );
        })}
      </ul>

      <div className="mt-12 border-t border-hairline" />
      <div className="mt-12">
        <Tag>{journal.topic}</Tag>
      </div>
    </Container>
  );
}
