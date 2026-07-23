"use client";

import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

/**
 * Shared "batch entrance" reveal used by every card/row grid in the manifest
 * (home-latest-journals, journals-grid, books-grid, journal-detail-articles,
 * about-writers-grid, book-detail-chapters...): fade + 24px translateX (left
 * to right) over 2s, batched via ScrollTrigger.batch so a whole visible row
 * settles as one gesture. Batch size is recomputed from the container's actual
 * column count at the current breakpoint (never a fixed desktop-sized
 * stagger bleeding into mobile). Respects prefers-reduced-motion via
 * gsap.matchMedia: reduced motion renders every item at final
 * position/opacity immediately, no stagger.
 *
 * The hidden "from" state (opacity:0, translateX(-24px)) is owned by CSS
 * (globals.css, `[data-reveal-item]`), not set here with gsap.set(). Setting
 * it from JS meant the very first browser paint -- before hydration has even
 * run -- showed the settled state, which then visibly snapped back to hidden
 * once this effect fired; owning it in CSS means it's the true first paint,
 * so there's nothing to snap. A `<noscript>` override in layout.tsx restores
 * full visibility for no-JS visitors. Because the hidden state no longer
 * depends on this effect running, the previous "never gate visibility behind
 * a scroll event that might not come" concern (director-review, 2 rounds) no
 * longer applies the same way -- items are already visible-by-default only in
 * the no-JS case now, not the default JS-enabled case -- so we tween with
 * gsap.to() (reading the CSS state as the tween's start) rather than
 * gsap.fromTo().
 */
export function useBatchReveal(
  containerRef: RefObject<HTMLElement | null>,
  itemSelector = "[data-reveal-item]",
) {
  const scope = useRef(containerRef);
  scope.current = containerRef;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions as { reduceMotion: boolean };
          const items = gsap.utils.toArray<HTMLElement>(itemSelector, container);
          if (!items.length) return;

          if (reduceMotion) {
            gsap.set(items, { opacity: 1, x: 0 });
            return;
          }

          const first = items[0];
          const columns = Math.max(
            1,
            Math.round(container.clientWidth / Math.max(first.offsetWidth, 1)),
          );

          // Split by whether the item has already crossed the batch's own
          // "top 88%" trigger line at mount -- those get an immediate reveal
          // tween (a real scroll can never happen for content that's already
          // in view); everything still below that line is left at its CSS
          // hidden state until ScrollTrigger.batch's onEnter actually fires.
          const triggerLine = window.innerHeight * 0.88;
          const alreadyVisible: HTMLElement[] = [];
          const belowFold: HTMLElement[] = [];
          for (const item of items) {
            const rect = item.getBoundingClientRect();
            (rect.top < triggerLine ? alreadyVisible : belowFold).push(item);
          }

          if (alreadyVisible.length) {
            gsap.to(alreadyVisible, {
              opacity: 1,
              x: 0,
              duration: 2,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: true,
            });
          }

          if (!belowFold.length) return;

          const st = ScrollTrigger.batch(belowFold, {
            start: "top 88%",
            batchMax: columns,
            interval: 0.1,
            once: true, // without this, scrolling back up then down re-fires onEnter and flickers
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                x: 0,
                duration: 2,
                ease: "power2.out",
                stagger: 0.08,
                overwrite: true,
              }),
          });

          return () => {
            st.forEach((t) => t.kill());
          };
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef as RefObject<HTMLElement> },
  );
}
