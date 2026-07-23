"use client";

// books-search-filter + books-grid + books-pagination, mirroring
// JournalsBrowser's structure. Filters adapted to books: topic maps to
// subjectTags, author appears in the card meta line, date filter uses
// publication year directly (no derived issue date).

import { useMemo, useRef, useState } from "react";
import { FilterBar } from "@/components/shared/FilterBar";
import { KilnCard } from "@/components/shared/KilnCard";
import { Pagination } from "@/components/shared/Pagination";
import { books } from "@/lib/data/books";
import { getWriter } from "@/lib/data/writers";
import { coverImage, portraitImage } from "@/lib/images";
import { useResponsivePageSize } from "@/lib/hooks/useResponsivePageSize";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";

const SORT_OPTIONS = [
  { value: "date", label: "Publish date" },
  { value: "popularity", label: "Popularity" },
];

const ALL_SUBJECTS = Array.from(new Set(books.flatMap((b) => b.subjectTags))).sort();
const ALL_YEARS = Array.from(new Set(books.map((b) => String(b.year)))).sort(
  (a, b) => Number(b) - Number(a),
);

export function BooksBrowser() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  useBatchReveal(gridRef);
  const pageSize = useResponsivePageSize();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = books.filter((b) => {
      if (q && !b.title.toLowerCase().includes(q) && !b.description.toLowerCase().includes(q)) {
        return false;
      }
      if (subject && !b.subjectTags.includes(subject)) return false;
      if (year && String(b.year) !== year) return false;
      return true;
    });
    return result.sort((a, b) => (sort === "popularity" ? b.popularity - a.popularity : b.year - a.year));
  }, [query, subject, year, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <>
      {/* renders data-section="books-search-filter" via FilterBar's sectionId prop */}
      <FilterBar
        sectionId="books-search-filter"
        searchPlaceholder="Search books"
        query={query}
        onQueryChange={(v) => handleFilterChange(() => setQuery(v))}
        topicLabel="Subject"
        topics={ALL_SUBJECTS}
        topic={subject}
        onTopicChange={(v) => handleFilterChange(() => setSubject(v))}
        dateLabel="Publication year"
        dateOptions={ALL_YEARS.map((y) => ({ value: y, label: y }))}
        date={year}
        onDateChange={(v) => handleFilterChange(() => setYear(v))}
        sortLabel="Sort by"
        sortOptions={SORT_OPTIONS}
        sort={sort}
        onSortChange={(v) => handleFilterChange(() => setSort(v))}
        onClear={() => handleFilterChange(() => {
          setQuery("");
          setSubject("");
          setYear("");
        })}
      />

      <section data-section="books-grid" className="bg-porcelain py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageItems.length === 0 ? (
            <p className="py-16 text-center text-slate">
              No books match your search. Try clearing a filter.
            </p>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
            >
              {pageItems.map((book) => {
                const author = getWriter(book.authorIds[0] ?? "");
                return (
                  <KilnCard
                    key={book.id}
                    href={`/books/${book.slug}`}
                    title={book.title}
                    coverSrc={coverImage(book.coverSeed)}
                    meta={`${book.year} · ${author?.name ?? "Unknown author"}`}
                    authorName={author?.name ?? "Author"}
                    authorHref={author ? `/about#${author.id}` : "/about"}
                    authorAvatarSrc={author ? portraitImage(author.avatarSeed, 96) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section data-section="books-pagination" className="bg-porcelain pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>
    </>
  );
}
