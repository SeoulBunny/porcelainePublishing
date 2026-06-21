import type { Metadata } from "next";
import { people, getArticlesByAuthor, getBooksByAuthor } from "@/lib/data";
import { listPublicContributors } from "@/lib/db/queries";
import { Container, PageHeader } from "@/app/components/ui";
import { AuthorsDirectory, type DirEntry } from "./directory";

export const metadata: Metadata = {
  title: "Authors & Editors",
  description:
    "The authors and editors who contribute to and shape Porcelaine Publishing's journals and books.",
};

export default async function AuthorsPage() {
  const dbc = await listPublicContributors();
  const entries: DirEntry[] = [
    ...people.map((p) => ({
      slug: p.slug,
      name: p.name,
      affiliation: p.affiliation,
      kind: p.kind as string[],
      work: getArticlesByAuthor(p.id).length + getBooksByAuthor(p.id).length,
    })),
    ...dbc.map((c) => ({
      slug: c.slug,
      name: c.name,
      affiliation: c.affiliation ?? "",
      kind: c.kind,
      work: 0,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

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
