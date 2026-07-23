"use client";

// admin-sidebar-nav — UI mockup only, no functional backend per brief.
// Reuses the site's own porcelain/secondary/accent tokens rather than a
// generic dark-dashboard palette, so admin still reads as part of the same
// brand. Active link gets an accent-sage left rule (a rare sanctioned use:
// this is genuinely functional wayfinding, not decoration).

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";
import { useMockAuth } from "@/lib/auth/mock-auth";

const LINKS = [
  { href: "/admin", label: "Overview", Icon: FiGrid, exact: true },
  { href: "/admin#journals", label: "Journals", Icon: FiLayers },
  { href: "/admin#books", label: "Books", Icon: FiBookOpen },
  { href: "/admin#users", label: "Users", Icon: FiUsers },
  { href: "/admin#activity", label: "Activity", Icon: FiClock },
  { href: "/admin#reports", label: "Reports", Icon: FiBarChart2 },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useMockAuth();

  function handleSignOut() {
    signOut();
    router.push("/admin/login");
  }

  return (
    <section data-section="admin-sidebar-nav" className="border-b border-hairline bg-porcelain-soft lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r">
      <nav aria-label="Admin" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:flex-col lg:overflow-visible lg:px-4 lg:py-8">
        {LINKS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith("/admin");
          return (
            <Link
              key={label}
              href={href}
              className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors lg:whitespace-normal ${
                active && exact
                  ? "border-sage bg-porcelain text-ink"
                  : "border-transparent text-slate hover:bg-porcelain hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-4 pb-8 lg:block">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-porcelain hover:text-ink"
        >
          <FiLogOut className="h-4 w-4 shrink-0" aria-hidden />
          Sign out
        </button>
      </div>
    </section>
  );
}
