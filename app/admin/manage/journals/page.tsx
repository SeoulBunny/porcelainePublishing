import { requireAdmin } from "@/lib/auth/guards";
import { listJournalsFull, getJournalCounts } from "@/lib/db/queries";
import { JournalForm, DeleteJournalButton } from "@/app/admin/_components/admin";

export default async function ManageJournalsPage() {
  await requireAdmin();
  const journals = await listJournalsFull();
  const counts = await Promise.all(journals.map((j) => getJournalCounts(j.id)));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Journals</h1>
        <p className="mt-2 text-sm text-muted">
          Add, edit or remove journals. Writers submit to these and editors are assigned per journal.
          Deleting a journal also removes its editions and submissions.
        </p>
      </div>

      <section className="border-t border-hairline pt-6">
        <h2 className="font-serif text-2xl text-ink">Add a journal</h2>
        <div className="mt-4">
          <JournalForm />
        </div>
      </section>

      <ul className="space-y-8">
        {journals.map((j, i) => (
          <li key={j.id} className="border-t border-hairline pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl text-ink">{j.title}</h2>
              <span className="eyebrow text-muted">
                {j.slug} · {counts[i].submissions} submission(s) · {counts[i].editions} edition(s)
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <JournalForm journal={j} />
              <DeleteJournalButton journal={j} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
