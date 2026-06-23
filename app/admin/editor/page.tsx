import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getReviewQueue } from "@/lib/db/queries";
import { StatusBadge } from "@/app/admin/_components/status";

export default async function EditorQueue({
  searchParams,
}: {
  searchParams: Promise<{ journal?: string }>;
}) {
  const user = await requireRole("editor");
  const { journal } = await searchParams;

  // Scope (allowed journals, picked journal, the filtered submissions) is resolved
  // entirely inside getReviewQueue — an out-of-scope ?journal= can never leak
  // another journal's work because this page never reads submissions itself.
  const { allowed, selected, submissions } = await getReviewQueue(user, journal ?? null);

  const tab = (active: boolean) =>
    `eyebrow border px-4 py-2 ${active ? "border-ink bg-ink text-porcelain" : "border-hairline text-muted hover:text-ink"}`;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-ink">Review queue</h1>

      {allowed.length === 0 ? (
        <p className="text-body">You’re not assigned to any journals yet.</p>
      ) : (
        <>
          <nav className="flex flex-wrap gap-2" aria-label="Journals">
            {user.role === "admin" && (
              <Link href="/admin/editor" className={tab(selected === null)}>All journals</Link>
            )}
            {allowed.map((j) => (
              <Link key={j.id} href={`/admin/editor?journal=${j.id}`} className={tab(selected === j.id)}>
                {j.title}
              </Link>
            ))}
          </nav>

          {submissions.length === 0 ? (
            <p className="text-body">Nothing waiting for review here.</p>
          ) : (
            <ul className="divide-y divide-hairline border-y border-hairline">
              {submissions.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/editor/${s.id}`} className="flex items-center justify-between gap-4 py-5 hover:bg-surface">
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-xl text-ink">{s.title}</span>
                      <span className="eyebrow text-muted">{s.journalTitle} · {s.authorName ?? ""}</span>
                    </span>
                    <StatusBadge status={s.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
