// book-detail-header — first of 6 stacked sections on this page. Renders
// visible from SSR (LCP-critical). ISBN set in font-mono-bib.

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { getWriter } from "@/lib/data/writers";
import { coverImage } from "@/lib/images";

export function BookHeader({ book }: { book: Book }) {
  const authors = book.authorIds.map(getWriter).filter(Boolean);

  return (
    <section data-section="book-detail-header" className="bg-porcelain pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-[300px_1fr] sm:gap-16 lg:grid-cols-[380px_1fr] lg:gap-20">
          <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-xl border border-hairline sm:max-w-none">
            <Image
              src={coverImage(book.coverSeed)}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 300px, 380px"
              priority
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono-bib text-xs text-slate">ISBN {book.isbn}</p>
            <h1 className="mt-2 font-heading text-4xl leading-tight text-ink sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-sm text-slate">
              {authors.map((a, i) => (
                <span key={a!.id}>
                  <Link href={`/about#${a!.id}`} className="text-ink hover:text-slate">
                    {a!.name}
                  </Link>
                  {i < authors.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              &middot; {book.year}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
              {book.description}
            </p>
            <a
              href="#book-detail-chapters"
              className="mt-6 inline-block w-fit rounded-full bg-sage px-6 py-3 text-sm font-semibold text-sage-ink transition-all duration-200 hover:-translate-y-px hover:bg-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Read first chapter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
