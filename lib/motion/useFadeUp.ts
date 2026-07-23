"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

/**
 * The site's "base entrance fade" — used by every section whose experience
 * spec is just "no animation beyond the page's base entrance fade": fade +
 * 16px translateY as the section scrolls into view, once. Reduced motion
 * renders the final state immediately with no transition.
 *
 * CRITICAL invariant (sibling fix to useBatchReveal.ts's same defect class):
 * never `gsap.set(el, {opacity:0})` as a standing state ahead of the trigger
 * that's supposed to undo it. The previous version did exactly that, then
 * relied solely on `ScrollTrigger.create({onEnter})` to restore opacity:1;
 * if that callback is ever skipped (no scroll happens, JS timing edge case,
 * headless/non-scrolling capture), the section stayed permanently
 * `opacity:0` — the same "reveal gates content visibility" failure the
 * shared batch-reveal hook shipped. Fix: leave the element at its natural
 * CSS opacity:1 and apply the opacity:0 "from" state only atomically inside
 * `onEnter`, via `gsap.fromTo`, so the hidden state only ever exists for the
 * lifetime of a tween guaranteed to complete. ScrollTrigger fires `onEnter`
 * immediately on its initial refresh for anything already past the trigger
 * line at mount, so above-fold sections still reveal right away.
 */
export function useFadeUp(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { reduceMotion } = ctx.conditions as { reduceMotion: boolean };
          if (reduceMotion) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
          }
          const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.fromTo(
                el,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              ),
          });
          return () => trigger.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: ref as RefObject<HTMLElement> },
  );
}
