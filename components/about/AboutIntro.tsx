// about-intro — first of 6 stacked About sections; introduces the Ledger
// Rail device. Support block is a short mission statement plus
// a pull-quote (border-left rule + italic Playfair, the site's one
// sanctioned quote style).

import { LedgerRail } from "@/components/shared/LedgerRail";

export function AboutIntro() {
  return (
    // renders data-section="about-intro" via LedgerRail's id prop
    <LedgerRail id="about-intro" heading="Our mission">
      <div className="space-y-6">
        <p className="max-w-[65ch] text-base leading-relaxed text-slate">
          Porcelain Publishing exists because scholarship deserves a presentation as considered as
          the research inside it. We built a platform that treats every journal issue and every
          book like a finished piece, examined and accountable, rather than another row in a
          database.
        </p>
        <blockquote className="border-l-2 border-sage/60 pl-6">
          <p className="font-heading text-xl italic leading-snug text-ink">
            A publication should feel handled by someone who cares whether it holds together, not
            just whether it clears review.
          </p>
        </blockquote>
      </div>
    </LedgerRail>
  );
}
