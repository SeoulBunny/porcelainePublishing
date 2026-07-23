"use client";

// about-stats — adapted from the shared library's Count-up stat carousel
// (porcelain-stat-carousel): recolored from its original accent/muted tokens
// to ink (count-up digits) and slate (labels) on the primary porcelain
// ground -- digits stay off sage entirely since 3 simultaneous stat digits
// would exceed the "accent scarcity" named rule's two-zone ceiling -- and
// rewired onto the site's shared gsap/useGSAP singleton instead of a bare
// gsap import, wrapped in the Ledger Rail shell so it reads as
// part of the page's rhythm sequence rather than a bolted-on widget. Real
// numbers render in the SSR markup (readable with JS disabled); the
// count-up animates from 0 only once, client-side, on first entry into
// view, and never re-triggers on re-scroll.

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { LedgerRail } from "@/components/shared/LedgerRail";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

const STATS: Stat[] = [
  { label: "Journals published", value: 6 },
  { label: "Articles in catalog", value: 14 },
  { label: "Countries represented", value: 23, suffix: "+" },
];

export function AboutStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // gsap.matchMedia().add(conditions, fn) only calls fn when at least one
      // condition currently matches -- a lone "reduceMotion" key tied to
      // "(prefers-reduced-motion: reduce)" never fires for the vast majority
      // of visitors, silently dead-coding the count-up below. Use the
      // two-call pattern (matches home-hero) instead: one query each.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "top 80%",
          once: true,
          onEnter: () => {
            STATS.forEach((stat, i) => {
              const el = counterRefs.current[i];
              if (!el) return;
              gsap.to(
                { value: 0 },
                {
                  value: stat.value,
                  duration: 0.9,
                  ease: "power2.out",
                  delay: i * 0.1,
                  onUpdate: function () {
                    el.textContent = `${Math.round(this.targets()[0].value).toLocaleString()}${stat.suffix ?? ""}`;
                  },
                },
              );
            });
          },
        });
        return () => trigger.kill();
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    // renders data-section="about-stats" via LedgerRail's id prop
    <LedgerRail id="about-stats" heading="By the numbers">
      <div ref={containerRef} className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <div key={stat.label}>
            <p
              ref={(el) => {
                counterRefs.current[i] = el;
              }}
              className="font-heading text-4xl text-ink sm:text-5xl"
            >
              {stat.value.toLocaleString()}
              {stat.suffix ?? ""}
            </p>
            <p className="mt-1 text-sm text-slate">{stat.label}</p>
          </div>
        ))}
      </div>
    </LedgerRail>
  );
}
