import { booksByRecency, journalsByRecency } from "@/lib/db/queries";
import { Container, InkButton, SectionHeader } from "@/app/components/ui";
import { JournalCard, BookCard } from "@/app/components/cards";
import { Reveal } from "@/app/components/reveal";
import { Hero } from "@/app/components/hero";

export default async function Home() {
  const recentJournals = (await journalsByRecency()).slice(0, 3);
  const recentBooks = (await booksByRecency()).slice(0, 3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <Hero />

      {/* ── Recent journals ───────────────────────────────────── */}
      <Container className="pt-24">
        <SectionHeader
          eyebrow="Latest editions"
          title="Recent journals"
          intro="Eleven journals across the humanities and sciences, each published in dated editions."
          action={{ href: "/journals", label: "All journals" }}
        />
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {recentJournals.map((j, i) => (
            <Reveal key={j.id} delay={i * 80}>
              <JournalCard
                journal={j}
                latestDate={j.latestDate}
                authors={j.authors}
              />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ── Recent books ──────────────────────────────────────── */}
      <Container className="pt-24">
        <SectionHeader
          eyebrow="From the press"
          title="Recent books"
          action={{ href: "/books", label: "All books" }}
        />
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {recentBooks.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <BookCard book={b} authors={b.authors} />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ── Quiet invitation ──────────────────────────────────── */}
      <Container className="pt-28">
        <Reveal className="border-t border-hairline pt-16 text-center">
          <p className="eyebrow mb-4">For researchers</p>
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-ink">
            Read the work, meet the authors, and — when you are ready — submit your
            own.
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <InkButton href="/authors">Authors &amp; editors</InkButton>
            <InkButton href="/about">About the press</InkButton>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
