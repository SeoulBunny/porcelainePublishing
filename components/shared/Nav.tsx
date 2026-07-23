"use client";

// Adapted from the user's glassmorphic dark sticky navbar (51cd16a1): recolored
// from dark glass to a light porcelain-glass treatment (porcelain-soft at ~85%
// opacity + backdrop-blur, hairline bottom border instead of the source's
// white/10 border), CSS-only hamburger mechanic replaced with a controlled
// React toggle so the mobile sheet can share the auth state with the desktop
// bar. Renders once from the root layout for all 11 pages.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { VesselMark } from "@/components/shared/VesselMark";
import { useMockAuth } from "@/lib/auth/mock-auth";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/journals", label: "Journals" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useMockAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/journals?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      data-section="global-nav"
      className="sticky top-0 z-30 border-b border-hairline bg-porcelain-soft/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-ink transition-colors hover:text-slate"
        >
          <VesselMark className="h-7 w-7 text-sage" />
          <span className="font-heading text-lg tracking-[-0.01em]">Porcelain</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`kiln-hover relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-slate hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 -bottom-px h-px bg-sage transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <form onSubmit={onSearchSubmit} className="relative hidden max-w-[220px] flex-1 md:block">
          <label htmlFor={searchId} className="sr-only">
            Search journals and books
          </label>
          <FiSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-hairline bg-porcelain py-1.5 pl-9 pr-3 text-sm text-ink placeholder:text-slate/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          />
        </form>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-2 rounded-full border border-hairline py-1 pl-1 pr-3 text-sm text-ink hover:border-sage"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-xs font-semibold text-sage-ink">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name}
              </button>
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-hairline bg-porcelain-soft py-1 shadow-[0_8px_24px_-8px_rgba(26,32,44,0.18)]"
                >
                  <Link role="menuitem" href="/about" className="block px-4 py-2 text-sm text-ink hover:bg-porcelain">
                    Profile
                  </Link>
                  <Link role="menuitem" href="/about" className="block px-4 py-2 text-sm text-ink hover:bg-porcelain">
                    Settings
                  </Link>
                  {user.role === "admin" && (
                    <Link role="menuitem" href="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-porcelain">
                      Admin
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    type="button"
                    onClick={signOut}
                    className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-porcelain"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-slate"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-sage-ink transition-colors hover:bg-sage-hover"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
        >
          {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-sheet"
          className="border-t border-hairline bg-porcelain-soft px-4 pb-6 pt-2 lg:hidden motion-safe:animate-[fadeIn_200ms_ease-out]"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 py-2">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-porcelain"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={onSearchSubmit} className="relative mt-2">
            <label htmlFor={`${searchId}-mobile`} className="sr-only">
              Search journals and books
            </label>
            <FiSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              id={`${searchId}-mobile`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-hairline bg-porcelain py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </form>
          <div className="mt-4 flex gap-2">
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="flex-1 rounded-full border border-hairline py-2 text-sm font-medium text-ink"
              >
                Log out
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 rounded-full border border-hairline py-2 text-center text-sm font-medium text-ink">
                  Log in
                </Link>
                <Link href="/auth/signup" className="flex-1 rounded-full bg-sage py-2 text-center text-sm font-semibold text-sage-ink">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
