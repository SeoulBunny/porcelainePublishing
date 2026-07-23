// Static author-bio card for book-detail-author-bio: reuses the writer
// profile card's portrait ring-draw treatment (9da988c0-derived) but without
// the about page's click-to-expand — the bio paragraph sits inline in the
// Ledger Rail's support block already, so no toggle is needed here.

import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FiGlobe } from "react-icons/fi";
import type { Writer } from "@/lib/types";
import { portraitImage } from "@/lib/images";

export function AuthorBioCard({ writer }: { writer: Writer }) {
  return (
    <div className="kiln-hover flex flex-col items-start gap-4 sm:flex-row">
      <div className="relative h-24 w-24 shrink-0">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image src={portraitImage(writer.avatarSeed, 192)} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="kiln-ring"
            pathLength={1000}
          />
        </svg>
      </div>
      <div>
        <Link href={`/about#${writer.id}`} className="kiln-underline relative inline-block font-heading text-lg text-ink">
          {writer.name}
        </Link>
        <p className="text-sm text-slate">
          {writer.role} &middot; {writer.discipline}
        </p>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-slate">{writer.bio}</p>
        <div className="mt-3 flex items-center gap-4">
          {writer.social.site && (
            <a href={writer.social.site} target="_blank" rel="noreferrer noopener" aria-label={`${writer.name}'s website`} className="text-slate hover:text-ink">
              <FiGlobe className="h-4 w-4" aria-hidden />
            </a>
          )}
          {writer.social.twitter && (
            <a href={writer.social.twitter} target="_blank" rel="noreferrer noopener" aria-label={`${writer.name} on X`} className="text-slate hover:text-ink">
              <FaXTwitter className="h-4 w-4" aria-hidden />
            </a>
          )}
          {writer.social.linkedin && (
            <a href={writer.social.linkedin} target="_blank" rel="noreferrer noopener" aria-label={`${writer.name} on LinkedIn`} className="text-slate hover:text-ink">
              <FaLinkedin className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
