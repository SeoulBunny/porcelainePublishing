import type { Metadata } from "next";
import { listContributorsForDirectory } from "@/lib/db/queries";
import { Container, PageHeader } from "@/app/components/ui";
import { AuthorsDirectory, type DirEntry } from "./directory";

export const metadata: Metadata = {
  title: "Authors & Editors",
  description:
    "The authors and editors who contribute to and shape Porcelaine Publishing's journals and books.",
};

export default async function AuthorsPage() {
  const entries: DirEntry[] = await listContributorsForDirectory();

  return (
    <>
      <PageHeader
        eyebrow="The people"
        title="Authors & Editors"
        intro="The scholars who write for and edit Porcelaine's journals and books, drawn from institutions across the world."
      />
      <Container className="pb-24">
        <AuthorsDirectory entries={entries} />
      </Container>
    </>
  );
}
