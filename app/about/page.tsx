import type { Metadata } from "next";
import { Container, InkButton, PageHeader } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "About Porcelaine",
  description:
    "About Porcelaine Publishing — an international academic publisher based in Seoul.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The press"
        title="About Porcelaine"
        intro="An international academic publisher based in Seoul, presenting the work of scholars from many institutions under one quiet imprint."
      />
      <Container className="pb-24">
        <div className="grid gap-16 border-t border-hairline pt-12 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <h2 className="eyebrow">What we publish</h2>
            <p className="eyebrow">Founded 2006 · Seoul</p>
          </div>
          <div className="prose-porcelain">
            <p>
              Porcelaine Publishing exists to give serious scholarship a setting
              equal to its care. We publish eleven peer-reviewed journals and a
              growing list of books, drawing together work from universities and
              independent scholars across the world.
            </p>
            <p>
              The name is a promise about presentation. Porcelain is unglamorous in
              its ambition — white, exact, durable, made to be handled and to last.
              We try to give every article and every volume the same plainness and
              the same permanence.
            </p>
            <h2>How the press is organised</h2>
            <p>
              Each journal is edited independently, with its own editorial board, and
              is published in dated editions. Books are commissioned separately.
              Across all of it, a single editorial standard applies: clarity first,
              ornament never.
            </p>
            <h2>Working with us</h2>
            <p>
              Writers may submit work to any of our journals; editors review within
              their own titles; and accepted work is gathered into new editions and
              published here. If you would like to contribute, sign in to the
              contributor area or write to the editorial office.
            </p>
          </div>
        </div>

        <Reveal className="mt-20 border-t border-hairline pt-14 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-ink">
            Explore the catalogue, or get in touch about contributing.
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <InkButton href="/journals" variant="solid">
              Browse journals
            </InkButton>
            <InkButton href="/contact">Contact the press</InkButton>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
