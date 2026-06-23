import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// One Drizzle client over Neon's HTTP driver — the right fit for serverless
// request/response queries on Vercel. DATABASE_URL swaps to a self-hosted
// Postgres later with no code change. neon() is lazy, so importing this at
// build time (no DB) is fine; it only connects on the first query.
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
