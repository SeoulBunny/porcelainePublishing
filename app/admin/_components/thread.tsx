import type { ReviewComment } from "@/lib/db/queries";

// Two-way review thread. sender_role labels each message; alignment is purely
// visual (editor left, writer right).
export function Thread({ comments }: { comments: ReviewComment[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted">No messages yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li
          key={c.id}
          className={`border border-hairline bg-surface p-4 ${c.senderRole === "writer" ? "md:ml-12" : "md:mr-12"}`}
        >
          <div className="eyebrow mb-2 flex items-center justify-between text-muted">
            <span>{c.senderRole === "writer" ? "Writer" : "Editor"} · {c.authorName ?? ""}</span>
            <time dateTime={c.createdAt}>{new Date(c.createdAt).toLocaleDateString()}</time>
          </div>
          <p className="whitespace-pre-wrap text-body">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
