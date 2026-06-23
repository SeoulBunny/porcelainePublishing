import { requireAdmin } from "@/lib/auth/guards";
import { listJournals, listEditorsForJournal, listUsersWithRoles } from "@/lib/db/queries";
import { AssignEditorForm, RemoveEditorButton } from "@/app/admin/_components/admin";

export default async function ManageEditorsPage() {
  await requireAdmin();
  const journals = await listJournals();
  const users = await listUsersWithRoles();
  const editorsByJournal = await Promise.all(journals.map((j) => listEditorsForJournal(j.id)));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Editor assignments</h1>
        <p className="mt-2 text-sm text-muted">
          Assign editors to journals. An assigned user can review only that journal’s submissions; assigning grants the editor role automatically.
        </p>
      </div>

      <ul className="space-y-8">
        {journals.map((j, i) => (
          <li key={j.id} className="border-t border-hairline pt-6">
            <h2 className="font-serif text-2xl text-ink">{j.title}</h2>
            <ul className="my-4 space-y-1">
              {editorsByJournal[i].length === 0 ? (
                <li className="text-sm text-muted">No editors assigned.</li>
              ) : (
                editorsByJournal[i].map((e) => (
                  <li key={e.id} className="flex items-center gap-3 text-body">
                    <span>{e.name ?? e.email}</span>
                    <RemoveEditorButton journalId={j.id} userId={e.id} />
                  </li>
                ))
              )}
            </ul>
            <AssignEditorForm journalId={j.id} users={users} />
          </li>
        ))}
      </ul>
    </div>
  );
}
