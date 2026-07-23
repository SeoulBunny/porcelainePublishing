// The Kiln-Stamp cover card — adapted from the user's book/journal cover card
// (93dbe5b9) and profile card (9da988c0) into design-tokens.json's
// devices.cardTreatment. Canonical hover/focus language sitewide: cover
// scales to 1.02, a 1px accent ring draws in from the bottom-right corner,
// and the title underline draws left-to-right — all three cues fire together
// via the shared `.kiln-hover` / `.kiln-cover` / `.kiln-ring` / `.kiln-underline`
// classes in globals.css, so every card genre (journal, book, writer) reads
// as one system rather than a per-page reinvention.

import Image from "next/image";
import Link from "next/link";
import { EmptyVessel } from "@/components/shared/EmptyVessel";

export interface KilnCardProps {
  href: string;
  title: string;
  coverSrc?: string;
  meta: string;
  authorName: string;
  authorHref: string;
  authorAvatarSrc?: string;
}

export function KilnCard({
  href,
  title,
  coverSrc,
  meta,
  authorName,
  authorHref,
  authorAvatarSrc,
}: KilnCardProps) {
  return (
    <article data-reveal-item className="kiln-hover group relative">
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-porcelain-soft">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt=""
              fill
              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 45vw"
              className="kiln-cover object-cover"
            />
          ) : (
            <EmptyVessel initial={title.charAt(0)} />
          )}
        </div>

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 150"
          preserveAspectRatio="none"
        >
          <rect
            x="0.6"
            y="0.6"
            width="98.8"
            height="148.8"
            rx="4"
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            className="kiln-ring"
            pathLength={1000}
          />
        </svg>

        <Link
          href={authorHref}
          aria-label={`View ${authorName}'s profile`}
          className="absolute bottom-2 left-2 z-20 h-8 w-8 overflow-hidden rounded-full border-2 border-porcelain transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage motion-reduce:hover:scale-100"
        >
          {authorAvatarSrc ? (
            <Image src={authorAvatarSrc} alt="" fill sizes="32px" className="object-cover" />
          ) : (
            <EmptyVessel initial={authorName.charAt(0)} className="text-[10px]" />
          )}
        </Link>
      </div>

      <div className="mt-3">
        <h3 className="font-heading text-lg leading-snug text-ink">
          <Link href={href} className="kiln-underline">
            <span className="absolute inset-0 z-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate">{meta}</p>
      </div>
    </article>
  );
}
