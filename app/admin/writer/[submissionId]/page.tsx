import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { getSubmission, listComments } from "@/lib/db/queries";
import { Breadcrumbs } from "@/app/components/ui";
import { StatusBadge } from "@/app/admin/_components/status";
import { Thread } from "@/app/admin/_components/thread";
import { PdfUpload, ReplyForm } from "@/app/admin/_components/writer";

export default async function WriterSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const user = await requireUser();
  const sub = await getSubmission(submissionId);
  if (!sub || sub.authorUserId !== user.id) notFound();

  const comments = await listComments(sub.id);
  const editable = sub.status === "submitted" || sub.status === "changes_requested";

  return (
    <div className="space-y-8">
      <Breadcrumbs trail={[{ href: "/admin/writer", label: "My submissions" }, { label: sub.title }]} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">{sub.title}</h1>
          <p className="eyebrow mt-1 text-muted">{sub.journalTitle}</p>
        </div>
        <StatusBadge status={sub.status} />
      </header>

      {sub.abstract && <p className="max-w-2xl text-body">{sub.abstract}</p>}

      <section className="border border-hairline bg-surface p-6">
        <h2 className="eyebrow mb-4">Manuscript (PDF)</h2>
        <p className="mb-4 text-sm text-muted">
          {sub.pdfKey ? "A PDF is attached." : "No PDF attached yet."}
          {!editable && " This submission is locked while in its current state."}
        </p>
        {editable && <PdfUpload submissionId={sub.id} hasPdf={Boolean(sub.pdfKey)} />}
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-ink">Conversation with the editor</h2>
        <Thread comments={comments} />
        {sub.status !== "complete" && sub.status !== "published" ? (
          <ReplyForm submissionId={sub.id} />
        ) : (
          <p className="text-sm text-muted">This submission is closed to new replies.</p>
        )}
      </section>
    </div>
  );
}
