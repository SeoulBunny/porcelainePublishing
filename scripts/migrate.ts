// Apply Drizzle migrations (db/migrations) to DATABASE_URL.
// Run: npm run db:migrate  (loads .env.local)
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!));
  await migrate(db, { migrationsFolder: "db/migrations" });
  console.log("migrations complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
