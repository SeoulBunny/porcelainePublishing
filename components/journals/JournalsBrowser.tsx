"use client";

// journals-search-filter + journals-grid + journals-pagination as one
// stateful module (filter state feeds both the grid and pagination), each
// rendering its own data-section anchor per the manifest. Grid stays at
// minimal-content scale (cover, title, author link, issue count, latest
// publication date) so it reads at hundreds-of-items scale; full detail is
// deferred to journal-detail.

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/shared/FilterBar";
import { KilnCard } from "@/components/shared/KilnCard";
import { Pagination } from "@/components/shared/Pagination";
import { journals } from "@/lib/data/journals";
import { getWriter } from "@/lib/data/writers";
import { coverImage, portraitImage } from "@/lib/images";
import { useBatchReveal } from "@/lib/motion/useBatchReveal";

// 4/page (not 10) — the catalog is a curated handful of journals, not a
// database dump; at 10/page the pagination control never had a second page
// to go to and rendered nothing (Pagination returns null when pageCount<=1).
const PAGE_SIZE = 4;

const ALL_TOPICS = Array.from(new Set(journals.flatMap((j) => j.topics))).sort();
const ALL_YEARS = Array.from(
  new Set(journals.map((j) => j.issues[0]?.publishedAt.slice(0, 4)).filter(Boolean) as string[]),
).sort((a, b) => Number(b) - Number(a));

export function JournalsBrowser() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  useBatchReveal(gridRef);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return journals.filter((j) => {
      if (q && !j.title.toLowerCase().includes(q) && !j.description.toLowerCase().includes(q)) {
        return false;
      }
      if (topic && !j.topics.includes(topic)) return false;
      if (year && j.issues[0]?.publishedAt.slice(0, 4) !== year) return false;
      return true;
    });
  }, [query, topic, year]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <>
      {/* renders data-section="journals-search-filter" via FilterBar's sectionId prop */}
      <FilterBar
        sectionId="journals-search-filter"
        searchPlaceholder="Search journals"
        query={query}
        onQueryChange={(v) => handleFilterChange(() => setQuery(v))}
        topicLabel="Topic"
        topics={ALL_TOPICS}
        topic={topic}
        onTopicChange={(v) => handleFilterChange(() => setTopic(v))}
        dateLabel="Publication date"
        dateOptions={ALL_YEARS.map((y) => ({ value: y, label: y }))}
        date={year}
        onDateChange={(v) => handleFilterChange(() => setYear(v))}
        onClear={() => handleFilterChange(() => {
          setQuery("");
          setTopic("");
          setYear("");
        })}
      />

      <section data-section="journals-grid" className="bg-porcelain py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageItems.length === 0 ? (
            <p className="py-16 text-center text-slate">
              No journals match your search. Try clearing a filter.
            </p>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {pageItems.map((journal) => {
                const editor = getWriter(journal.editorIds[0] ?? "");
                const latestIssue = journal.issues[0];
                return (
                  <KilnCard
                    key={journal.id}
                    href={`/journals/${journal.slug}`}
                    title={journal.title}
                    coverSrc={coverImage(journal.coverSeed)}
                    meta={`${journal.issues.length} issue${journal.issues.length === 1 ? "" : "s"} · ${
                      latestIssue?.publishedAt ?? journal.frequency
                    }`}
                    authorName={editor?.name ?? "Editor"}
                    authorHref={editor ? `/about#${editor.id}` : "/about"}
                    authorAvatarSrc={editor ? portraitImage(editor.avatarSeed, 96) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section data-section="journals-pagination" className="bg-porcelain pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>
    </>
  );
}
