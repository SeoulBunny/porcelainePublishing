import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscriber } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import SubscribeConfirm from "@/emails/subscribe";

// ponytail: in-memory fixed-window limiter — 5 req / 10 min / IP. Per-instance
// only (resets on redeploy, not shared across regions); enough to stop email-
// bombing through this open endpoint. Swap for a shared store (Redis) if it runs
// multi-instance and abuse still gets through.
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count += 1;
  return h.count > MAX;
}

// Visitor email capture: store the address, send a (non-critical) confirmation.
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  // minimal validation at the trust boundary
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }
  const name = (body.name ?? "").trim() || null;

  await db.insert(subscriber).values({ email, name, source: "site" }).onConflictDoNothing();

  // fire-and-forget — a mail failure must not fail the signup
  void sendEmail({
    to: email,
    subject: "You’re on the list",
    react: SubscribeConfirm({ name: name ?? undefined }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
