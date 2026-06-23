import { Unauthorized } from "@/lib/auth/guards";

export type ActionState = { ok: boolean; error?: string };

export const ok: ActionState = { ok: true };
export const fail = (error: string): ActionState => ({ ok: false, error });

// Turn a thrown error into a user-safe ActionState. Auth failures surface their
// message; anything else is logged and returned generically (no leak).
export function toActionState(err: unknown): ActionState {
  if (err instanceof Unauthorized) return fail(err.message);
  console.error("action error:", err);
  return fail("Something went wrong. Try again.");
}
