import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { BooksBrowser } from "@/components/books/BooksBrowser";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Browse scholarly books across the humanities and sciences, searchable by subject and publication year.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  return (
    <>
      {/* renders data-section="books-header" via PageHeader's sectionId prop */}
      <PageHeader
        sectionId="books-header"
        title="Books"
        intro="Monographs and edited volumes presented with the same care given to the research inside them."
      />
      <BooksBrowser />
    </>
  );
}
