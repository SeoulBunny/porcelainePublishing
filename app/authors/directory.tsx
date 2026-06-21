"use client";

import { useState } from "react";
import Link from "next/link";
import { MetaRow } from "@/app/components/ui";
import { Monogram } from "@/app/components/monogram";
import { Reveal } from "@/app/components/reveal";

export type DirEntry = { slug: string; name: string; affiliation: string; kind: string[]; work: number };
type Tab = "all" | "editors" | "authors";

function Grid({ entries }: { entries: DirEntry[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 70}>
          <Link href={`/authors/${p.slug}`} className="group block">
            <div className="max-w-[160px]"><Monogram name={p.name} /></div>
            <h2 className="mt-5 font-serif text-2xl text-ink group-hover:underline">{p.name}</h2>
            <p className="mt-1 text-sm text-muted">{p.affiliation}</p>
            <div className="mt-3">
              <MetaRow items={[
                p.kind.includes("editor") ? "Editor" : undefined,
                p.kind.includes("author") ? "Author" : undefined,
                `${p.work} ${p.work === 1 ? "work" : "works"}`,
              ]} />
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function AuthorsDirectory({ entries }: { entries: DirEntry[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const match = (p: DirEntry) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.affiliation.toLowerCase().includes(q.toLowerCase());
  const editors = entries.filter((p) => p.kind.includes("editor") && match(p));
  const authors = entries.filter((p) => p.kind.includes("author") && match(p));
  const tabs: Tab[] = ["all", "editors", "authors"];

  return (
    <div className="border-t border-hairline pt-12">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`eyebrow ${tab === t ? "text-ink" : "text-muted hover:text-ink"}`}>
              {t === "all" ? "All" : t === "editors" ? "Editors" : "Authors"}
            </button>
          ))}
        </div>
        <label className="flex min-w-[220px] flex-1 flex-col gap-2">
          <span className="eyebrow">Search</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or affiliation"
            className="border-b border-hairline bg-transparent py-1.5 text-body outline-none placeholder:text-muted focus:border-ink" />
        </label>
      </div>

      {(tab === "all" || tab === "editors") && editors.length > 0 && (
        <section className="mb-20"><h2 className="eyebrow mb-8">Editors</h2><Grid entries={editors} /></section>
      )}
      {(tab === "all" || tab === "authors") && authors.length > 0 && (
        <section><h2 className="eyebrow mb-8">Authors</h2><Grid entries={authors} /></section>
      )}
    </div>
  );
}
