import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { listSubmissionsByStatus } from "@/lib/db/queries";
import { StatusBadge } from "@/app/admin/_components/status";

export default async function PublishQueuePage() {
  await requireAdmin();
  const ready = [...(await listSubmissionsByStatus("complete")), ...(await listSubmissionsByStatus("accepted"))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Publish queue</h1>
        <p className="mt-2 text-sm text-muted">
          Submissions an editor has marked accepted or complete. Publish them by adding them to an issue in
          <Link href="/admin/editor/assemble" className="link-underline"> Assemble an issue</Link> — that records each as a
          published article in its journal.
        </p>
      </div>

      {ready.length === 0 ? (
        <p className="text-body">Nothing ready to publish.</p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {ready.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <span className="min-w-0">
                <span className="block truncate font-serif text-xl text-ink">{s.title}</span>
                <span className="eyebrow text-muted">{s.journalTitle} · {s.authorName ?? ""}</span>
              </span>
              <span className="flex items-center gap-3">
                <StatusBadge status={s.status} />
                <Link href={`/admin/editor/assemble?journal=${s.journalId}`} className="eyebrow border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-porcelain">
                  Assemble
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
