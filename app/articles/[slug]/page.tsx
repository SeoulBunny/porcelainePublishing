import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, allArticleSlugs } from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, Tag } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";

export async function generateStaticParams() {
  return allArticleSlugs();
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getArticleBySlug(slug);
  if (!data) return {};
  return { title: data.article.title, description: data.article.abstract };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const data = await getArticleBySlug(slug);
  if (!data) notFound();

  const { article, authors, edition, journal, siblings } = data;

  const date = formatDate(article.publishedOn);

  return (
    <Container className="pt-20 pb-24 md:pt-28">
      {journal && edition && (
        <Breadcrumbs
          trail={[
            { href: "/journals", label: "Journals" },
            { href: `/journals/${journal.slug}`, label: journal.title },
            {
              href: `/journals/${journal.slug}/${edition.slug}`,
              label: `Vol. ${edition.volume} No. ${edition.issue}`,
            },
            { label: "Article" },
          ]}
        />
      )}

      <article>
        <header className="mx-auto max-w-[72ch] border-b border-hairline pb-10">
          {journal && (
            <p className="eyebrow mb-5">
              {journal.title}
              {edition ? ` · ${edition.title}` : ""}
            </p>
          )}
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.06] text-ink">
            {article.title}
          </h1>
          <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {authors.map((p, i) => (
              <span key={p.id} className="text-body">
                {i > 0 && <span className="text-hairline">, </span>}
                <Link
                  href={`/authors/${p.slug}`}
                  className="text-ink link-underline"
                >
                  {p.name}
                </Link>
              </span>
            ))}
          </div>
          <p className="eyebrow mt-4">{date}</p>
        </header>

        {/* Abstract */}
        <section className="mx-auto mt-10 max-w-[72ch]">
          <h2 className="eyebrow mb-3">Abstract</h2>
          <p className="font-serif text-xl leading-relaxed text-ink">
            {article.abstract}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.keywords.map((k) => (
              <Tag key={k}>{k}</Tag>
            ))}
          </div>
          <p className="eyebrow mt-6">DOI · {article.doi}</p>
        </section>

        {/* Body */}
        <div className="mx-auto mt-12 prose-porcelain">
          {article.body.map((block, i) => {
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "quote")
              return <blockquote key={i}>{block.text}</blockquote>;
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        {/* Cite */}
        <section className="mx-auto mt-16 max-w-[72ch] border-t border-hairline pt-8">
          <h2 className="eyebrow mb-3">How to cite</h2>
          <p className="text-sm leading-relaxed text-muted">
            {authors.map((p) => p.name).join(", ")} (
            {article.publishedOn?.slice(0, 4)}). {article.title}.{" "}
            {journal?.title}
            {edition ? `, ${edition.volume}(${edition.issue})` : ""}.
            https://doi.org/{article.doi}
          </p>
        </section>
      </article>

      {/* Siblings */}
      {siblings.length > 0 && edition && journal && (
        <aside className="mt-20">
          <h2 className="eyebrow mb-6 border-t border-hairline pt-8">
            Also in {edition.title}
          </h2>
          <ul className="grid gap-px sm:grid-cols-2">
            {siblings.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 50}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="group block py-5 pr-6"
                >
                  <h3 className="font-serif text-xl leading-snug text-ink group-hover:underline">
                    {a.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </ul>
        </aside>
      )}
    </Container>
  );
}
