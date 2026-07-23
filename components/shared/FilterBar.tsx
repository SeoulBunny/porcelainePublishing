"use client";

// Shared search + topic/date filter bar for journals-search-filter and
// books-search-filter. Filter panel collapses on mobile behind a "Filters"
// toggle (height-transition via CSS grid-template-rows, matching the
// technique already used by WriterCard's bio panel) so the control set never
// eats vertical space it doesn't need on small screens. Active filters
// render as removable pill tags -- the radius-ceiling rule's one sanctioned
// full-pill use outside tags/badges/auth buttons.

import { useId, useState } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

export interface FilterBarProps {
  sectionId: string;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (value: string) => void;
  topicLabel: string;
  topics: string[];
  topic: string;
  onTopicChange: (value: string) => void;
  dateLabel: string;
  dateOptions: { value: string; label: string }[];
  date: string;
  onDateChange: (value: string) => void;
  onClear: () => void;
}

export function FilterBar({
  sectionId,
  searchPlaceholder,
  query,
  onQueryChange,
  topicLabel,
  topics,
  topic,
  onTopicChange,
  dateLabel,
  dateOptions,
  date,
  onDateChange,
  onClear,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchId = useId();
  const topicId = useId();
  const dateId = useId();

  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];
  if (topic) {
    activeFilters.push({ key: "topic", label: topic, onRemove: () => onTopicChange("") });
  }
  if (date) {
    const dateLabelText = dateOptions.find((d) => d.value === date)?.label ?? date;
    activeFilters.push({ key: "date", label: dateLabelText, onRemove: () => onDateChange("") });
  }

  const hasFilters = Boolean(query || topic || date);

  const controls = (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex-1 sm:min-w-[220px]">
        <label htmlFor={searchId} className="mb-1.5 block text-sm font-medium text-ink">
          Search
        </label>
        <div className="relative">
          <FiSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-hairline bg-porcelain py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          />
        </div>
      </div>

      <div className="sm:w-48">
        <label htmlFor={topicId} className="mb-1.5 block text-sm font-medium text-ink">
          {topicLabel}
        </label>
        <select
          id={topicId}
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-44">
        <label htmlFor={dateId} className="mb-1.5 block text-sm font-medium text-ink">
          {dateLabel}
        </label>
        <select
          id={dateId}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-porcelain px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
        >
          <option value="">Any time</option>
          {dateOptions.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasFilters}
        className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:not-disabled:border-slate disabled:cursor-not-allowed disabled:text-slate/40"
      >
        Clear
      </button>
    </div>
  );

  return (
    <section data-section={sectionId} className="border-t border-hairline bg-porcelain-soft/60 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 text-sm font-medium text-ink sm:hidden"
        >
          <FiFilter className="h-4 w-4" aria-hidden />
          Filters
        </button>

        <div className="hidden sm:block">{controls}</div>

        <div
          className="grid sm:hidden"
          style={{ gridTemplateRows: mobileOpen ? "1fr" : "0fr", transition: "grid-template-rows 200ms ease-out" }}
        >
          <div className="overflow-hidden">
            <div className="pt-4">{controls}</div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={f.onRemove}
                className="flex items-center gap-1.5 rounded-full border border-sage/50 bg-sage/10 px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-sage"
              >
                {f.label}
                <FiX className="h-3 w-3" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
