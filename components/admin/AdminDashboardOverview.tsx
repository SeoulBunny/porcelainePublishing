// admin-dashboard-overview — key statistics tiles as plain-text key/value
// pairs in a light grid, not a card-grid duplicate of the public-site's
// Kiln-Stamp system (admin's register is utilitarian, per the brief's
// UI-mockup framing). Tiles link through to the relevant mock panel below.

import Link from "next/link";
import { journals } from "@/lib/data/journals";
import { books } from "@/lib/data/books";
import { writers } from "@/lib/data/writers";

const STATS = [
  { label: "Users", value: "1,204", href: "/admin#users" },
  { label: "Journals", value: String(journals.length), href: "/admin#journals" },
  { label: "Books", value: String(books.length), href: "/admin#books" },
  { label: "Contributors", value: String(writers.length), href: "/admin#users" },
];

export function AdminDashboardOverview() {
  return (
    <section data-section="admin-dashboard-overview" className="border-b border-hairline bg-porcelain py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl text-ink">Overview</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-lg border border-hairline p-4 transition-colors hover:border-sage"
            >
              <span className="block text-xs text-slate">{stat.label}</span>
              <span className="mt-1 block font-heading text-2xl text-ink">{stat.value}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
