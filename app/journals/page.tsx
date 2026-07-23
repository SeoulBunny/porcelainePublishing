import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JournalsBrowser } from "@/components/journals/JournalsBrowser";

export const metadata: Metadata = {
  title: "Journals",
  description:
    "Browse peer-reviewed journals across the humanities and sciences, searchable by topic and publication date.",
  alternates: { canonical: "/journals" },
};

export default function JournalsPage() {
  return (
    <>
      {/* renders data-section="journals-header" via PageHeader's sectionId prop */}
      <PageHeader
        sectionId="journals-header"
        title="Journals"
        intro="Peer-reviewed research across the humanities and sciences, updated as new issues are fired and finished."
      />
      <Suspense fallback={null}>
        <JournalsBrowser />
      </Suspense>
    </>
  );
}
