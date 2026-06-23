import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJournalBySlug, getEdition, listEditionArticles, allEditionParams } from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, CoverPlate, MetaRow } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";

export async function generateStaticParams() {
  return allEditionParams();
}

export async function generateMetadata(
  props: PageProps<"/journals/[slug]/[edition]">,
): Promise<Metadata> {
  const { slug, edition } = await props.params;
  const journal = await getJournalBySlug(slug);
  const ed = journal && (await getEdition(journal.id, edition));
  if (!journal || !ed) return {};
  return {
    title: `${ed.title} — ${journal.title}`,
    description: ed.summary,
  };
}

export default async function EditionPage(
  props: PageProps<"/journals/[slug]/[edition]">,
) {
  const { slug, edition } = await props.params;
  const journal = await getJournalBySlug(slug);
  if (!journal) notFound();
  const ed = await getEdition(journal.id, edition);
  if (!ed) notFound();

  const articles = await listEditionArticles(ed.id);

  return (
    <Container className="pt-20 pb-24 md:pt-28">
      <Breadcrumbs
        trail={[
          { href: "/journals", label: "Journals" },
          { href: `/journals/${journal.slug}`, label: journal.title },
          { label: `Vol. ${ed.volume} No. ${ed.issue}` },
        ]}
      />

      <div className="grid gap-12 border-b border-hairline pb-12 md:grid-cols-[280px_1fr] md:gap-16">
        <div className="max-w-[280px]">
          <CoverPlate
            kicker={`Vol. ${ed.volume} · No. ${ed.issue}`}
            title={ed.title ?? ""}
            tint={journal.tint ?? ""}
            seed={ed.id}
            byline={journal.title}
          />
        </div>

        <div>
          <p className="eyebrow mb-4">
            {journal.title} · Vol. {ed.volume} · No. {ed.issue}
          </p>
          <h1 className="font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.04] text-ink">
            {ed.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
            {ed.summary}
          </p>
          <p className="eyebrow mt-6">
            Published {formatDate(ed.publishedOn)}
          </p>
        </div>
      </div>

      <h2 className="eyebrow mt-12 mb-2">In this edition</h2>
      <ol className="space-y-px">
        {articles.map((a, i) => {
          const authors = a.authors;
          return (
            <Reveal as="li" key={a.id} delay={i * 50}>
              <Link
                href={`/articles/${a.slug}`}
                className="group block border-t border-hairline py-7"
              >
                <h3 className="font-serif text-2xl leading-snug text-ink group-hover:underline">
                  {a.title}
                </h3>
                <p className="mt-2 max-w-3xl text-body line-clamp-2">{a.abstract}</p>
                <div className="mt-3">
                  <MetaRow
                    items={[
                      authors.map((p) => p.name).join(", "),
                      formatDate(a.publishedOn, { month: "short", year: "numeric" }),
                    ]}
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ol>
    </Container>
  );
}
