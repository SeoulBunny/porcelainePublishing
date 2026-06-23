import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRole, isEditorOfJournal } from "@/lib/db/queries";
import type { Role } from "@/lib/db/queries";

// Central authorisation. Server actions are reachable by direct POST, so every
// one must call these — UI hiding is not security. Better Auth confirms identity
// (session); the app role + editor scope are read fresh from the DB here, never
// trusted from the session snapshot, so role/scope changes take effect at once.

const RANK: Record<Role, number> = { reader: 0, writer: 1, editor: 2, admin: 3 };

export class Unauthorized extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "Unauthorized";
  }
}

export type SessionUser = { id: string; name: string | null; email: string; role: Role };

async function currentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;
  const u = session.user;
  return { id: u.id, name: u.name ?? null, email: u.email ?? "", role: await getRole(u.id) };
}

/** Page-level: returns the user or redirects to sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/signin");
  return user;
}

/** Action-level: returns the user or throws Unauthorized (no redirect). */
export async function getActor(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new Unauthorized("Not signed in");
  return user;
}

export function hasRole(user: SessionUser, min: Role): boolean {
  return RANK[user.role] >= RANK[min];
}

export async function requireRole(min: Role): Promise<SessionUser> {
  const user = await getActor();
  if (!hasRole(user, min)) throw new Unauthorized(`Requires ${min}`);
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole("admin");
}

/** Can this user review the given journal's submissions? Admin OR scoped editor. */
export async function assertCanEditJournal(user: SessionUser, journalId: string): Promise<void> {
  if (user.role === "admin") return;
  if (user.role === "editor" && (await isEditorOfJournal(user.id, journalId))) return;
  throw new Unauthorized("Not an editor of this journal");
}

/** Re-read the role fresh from the DB (used for self-lockout checks). */
export function freshRole(userId: string): Promise<Role> {
  return getRole(userId);
}
