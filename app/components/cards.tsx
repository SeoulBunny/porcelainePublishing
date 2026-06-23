import Link from "next/link";
import type { JournalCard as JournalCardData, BookCard as BookCardData } from "@/lib/db/queries";
import { CoverPlate, MetaRow } from "./ui";

export function JournalCard({
  journal,
  latestDate,
  authors,
}: {
  journal: JournalCardData;
  latestDate?: string | null;
  authors?: string[];
}) {
  const year = latestDate ? latestDate.slice(0, 4) : String(journal.foundedYear);
  return (
    <Link href={`/journals/${journal.slug}`} className="group block">
      <CoverPlate
        kicker={journal.topic ?? undefined}
        title={journal.title}
        tint={journal.tint ?? ""}
        seed={journal.id}
        byline={
          authors && authors.length
            ? authors.slice(0, 2).join(", ")
            : `Est. ${journal.foundedYear}`
        }
      />
      <div className="mt-5 space-y-3">
        <h3 className="font-serif text-2xl leading-tight text-ink">{journal.title}</h3>
        <p className="text-sm leading-relaxed text-body line-clamp-3">
          {journal.description}
        </p>
        <MetaRow
          items={[
            journal.topic ?? undefined,
            authors && authors.length ? authors.slice(0, 2).join(", ") : undefined,
            `Latest ${year}`,
          ]}
        />
      </div>
    </Link>
  );
}

export function BookCard({
  book,
  authors,
}: {
  book: BookCardData;
  authors?: string[];
}) {
  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <CoverPlate
        kicker={book.topic ?? undefined}
        title={book.title}
        tint={book.tint ?? ""}
        seed={book.id}
        byline={authors && authors.length ? authors.join(", ") : undefined}
      />
      <div className="mt-5 space-y-3">
        <h3 className="font-serif text-2xl leading-tight text-ink">{book.title}</h3>
        <p className="text-sm leading-relaxed text-body line-clamp-3">
          {book.synopsis}
        </p>
        <MetaRow
          items={[
            book.topic ?? undefined,
            authors && authors.length ? authors.join(", ") : undefined,
            book.publishedOn?.slice(0, 4),
          ]}
        />
      </div>
    </Link>
  );
}
