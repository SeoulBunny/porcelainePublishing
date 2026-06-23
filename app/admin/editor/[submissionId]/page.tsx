import { notFound } from "next/navigation";
import { getActor, assertCanEditJournal, Unauthorized } from "@/lib/auth/guards";
import { getSubmission, listComments } from "@/lib/db/queries";
import { Breadcrumbs } from "@/app/components/ui";
import { StatusBadge } from "@/app/admin/_components/status";
import { Thread } from "@/app/admin/_components/thread";
import { DownloadButton, EditorCommentForm, StatusControls } from "@/app/admin/_components/editor";

export default async function EditorSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const actor = await getActor();
  const sub = await getSubmission(submissionId);
  if (!sub) notFound();
  try {
    await assertCanEditJournal(actor, sub.journalId);
  } catch (err) {
    if (err instanceof Unauthorized) notFound();
    throw err;
  }

  const comments = await listComments(sub.id);
  const closed = sub.status === "complete" || sub.status === "published";

  return (
    <div className="space-y-8">
      <Breadcrumbs trail={[{ href: "/admin/editor", label: "Review queue" }, { label: sub.title }]} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">{sub.title}</h1>
          <p className="eyebrow mt-1 text-muted">{sub.journalTitle} · {sub.authorName ?? ""}</p>
        </div>
        <StatusBadge status={sub.status} />
      </header>

      {sub.abstract && <p className="max-w-2xl text-body">{sub.abstract}</p>}

      <section className="border border-hairline bg-surface p-6">
        <h2 className="eyebrow mb-4">Manuscript</h2>
        <DownloadButton submissionId={sub.id} disabled={!sub.pdfKey} />
      </section>

      {!closed && (
        <section className="space-y-3">
          <h2 className="eyebrow">Decision</h2>
          <StatusControls submissionId={sub.id} />
        </section>
      )}

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-ink">Conversation with the writer</h2>
        <Thread comments={comments} />
        {!closed && <EditorCommentForm submissionId={sub.id} />}
      </section>
    </div>
  );
}
