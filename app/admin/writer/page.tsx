import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { listSubmissionsByAuthor } from "@/lib/db/queries";
import { InkButton } from "@/app/components/ui";
import { StatusBadge } from "@/app/admin/_components/status";

export default async function WriterHome() {
  const user = await requireUser();
  const submissions = await listSubmissionsByAuthor(user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-ink">My submissions</h1>
        <InkButton href="/admin/writer/new" variant="solid">New submission</InkButton>
      </div>

      {submissions.length === 0 ? (
        <p className="text-body">No submissions yet. Start by choosing a journal.</p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {submissions.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/writer/${s.id}`} className="flex items-center justify-between gap-4 py-5 hover:bg-surface">
                <span className="min-w-0">
                  <span className="block truncate font-serif text-xl text-ink">{s.title}</span>
                  <span className="eyebrow text-muted">{s.journalTitle}</span>
                </span>
                <StatusBadge status={s.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
