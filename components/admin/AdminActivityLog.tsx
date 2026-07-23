"use client";

// admin-activity-log — recent actions as a simple top-divider list (single
// hairline per row, not border-top+border-bottom double-striping).

import { useMemo, useState } from "react";

interface ActivityEntry {
  id: string;
  type: "content" | "users";
  message: string;
  time: string;
}

const ENTRIES: ActivityEntry[] = [
  { id: "e1", type: "content", message: "Published Vol. 12, No. 3 of Quarterly Journal of Comparative Linguistics", time: "2 hours ago" },
  { id: "e2", type: "users", message: "Hana Seo updated her editor profile", time: "5 hours ago" },
  { id: "e3", type: "content", message: "Added chapter preview to Tideline Governance", time: "1 day ago" },
  { id: "e4", type: "users", message: "14 new reader accounts created", time: "1 day ago" },
  { id: "e5", type: "content", message: "Updated ISBN metadata for Archival Korea", time: "3 days ago" },
];

export function AdminActivityLog() {
  const [filter, setFilter] = useState<"all" | ActivityEntry["type"]>("all");
  const filtered = useMemo(
    () => (filter === "all" ? ENTRIES : ENTRIES.filter((e) => e.type === filter)),
    [filter],
  );

  return (
    <section id="activity" data-section="admin-activity-log" className="border-b border-hairline bg-porcelain py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-2xl text-ink">Activity</h2>
          <label className="flex items-center gap-2 text-sm text-slate">
            Filter
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="rounded-lg border border-hairline bg-porcelain-soft px-2 py-1 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
            >
              <option value="all">All</option>
              <option value="content">Content</option>
              <option value="users">Users</option>
            </select>
          </label>
        </div>
        <ul className="mt-4">
          {filtered.map((entry) => (
            <li key={entry.id} className="border-t border-hairline py-3 text-sm text-ink">
              {entry.message}
              <span className="ml-2 text-slate">{entry.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
