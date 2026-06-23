import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import {
  getEditorJournalIds,
  listJournals,
  listJournalsByIds,
  listEditionsForJournal,
  listPublishableSubmissions,
} from "@/lib/db/queries";
import { StatusBadge } from "@/app/admin/_components/status";
import { CreateEditionForm, AttachForm, editionLabel } from "@/app/admin/_components/editions";

export default async function AssemblePage({
  searchParams,
}: {
  searchParams: Promise<{ journal?: string }>;
}) {
  const user = await requireRole("editor");
  const { journal } = await searchParams;

  const allowed = user.role === "admin"
    ? await listJournals()
    : await listJournalsByIds(await getEditorJournalIds(user.id));
  const allowedIds = new Set(allowed.map((j) => j.id));
  const selected = journal && allowedIds.has(journal) ? journal : (allowed[0]?.id ?? null);

  const [editions, publishable] = selected
    ? await Promise.all([listEditionsForJournal(selected), listPublishableSubmissions(selected)])
    : [[], []];

  const tab = (active: boolean) =>
    `eyebrow border px-4 py-2 ${active ? "border-ink bg-ink text-porcelain" : "border-hairline text-muted hover:text-ink"}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Assemble an issue</h1>
        <p className="mt-2 text-sm text-muted">
          Group accepted submissions into an edition of a journal. Adding a submission publishes it and records it as an
          article in that issue. (Typesetting the full text is a separate content step.)
        </p>
      </div>

      {allowed.length === 0 ? (
        <p className="text-body">You’re not assigned to any journals yet.</p>
      ) : (
        <>
          <nav className="flex flex-wrap gap-2" aria-label="Journals">
            {allowed.map((j) => (
              <Link key={j.id} href={`/admin/editor/assemble?journal=${j.id}`} className={tab(selected === j.id)}>
                {j.title}
              </Link>
            ))}
          </nav>

          <section className="border-t border-hairline pt-6">
            <h2 className="font-serif text-2xl text-ink">New issue</h2>
            <div className="mt-4">{selected && <CreateEditionForm journalId={selected} />}</div>
            {editions.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {editions.map((e) => (
                  <li key={e.id} className="eyebrow border border-hairline px-3 py-1 text-muted">{editionLabel(e)}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="border-t border-hairline pt-6">
            <h2 className="font-serif text-2xl text-ink">Ready to publish</h2>
            {publishable.length === 0 ? (
              <p className="mt-4 text-body">No accepted or complete submissions here yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                {publishable.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-xl text-ink">{s.title}</span>
                      <span className="eyebrow text-muted">{s.authorName ?? ""}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <StatusBadge status={s.status} />
                      <AttachForm submissionId={s.id} editions={editions} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
