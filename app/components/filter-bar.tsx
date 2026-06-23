"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SelectFacet = { key: string; label: string; options: string[] };

export function FilterBar({
  facets,
  resultCount,
}: {
  facets: SelectFacet[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  // debounce free-text search → URL
  useEffect(() => {
    const id = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) update({ q });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasActive =
    q || facets.some((f) => params.get(f.key));

  return (
    <div className="border-b border-hairline pb-6">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
        <label className="flex min-w-[220px] flex-1 flex-col gap-2">
          <span className="eyebrow">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or keyword"
            className="border-b border-hairline bg-transparent py-1.5 text-body outline-none placeholder:text-muted focus:border-ink"
          />
        </label>

        {facets.map((f) => (
          <label key={f.key} className="flex flex-col gap-2">
            <span className="eyebrow">{f.label}</span>
            <select
              value={params.get(f.key) ?? ""}
              onChange={(e) => update({ [f.key]: e.target.value })}
              className="border-b border-hairline bg-transparent py-1.5 pr-6 text-body outline-none focus:border-ink"
            >
              <option value="">All</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="flex flex-col gap-2">
          <span className="eyebrow">Sort</span>
          <select
            value={params.get("sort") ?? "recent"}
            onChange={(e) => update({ sort: e.target.value === "recent" ? "" : e.target.value })}
            className="border-b border-hairline bg-transparent py-1.5 pr-6 text-body outline-none focus:border-ink"
          >
            <option value="recent">Most recent</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="eyebrow">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
        {hasActive && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              router.replace(pathname, { scroll: false });
            }}
            className="eyebrow text-muted hover:text-ink link-underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
