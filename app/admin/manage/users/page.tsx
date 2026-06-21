import { requireAdmin } from "@/lib/auth/guards";
import { listUsersWithRoles } from "@/lib/db/queries";
import { ContributorForm } from "@/app/admin/_components/admin";

export default async function ManageUsersPage() {
  await requireAdmin();
  const users = await listUsersWithRoles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Users & roles</h1>
        <p className="mt-2 text-sm text-muted">
          Promote registered users to writer, editor, or administrator. Readers can only browse the site.
        </p>
      </div>

      <ul className="divide-y divide-hairline border-y border-hairline">
        {users.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg text-ink">{u.name ?? u.email}</span>
              {u.name && <span className="eyebrow text-muted">{u.email}</span>}
            </span>
            <ContributorForm user={u} />
          </li>
        ))}
      </ul>
    </div>
  );
}
