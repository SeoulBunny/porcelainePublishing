"use client";

// Adapted from the user's TextGenerateEffect (1ed90297): a short ethos
// statement for Porcelain Publishing. Reworked from a one-shot "enter once"
// reveal into a scroll-scrubbed one -- each word's reveal is mapped directly
// (scrub: true, no smoothing lag) to scroll position across the section's
// entire scroll-through range, so the statement visibly assembles itself as
// the reader scrolls down (and un-assembles scrolling back up) rather than
// firing once. Words reveal via a clip-path wipe, not blur: a per-word blur
// filter bleeds pixels into the neighboring word during the transitional
// state and visually erases the gap between them, which is why this uses
// clip-path + a small rise instead. Word spacing is an explicit margin-right
// on each word span (not a literal space text node) so the gap survives
// clip-path/transform regardless of animation state. A thin sage rule sweeps
// in alongside as a scrubbed underline, echoing the site's kiln-underline
// motif at section scale. The section's ground is nudged from porcelain to
// porcelain-soft (an existing token, not a new color) to read as a distinct,
// slightly recessed pause between hero and showcase grids.
//
// matchMedia gotcha: gsap.matchMedia().add(conditions, fn) only invokes fn
// when at least one of the given conditions' media queries currently
// matches -- there's no implicit "else" branch. A single condition keyed to
// "(prefers-reduced-motion: reduce)" never fires for the ~99% of visitors
// who don't have that OS setting on, so the entire animation silently never
// ran. Fixed the same way home-hero already does it correctly: two separate
// mm.add() calls, one per query, each active on its own.

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

const STATEMENT =
  "We believe scholarship deserves the same scrutiny given to its presentation. Every journal, every book, every contributor is examined and finished with care, not filed away in an undifferentiated catalog.";

export function Ethos() {
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-ethos-word]");
      if (!words.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom 65%",
            scrub: true,
          },
        });

        tl.fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: 0.15 },
          0,
        ).fromTo(
          words,
          { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 10 },
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            y: 0,
            ease: "none",
            stagger: { each: 0.85 / words.length },
            duration: 0.85,
          },
          0.1,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(words, { opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 });
        gsap.set(ruleRef.current, { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const words = STATEMENT.split(" ");

  return (
    <section
      ref={sectionRef}
      data-section="home-ethos"
      className="border-t border-hairline bg-porcelain-soft py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span
          ref={ruleRef}
          aria-hidden
          className="mx-auto mb-8 block h-px w-16 origin-left bg-sage"
        />
        <p className="font-heading text-2xl leading-snug text-ink sm:text-3xl">
          <span className="sr-only">{STATEMENT}</span>
          {words.map((word, i) => (
            <span
              key={i}
              aria-hidden
              data-ethos-word
              className="inline-block"
              style={{ marginRight: i < words.length - 1 ? "0.28em" : undefined }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
