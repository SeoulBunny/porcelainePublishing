// journal-detail-meta — Ledger Rail device. Support block: latest
// issue summary, editor-avatar row linking to writer profiles, topic tag
// list (non-interactive labels).

import Image from "next/image";
import Link from "next/link";
import { LedgerRail } from "@/components/shared/LedgerRail";
import type { Journal } from "@/lib/types";
import { getWriter } from "@/lib/data/writers";
import { portraitImage } from "@/lib/images";

export function JournalMeta({ journal }: { journal: Journal }) {
  const editors = journal.editorIds.map(getWriter).filter(Boolean);
  const latestIssue = journal.issues[0];

  return (
    // renders data-section="journal-detail-meta" via LedgerRail's id prop
    <LedgerRail id="journal-detail-meta" heading="Overview">
      <div className="space-y-6">
        {latestIssue && (
          <p className="text-sm text-slate">
            Latest issue: Vol. {latestIssue.volume}, No. {latestIssue.number} &middot;{" "}
            <span className="font-mono-bib">{latestIssue.publishedAt}</span>
          </p>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Editors</p>
          <div className="flex flex-wrap gap-4">
            {editors.map((editor) => (
              <Link
                key={editor!.id}
                href={`/about#${editor!.id}`}
                className="flex items-center gap-2 text-sm text-ink transition-colors hover:text-slate"
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-full border border-hairline">
                  <Image
                    src={portraitImage(editor!.avatarSeed, 64)}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                {editor!.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Topics</p>
          <div className="flex flex-wrap gap-2">
            {journal.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </LedgerRail>
  );
}
