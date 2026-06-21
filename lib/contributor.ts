import type { Role } from "@/lib/db/queries";

export type PersonKind = "author" | "editor";

export function roleFromFlags(f: { writer: boolean; editor: boolean; admin: boolean }): Role {
  if (f.admin) return "admin";
  if (f.editor) return "editor";
  if (f.writer) return "writer";
  return "reader";
}

export function kindsFromFlags(f: { writer: boolean; editor: boolean }): PersonKind[] {
  const k: PersonKind[] = [];
  if (f.writer) k.push("author");
  if (f.editor) k.push("editor");
  return k;
}
