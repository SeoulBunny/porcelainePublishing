"use client";

// home-latest-books — identical Kiln-Stamp card shell as JournalsShowcase so
// the hover language reads as one system, not a per-section reinvention.

import Link from "next/link";
import { useRef } from "react";
import { KilnCard } from "@/components/shared/KilnCard";
import { latestBooks } from "@/lib/data/books";
import { getWriter } from "@/lib/data/writers";
import { coverImage, portraitImage } from "@/lib/images";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";

export function BooksShowcase() {
  const gridRef = useRef<HTMLDivElement>(null);
  useBatchReveal(gridRef);
  const books = latestBooks(3);

  return (
    <section data-section="home-latest-books" className="bg-porcelain py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl text-ink sm:text-4xl">Latest books</h2>
          <Link
            href="/books"
            className="kiln-hover relative text-sm font-medium text-slate hover:text-ink"
          >
            View all books
            <span aria-hidden className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
          </Link>
        </div>

        <div ref={gridRef} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {books.map((book) => {
            const author = getWriter(book.authorIds[0] ?? "");
            return (
              <KilnCard
                key={book.id}
                href={`/books/${book.slug}`}
                title={book.title}
                coverSrc={coverImage(book.coverSeed)}
                meta={`${book.year} · ${book.pages} pp.`}
                authorName={author?.name ?? "Author"}
                authorHref={author ? `/about#${author.id}` : "/about"}
                authorAvatarSrc={author ? portraitImage(author.avatarSeed, 96) : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
