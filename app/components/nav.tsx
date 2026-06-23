"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/journals", label: "Journals" },
  { href: "/books", label: "Books" },
  { href: "/authors", label: "Authors" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-[var(--dur)] ${
        scrolled
          ? "border-hairline bg-porcelain/85 backdrop-blur"
          : "border-transparent bg-porcelain/0"
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-[clamp(1.25rem,4vw,2.5rem)] py-5">
        <Link
          href="/"
          className="font-serif text-2xl leading-none tracking-tight text-ink"
          aria-label="Porcelaine Publishing — home"
        >
          Porcelaine
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`eyebrow link-underline ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/signin"
            className="eyebrow text-muted hover:text-ink link-underline"
          >
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden eyebrow text-ink"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-hairline bg-porcelain px-[clamp(1.25rem,4vw,2.5rem)] py-6 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-5">
            {[...links, { href: "/signin", label: "Sign in" }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-2xl text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
