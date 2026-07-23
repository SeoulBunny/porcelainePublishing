"use client";

// Shared shell for privacy-toc/privacy-content and terms-toc/terms-content:
// a short anchor-link list so the long legal document stays navigable, plus
// the long-form prose itself (max 70ch line length). Current-in-view section
// gets a subtle accent-sage marker, tracked via IntersectionObserver (never
// a scroll listener). Anchor jumps use the page's global smooth-scroll,
// which the reduced-motion media query already downgrades to instant.

import { useEffect, useRef, useState } from "react";

export interface LegalSection {
  id: string;
  label: string;
  body: React.ReactNode;
}

export function LegalPage({
  tocSectionId,
  contentSectionId,
  title,
  intro,
  sections,
  lastUpdated,
  contactEmail,
}: {
  tocSectionId: string;
  contentSectionId: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  lastUpdated: string;
  contactEmail: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActive(topMost.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <div className="bg-porcelain pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl text-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-slate">Last updated {lastUpdated}</p>
          <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-slate">{intro}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[200px_1fr] lg:gap-12 lg:px-8">
        <section data-section={tocSectionId} className="mb-10 lg:mb-0">
          <nav aria-label="Contents" className="lg:sticky lg:top-24">
            <p className="mb-3 text-sm font-medium text-ink">Contents</p>
            <ol className="space-y-1.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block border-l-2 py-0.5 pl-3 text-sm transition-colors ${
                      active === s.id ? "border-sage text-ink" : "border-transparent text-slate hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section data-section={contentSectionId} ref={contentRef} className="min-w-0">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-heading text-2xl text-ink">{s.label}</h2>
                <div className="mt-3 max-w-[70ch] space-y-3 text-sm leading-relaxed text-slate">{s.body}</div>
              </div>
            ))}
            <div>
              <h2 className="font-heading text-2xl text-ink">Contact</h2>
              <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-slate">
                Questions about this policy can be sent to{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-ink underline underline-offset-2 hover:text-slate"
                >
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
