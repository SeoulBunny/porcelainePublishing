import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/auth/guards";
import { Container } from "@/app/components/ui";
import type { Role } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Contributor area",
  robots: { index: false },
};

const NAV: { href: string; label: string; min: Role }[] = [
  { href: "/admin/writer", label: "My submissions", min: "writer" },
  { href: "/admin/editor", label: "Review queue", min: "editor" },
  { href: "/admin/editor/assemble", label: "Assemble issue", min: "editor" },
  { href: "/admin/manage/journals", label: "Journals", min: "admin" },
  { href: "/admin/manage/articles", label: "Articles", min: "admin" },
  { href: "/admin/manage/users", label: "Users & roles", min: "admin" },
  { href: "/admin/manage/editors", label: "Editor assignments", min: "admin" },
  { href: "/admin/manage/publish", label: "Publish queue", min: "admin" },
];

const RANK: Record<Role, number> = { reader: 0, writer: 1, editor: 2, admin: 3 };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const links = NAV.filter((l) => RANK[user.role] >= RANK[l.min]);

  return (
    <Container className="py-12">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="eyebrow mb-1">Contributor area · {user.role}</p>
          <p className="font-serif text-2xl text-ink">{user.name ?? user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await auth.api.signOut({ headers: await headers() });
            redirect("/");
          }}
        >
          <button type="submit" className="eyebrow text-muted hover:text-ink link-underline">
            Sign out
          </button>
        </form>
      </div>

      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <nav aria-label="Contributor" className="flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="eyebrow text-muted hover:text-ink link-underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
