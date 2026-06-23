import type { Role } from "@/lib/db/queries";

// Pure scope decision for the review queue — kept DB-free so it can be unit
// tested without a database. This is the isolation rule: an editor can only ever
// resolve to a journal they're assigned to. An out-of-scope request never passes
// through; it narrows to the editor's own journals (or "all" for an admin).
//
// Returns the single journal to show, or null = "all journals" (admin only).
export function pickReviewJournal(
  role: Role,
  allowedIds: string[],
  requested: string | null,
): string | null {
  if (requested && allowedIds.includes(requested)) return requested;
  // No valid request: admins fall back to the all-journals view; everyone else
  // is clamped to their first assigned journal (never an unscoped view).
  return role === "admin" ? null : (allowedIds[0] ?? null);
}
