import { createAuthClient } from "better-auth/react";

// Browser client — same-origin, talks to /api/auth. Used by the sign-in and
// register forms and the sign-out control.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
