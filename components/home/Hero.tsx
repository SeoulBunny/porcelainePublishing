"use client";

// Adapted from the user's interactive starfield hero (ec8fe496): the dark
// bg-zinc-950 canvas hero is recolored onto the porcelain ground and paired
// with the Kiln-ash drift field (KilnAshField.tsx). Copy states the brand
// promise/differentiation directly; no eyebrow pill here (min_interactive_
// elements: 2 is the CTA pair) -- the eyebrow ration for this page is spent,
// if at all, lower on the page. Headline/subhead/CTA play a pronounced 3-step
// entrance stagger after document.fonts.ready, animated with gsap.from() from
// an already-visible SSR state so the LCP element never starts JS-hidden.
// Separately, a scrubbed ScrollTrigger drives a two-layer parallax as the
// hero scrolls out of view: content (contentRef) rises/fades faster than the
// Kiln-ash backdrop (bgRef), reversible on scroll-up.
//
// The CTA step animates the [data-hero-ctas] wrapper as one block rather than
// its two <Link> children individually. Reaching two levels deep under
// contentRef (contentRef > .max-w-2xl > [data-hero-ctas] > a) to animate the
// anchors directly, at the same time contentRef itself is under the scrubbed
// parallax ScrollTrigger below, reproducibly left those anchors' opacity
// pinned at their .from() starting value forever -- GSAP's own render calls
// kept re-writing opacity:0 on them every frame even after the tween's
// onComplete had already fired. One level deep (this wrapper, same depth as
// the headline/subhead) doesn't hit it. Simplest fix: don't go two levels
// deep while a scrubbed ancestor animation is active.
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { KilnAshField } from "@/components/home/KilnAshField";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      // document.fonts.ready resolves asynchronously (a microtask at best),
      // which happens AFTER useGSAP's synchronous context-tracking window
      // closes -- animations created inside that .then() would escape
      // automatic revert-on-unmount and, on a fast client-side route change,
      // could get orphaned mid-tween, freezing the hero text at whatever
      // opacity it was interrupted at. contextSafe() re-attaches the async
      // callback to this component's gsap context so it still gets cleaned
      // up correctly on unmount/re-navigation.
      const runEntrance = contextSafe(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
          tl.from("[data-hero-headline]", { opacity: 0, y: 42, scale: 0.97 })
            .from("[data-hero-subhead]", { opacity: 0, y: 30 }, "-=0.72")
            .from("[data-hero-ctas]", { opacity: 0, y: 24 }, "-=0.66");
          return () => tl.kill();
        });
        return () => mm.revert();
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(runEntrance).catch(runEntrance);
      } else {
        runEntrance();
      }
    },
    { scope: sectionRef },
  );

  // Scroll-linked parallax handoff into home-ethos below: content (foreground)
  // rises and fades faster than the Kiln-ash backdrop (background), giving the
  // hero depth as it exits and matching the "hero fades its content out
  // slightly as the next section resolves in" handoff used elsewhere on this
  // page. Scrubbed (not once-only) so it tracks scroll position exactly,
  // reversing cleanly if the reader scrolls back up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          animation: gsap
            .timeline()
            .to(contentRef.current, { yPercent: -22, opacity: 0.25, ease: "none" }, 0)
            .to(bgRef.current, { yPercent: -8, ease: "none" }, 0),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="home-hero"
      className="relative isolate flex min-h-[calc(100svh-72px)] items-center overflow-hidden bg-porcelain"
    >
      <div ref={bgRef} className="absolute inset-0">
        <KilnAshField />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 32% 45%, transparent 45%, rgba(254,253,251,0.5) 100%)",
          }}
        />
      </div>
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1
            data-hero-headline
            className="font-heading text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
          >
            Every publication, individually accountable.
          </h1>
          <p data-hero-subhead className="mt-6 max-w-lg text-lg leading-relaxed text-slate">
            Peer-reviewed journals and scholarly books, presented with a maker&apos;s care, not a
            database&apos;s indifference.
          </p>
          <div data-hero-ctas className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/journals"
              className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-sage-ink transition-all duration-200 hover:-translate-y-px hover:bg-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Browse journals
            </Link>
            <Link
              href="/books"
              className="rounded-full border border-hairline bg-porcelain-soft/60 px-6 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Browse books
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
