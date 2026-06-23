import { defineConfig } from "drizzle-kit";

// Migrations are the source of truth — commit db/migrations. Generate after any
// schema change (npm run db:generate); apply with npm run db:migrate.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
