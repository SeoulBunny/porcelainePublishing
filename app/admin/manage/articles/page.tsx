import { requireAdmin } from "@/lib/auth/guards";
import { listArticlesForAdmin } from "@/lib/db/queries";
import { ArticleEditForm, DeleteArticleButton } from "@/app/admin/_components/admin";

function editionLabel(a: { editionTitle: string | null; volume: number | null; issue: number | null }): string {
  const vi = [a.volume != null ? `Vol ${a.volume}` : null, a.issue != null ? `Issue ${a.issue}` : null]
    .filter(Boolean).join(" · ");
  return a.editionTitle ? `${a.editionTitle}${vi ? ` (${vi})` : ""}` : vi || "—";
}

export default async function ManageArticlesPage() {
  await requireAdmin();
  const articles = await listArticlesForAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Articles</h1>
        <p className="mt-2 text-sm text-muted">
          Published articles across every journal. Correct their metadata or remove one — deleting cascades its
          authorship rows but leaves the issue intact.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-body">No published articles yet. They appear here once an issue is assembled.</p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {articles.map((a) => (
            <li key={a.id} className="space-y-4 py-6">
              <p className="eyebrow text-muted">{a.journalTitle} · {editionLabel(a)}</p>
              <ArticleEditForm article={a} />
              <DeleteArticleButton article={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
