import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { ensureDefaultRole } from "@/lib/db/queries";
import VerifyEmail from "@/emails/verify";
import ResetPassword from "@/emails/reset";

// Better Auth owns identity: email+password (scrypt), sessions, verification,
// reset, optional Google. App role/scope live in user_role/journal_editor and
// are re-checked server-side (lib/auth/guards.ts) — never trusted from session.
// New accounts get the 'reader' tier via the create hook below; an admin
// promotes them afterwards. Rate limiting is on by default in production.

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // react-email element passed directly (this is a .ts file, no JSX) — safe,
    // the component uses no hooks; Resend renders it.
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({ to: user.email, subject: "Reset your password", react: ResetPassword({ url }) });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({ to: user.email, subject: "Verify your email", react: VerifyEmail({ url }) });
    },
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  databaseHooks: {
    user: {
      create: {
        after: async (created) => {
          await ensureDefaultRole(created.id);
        },
      },
    },
  },
});
