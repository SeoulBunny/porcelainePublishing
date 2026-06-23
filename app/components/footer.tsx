import Link from "next/link";

const columns = [
  {
    heading: "Publishing",
    links: [
      { href: "/about", label: "About Porcelaine" },
      { href: "/journals", label: "Journals" },
      { href: "/books", label: "Books" },
      { href: "/authors", label: "Authors & Editors" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/collaborations", label: "Collaborations" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Contributor sign in" },
    ],
  },
  {
    heading: "Legal",
    links: [{ href: "/legal", label: "Privacy & Rights" }],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-porcelain">
      <div className="mx-auto max-w-[1240px] px-[clamp(1.25rem,4vw,2.5rem)] py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl leading-none text-ink">Porcelaine</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              International academic publishing. Journals and books, presented with
              quiet care, from Seoul to the world.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="eyebrow">{col.heading}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-body hover:text-ink link-underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-hairline pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Porcelaine Publishing, Seoul. All rights reserved.</p>
          <p>ISSN 2734-0000 · Registered in the Republic of Korea</p>
        </div>
      </div>
    </footer>
  );
}
