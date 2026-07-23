"use client";

// Shared pagination control for journals-pagination / books-pagination.
// Current page marked with an accent-sage underline rather than a filled
// pill — the radius-ceiling rule reserves full-pill radius for tags, badges,
// and auth buttons only.

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink disabled:cursor-not-allowed disabled:text-slate/40 hover:not-disabled:bg-porcelain-soft"
      >
        <FiChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`relative h-9 min-w-9 rounded-full px-2 text-sm font-medium transition-colors ${
            p === page ? "text-ink" : "text-slate hover:text-ink"
          }`}
        >
          {p}
          {p === page && <span aria-hidden className="absolute inset-x-2 -bottom-0.5 h-px bg-sage" />}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink disabled:cursor-not-allowed disabled:text-slate/40 hover:not-disabled:bg-porcelain-soft"
      >
        <FiChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
