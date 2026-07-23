"use client";

// Writer/editor card — adapted from the user's profile card (9da988c0),
// rebuilt on the site's own card system rather than reactstrap/Bootstrap.
// Circular 96px portrait carries the Kiln-Stamp ring-draw on its edge
// (instead of the sitewide card-perimeter ring, per devices.cardTreatment's
// writer-card variant). Clicking expands an in-page bio panel rather than
// routing to a separate profile page — the about page's lighter register.

import Image from "next/image";
import { useId, useState } from "react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FiGlobe } from "react-icons/fi";
import { EmptyVessel } from "@/components/shared/EmptyVessel";
import type { Writer } from "@/lib/types";
import { portraitImage } from "@/lib/images";

export function WriterCard({ writer }: { writer: Writer }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <article
      id={writer.id}
      data-reveal-item
      className="kiln-hover scroll-mt-24 rounded-xl border border-hairline bg-porcelain-soft p-6 text-center"
    >
      <div className="relative mx-auto h-24 w-24">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image
            src={portraitImage(writer.avatarSeed, 192)}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
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

      <h3 className="kiln-underline mt-4 inline-block font-heading text-lg text-ink">{writer.name}</h3>
      <p className="mt-1 text-sm text-slate">{writer.role}</p>
      <p className="text-xs text-slate">{writer.discipline}</p>

      <div className="mt-3 flex items-center justify-center gap-4">
        {writer.social.site && (
          <a
            href={writer.social.site}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${writer.name}'s website`}
            className="kiln-hover relative text-slate hover:text-ink"
          >
            <FiGlobe className="h-4 w-4" aria-hidden />
            <span className="kiln-underline absolute inset-x-0 -bottom-1 block h-px" />
          </a>
        )}
        {writer.social.twitter && (
          <a
            href={writer.social.twitter}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${writer.name} on X`}
            className="kiln-hover relative text-slate hover:text-ink"
          >
            <FaXTwitter className="h-4 w-4" aria-hidden />
            <span className="kiln-underline absolute inset-x-0 -bottom-1 block h-px" />
          </a>
        )}
        {writer.social.linkedin && (
          <a
            href={writer.social.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${writer.name} on LinkedIn`}
            className="kiln-hover relative text-slate hover:text-ink"
          >
            <FaLinkedin className="h-4 w-4" aria-hidden />
            <span className="kiln-underline absolute inset-x-0 -bottom-1 block h-px" />
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="mt-4 text-sm font-medium text-slate underline underline-offset-2 hover:text-ink"
      >
        {expanded ? "Hide bio" : "Read bio"}
      </button>

      <div
        id={panelId}
        className="grid text-left transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-slate">{writer.bio}</p>
        </div>
      </div>
    </article>
  );
}
