import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookBySlug, booksByRecency } from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs, Container, CoverPlate, Tag } from "@/app/components/ui";

export async function generateStaticParams() {
  return (await booksByRecency()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  props: PageProps<"/books/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getBookBySlug(slug);
  if (!data) return {};
  return { title: data.book.title, description: data.book.synopsis };
}

export default async function BookPage(props: PageProps<"/books/[slug]">) {
  const { slug } = await props.params;
  const data = await getBookBySlug(slug);
  if (!data) notFound();

  const { book, authors } = data;
  const date = formatDate(book.publishedOn, { month: "long", year: "numeric" });

  return (
    <Container className="pt-20 pb-24 md:pt-28">
      <Breadcrumbs
        trail={[
          { href: "/", label: "Home" },
          { href: "/books", label: "Books" },
          { label: book.title },
        ]}
      />

      <div className="grid gap-12 md:grid-cols-[320px_1fr] md:gap-16">
        <div className="max-w-[320px]">
          <CoverPlate
            kicker={book.topic ?? undefined}
            title={book.title}
            tint={book.tint ?? ""}
            seed={book.id}
            byline={authors.length ? authors.map((p) => p.name).join(", ") : undefined}
          />
        </div>

        <div>
          <p className="eyebrow mb-4">{book.topic}</p>
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] text-ink">
            {book.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            {authors.map((p, i) => (
              <span key={p.id} className="text-lg text-body">
                {i > 0 && <span className="text-hairline">, </span>}
                <Link href={`/authors/${p.slug}`} className="text-ink link-underline">
                  {p.name}
                </Link>
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body">
            {book.synopsis}
          </p>

          <dl className="mt-10 max-w-md space-y-4 text-sm">
            <div className="flex justify-between border-b border-hairline pb-3">
              <dt className="eyebrow">ISBN</dt>
              <dd className="text-body">{book.isbn}</dd>
            </div>
            <div className="flex justify-between border-b border-hairline pb-3">
              <dt className="eyebrow">Published</dt>
              <dd className="text-body">{date}</dd>
            </div>
            <div className="flex justify-between border-b border-hairline pb-3">
              <dt className="eyebrow">Topic</dt>
              <dd className="text-body">{book.topic}</dd>
            </div>
          </dl>

          <div className="mt-10 border border-hairline bg-surface p-6">
            <h2 className="eyebrow mb-2">Access</h2>
            <p className="text-body">{book.accessNote}</p>
          </div>

          <div className="mt-8">
            <Tag>{book.topic}</Tag>
          </div>
        </div>
      </div>
    </Container>
  );
}
