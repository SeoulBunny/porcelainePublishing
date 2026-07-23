import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalHeader } from "@/components/journals/JournalHeader";
import { JournalMeta } from "@/components/journals/JournalMeta";
import { JournalShare } from "@/components/journals/JournalShare";
import { JournalIssuesSection } from "@/components/journals/JournalIssuesSection";
import { journals, getJournal } from "@/lib/data/journals";
import { coverImage } from "@/lib/images";

export function generateStaticParams() {
  return journals.map((j) => ({ id: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const journal = getJournal(id);
  if (!journal) return { title: "Journal not found" };
  return {
    title: journal.title,
    description: journal.description,
    alternates: { canonical: `/journals/${journal.slug}` },
    openGraph: {
      title: journal.title,
      description: journal.description,
      images: [coverImage(journal.coverSeed, 800, 1200)],
    },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journal = getJournal(id);
  if (!journal) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Periodical",
    name: journal.title,
    issn: journal.issn,
    description: journal.description,
    publisher: { "@type": "Organization", name: "Porcelain Publishing" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JournalHeader journal={journal} />
      <JournalMeta journal={journal} />
      <JournalShare title={journal.title} />
      <JournalIssuesSection journal={journal} />
    </>
  );
}
