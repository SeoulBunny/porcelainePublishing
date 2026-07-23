"use client";

// home-cta — adapted from the user's minimal CTA section (b7b11da1): icon in
// a neutral-bordered circle, headline/body rewritten for Porcelain
// Publishing, single button carrying the site's "signup" intent (distinct
// from home-newsletter's "subscribe" intent directly below it).

import Link from "next/link";
import { useRef } from "react";
import { FiBookOpen } from "react-icons/fi";
import { useFadeUp } from "@/lib/motion/useFadeUp";

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeUp(sectionRef);

  return (
    <section ref={sectionRef} data-section="home-cta" className="bg-porcelain-soft py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-porcelain">
          <FiBookOpen className="h-6 w-6 text-slate" aria-hidden />
        </div>
        <h2 className="mt-6 font-heading text-3xl text-ink sm:text-4xl">Join the reading room</h2>
        <p className="mt-4 text-base leading-relaxed text-slate">
          Create a free account to save journals and books to your shelf, follow contributors
          across disciplines, and pick up articles where you left off.
        </p>
        <Link
          href="/auth/signup"
          className="mt-8 inline-block rounded-full bg-sage px-7 py-3 text-sm font-semibold text-sage-ink transition-all duration-200 hover:-translate-y-px hover:bg-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Create your account
        </Link>
      </div>
    </section>
  );
}
