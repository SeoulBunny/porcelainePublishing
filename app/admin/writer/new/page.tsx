import { requireRole } from "@/lib/auth/guards";
import { listJournals } from "@/lib/db/queries";
import { Breadcrumbs } from "@/app/components/ui";
import { NewSubmissionForm } from "@/app/admin/_components/writer";

export default async function NewSubmissionPage() {
  await requireRole("writer");
  const journals = await listJournals();

  return (
    <div className="space-y-8">
      <Breadcrumbs trail={[{ href: "/admin/writer", label: "My submissions" }, { label: "New" }]} />
      <h1 className="font-serif text-3xl text-ink">New submission</h1>
      <NewSubmissionForm journals={journals} />
    </div>
  );
}
