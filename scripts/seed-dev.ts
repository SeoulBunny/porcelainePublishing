// Dev accounts (writer/editor/admin) + a sample submission with a two-way thread,
// so the dashboards show content before real users exist. Creates Better Auth
// users directly (verified, password hashed by Better Auth) — no verification
// email is sent. Idempotent. Run: npm run db:seed:dev  (after db:seed)
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { user, account, userRole, journalEditor, submission, reviewComment } from "../db/schema";
import { auth } from "../lib/auth";

const ACCOUNTS = [
  { email: "writer@example.com", name: "Wendy Writer", role: "writer" as const },
  { email: "editor@example.com", name: "Eddie Editor", role: "editor" as const },
  { email: "admin@example.com", name: "Adah Admin", role: "admin" as const },
];

const DEV_PASSWORD = "password123"; // dev-only; all placeholder accounts share it
const JOURNAL_ID = "j-ceramic"; // seeded by db:seed

async function main() {
  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(DEV_PASSWORD);
  const ids: Record<string, string> = {};

  for (const a of ACCOUNTS) {
    const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, a.email));
    let id = existing?.id;
    if (!id) {
      id = randomUUID();
      await db.insert(user).values({ id, name: a.name, email: a.email, emailVerified: true });
      await db.insert(account).values({
        id: randomUUID(),
        accountId: id,
        providerId: "credential",
        userId: id,
        password: hashed,
      });
    }
    await db
      .insert(userRole)
      .values({ userId: id, role: a.role })
      .onConflictDoUpdate({ target: userRole.userId, set: { role: a.role } });
    ids[a.email] = id;
  }

  // editor scoped to Ceramic Histories
  await db
    .insert(journalEditor)
    .values({ journalId: JOURNAL_ID, userId: ids["editor@example.com"] })
    .onConflictDoNothing();

  // one sample submission with a two-way thread (skip if one already exists)
  const [already] = await db
    .select({ id: submission.id })
    .from(submission)
    .where(eq(submission.authorUserId, ids["writer@example.com"]))
    .limit(1);
  if (!already) {
    const [sub] = await db
      .insert(submission)
      .values({
        journalId: JOURNAL_ID,
        authorUserId: ids["writer@example.com"],
        title: "Kiln Atmospheres and Celadon Hue",
        abstract: "A study of reduction firing and its effect on celadon colour in 12th-century wares.",
        status: "in_review",
      })
      .returning({ id: submission.id });
    await db.insert(reviewComment).values([
      {
        submissionId: sub.id,
        authorUserId: ids["editor@example.com"],
        senderRole: "editor",
        body: "Promising. Please expand the methodology section and clarify the sample sizes.",
      },
      {
        submissionId: sub.id,
        authorUserId: ids["writer@example.com"],
        senderRole: "writer",
        body: "Thanks — methodology expanded, sample sizes added in §3.",
      },
    ]);
  }

  console.log(`dev seed complete. Sign in at /signin (password: ${DEV_PASSWORD}):`);
  for (const a of ACCOUNTS) console.log(`  ${a.role.padEnd(6)} → ${a.email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
