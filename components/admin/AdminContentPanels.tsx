"use client";

// admin-content-panels — tabbed mock panels (Journals / Books / Users)
// demonstrating the shape of content management without functional CRUD.
// Active tab underlined in accent sage.

import { useState } from "react";
import { journals } from "@/lib/data/journals";
import { books } from "@/lib/data/books";
import { writers } from "@/lib/data/writers";

type Tab = "journals" | "books" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "journals", label: "Journals" },
  { id: "books", label: "Books" },
  { id: "users", label: "Users" },
];

export function AdminContentPanels() {
  const [tab, setTab] = useState<Tab>("journals");

  return (
    <section data-section="admin-content-panels" className="bg-porcelain py-10">
      <div id="journals" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl text-ink">Content management</h2>
        <p className="mt-1 text-sm text-slate">
          UI mockup only. Rows are not editable in this preview.
        </p>

        <div role="tablist" aria-label="Content type" className="mt-6 flex gap-6 border-b border-hairline">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                tab === t.id ? "text-ink" : "text-slate hover:text-ink"
              }`}
            >
              {t.label}
              {tab === t.id && <span aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-sage" />}
            </button>
          ))}
        </div>

        <div id="books" className="mt-4">
          {tab === "journals" && (
            <ul className="divide-y divide-hairline">
              {journals.map((j) => (
                <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink">{j.title}</span>
                  <span className="font-mono-bib text-xs text-slate">{j.issn}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "books" && (
            <ul className="divide-y divide-hairline">
              {books.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink">{b.title}</span>
                  <span className="font-mono-bib text-xs text-slate">{b.isbn}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "users" && (
            <ul id="users" className="divide-y divide-hairline">
              {writers.map((w) => (
                <li key={w.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink">{w.name}</span>
                  <span className="text-xs text-slate">{w.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
