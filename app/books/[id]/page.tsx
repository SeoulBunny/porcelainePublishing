import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookHeader } from "@/components/books/BookHeader";
import { BookMeta } from "@/components/books/BookMeta";
import { BookShare } from "@/components/books/BookShare";
import { BookTocAndChapters } from "@/components/books/BookTocAndChapters";
import { BookAuthorBio } from "@/components/books/BookAuthorBio";
import { books, getBook } from "@/lib/data/books";
import { getWriter } from "@/lib/data/writers";
import { coverImage } from "@/lib/images";

export function generateStaticParams() {
  return books.map((b) => ({ id: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = getBook(id);
  if (!book) return { title: "Book not found" };
  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      title: book.title,
      description: book.description,
      images: [coverImage(book.coverSeed, 800, 1200)],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  const authors = book.authorIds.map(getWriter).filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    isbn: book.isbn,
    numberOfPages: book.pages,
    inLanguage: book.language,
    datePublished: String(book.year),
    author: authors.map((a) => ({ "@type": "Person", name: a!.name })),
    publisher: { "@type": "Organization", name: book.publisher },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookHeader book={book} />
      <BookMeta book={book} />
      <BookShare title={book.title} />
      <BookTocAndChapters book={book} />
      <BookAuthorBio book={book} />
    </>
  );
}
