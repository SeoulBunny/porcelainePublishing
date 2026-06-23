"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Container, InkButton } from "@/app/components/ui";

const COMPANY = "Porcelaine Publishing";

const HEADLINE = ["Advancing scholarship", "across disciplines and borders."];

/** Subtle marble veining + sparse ink marks, drawn inline so it needs no asset.
 *  Multiply blend keeps only the dark strokes over the marble. */
function Veining() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] mix-blend-multiply"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="#1a1a1a" strokeWidth="1.1" strokeLinecap="round">
        <path d="M-20 120 C 220 60, 360 220, 600 150 S 1020 60, 1240 200" opacity="0.55" />
        <path d="M-20 360 C 260 300, 420 470, 700 380 S 1040 320, 1240 440" opacity="0.4" />
        <path d="M120 820 C 300 600, 240 460, 460 380 S 700 220, 760 -20" opacity="0.35" />
        <path d="M980 820 C 900 620, 1060 520, 1000 360 S 880 180, 1020 -20" opacity="0.3" />
        <path d="M-20 640 C 240 600, 520 700, 820 640 S 1100 600, 1240 660" opacity="0.3" />
      </g>
      <g fill="#1a1a1a">
        <circle cx="180" cy="240" r="2.2" opacity="0.4" />
        <circle cx="540" cy="120" r="1.6" opacity="0.35" />
        <circle cx="880" cy="300" r="2.6" opacity="0.3" />
        <circle cx="320" cy="560" r="1.8" opacity="0.35" />
        <circle cx="1040" cy="520" r="2" opacity="0.3" />
        <circle cx="700" cy="660" r="1.5" opacity="0.3" />
      </g>
    </svg>
  );
}

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>("[data-char]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      const mm = gsap.matchMedia();

      // Reduced motion: show everything immediately, no animation.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([chars, lines, blocks], { opacity: 1, y: 0, filter: "none" });
      });

      // Full motion: name letter-by-letter → headline line-by-line → rest in order.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(chars, { opacity: 0, y: 14, filter: "blur(6px)" });
        gsap.set(lines, { opacity: 0, y: 20 });
        gsap.set(blocks, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.15,
        });

        tl.to(chars, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.04,
        })
          .to(
            lines,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.18,
            },
            "+=0.05",
          )
          .to(
            blocks,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
            },
            "-=0.15",
          );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative">
      <div className="relative min-h-[78vh] w-full overflow-hidden">
        <Image
          src="/images/hero-marble.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Added background markings — sits above the marble, below the text. */}
        <Veining />
        <div className="absolute inset-0 bg-porcelain/10" />
        <Container className="relative flex min-h-[78vh] flex-col justify-center py-24">
          <div ref={root} className="max-w-3xl">
            <p
              className="mb-6 font-serif font-medium tracking-tight text-ink text-[clamp(1.5rem,3.5vw,2.5rem)] leading-none"
              aria-label={COMPANY}
            >
              {COMPANY.split("").map((ch, i) =>
                ch === " " ? (
                  <span key={i} aria-hidden className="inline-block">
                    &nbsp;
                  </span>
                ) : (
                  <span
                    key={i}
                    data-char
                    aria-hidden
                    className="inline-block will-change-transform"
                  >
                    {ch}
                  </span>
                ),
              )}
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] text-ink">
              {HEADLINE.map((line, i) => (
                <span key={i} data-line className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>
            <p
              data-reveal
              className="mt-8 max-w-xl text-lg leading-relaxed text-body"
            >
              An international publisher of academic journals and books, drawing
              together work from institutions across the world — from Seoul to
              everywhere.
            </p>
            <div data-reveal className="mt-10 flex flex-wrap gap-4">
              <InkButton href="/journals" variant="solid">
                Browse journals
              </InkButton>
              <InkButton href="/books">View books</InkButton>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
