# Contributor / Admin system — provisioning runbook

The public catalogue runs on mock data and needs nothing here. The three
contributor systems (writer / editor / admin) need a database, auth providers,
and PDF storage. Everything is wired in code — this is the one-time setup to
make it live. All values go in `.env.local` (template: `.env.example`).

## 1. Database — Neon Postgres (Drizzle)
1. Create a project at https://neon.tech. Copy the **pooled** connection string.
2. Set `DATABASE_URL` (keep `?sslmode=require`).
3. Apply the schema + seed:
   ```
   npm run db:generate  # only after editing db/schema.ts (migrations are committed)
   npm run db:migrate   # applies db/migrations to the database
   npm run db:seed      # loads the mock catalogue (journals/editions/people/…)
   npm run db:seed:dev  # optional: writer/editor/admin@example.com (password123)
   ```
The data layer is Drizzle over Neon — to move to a self-hosted Postgres later,
change `DATABASE_URL` only.

## 2. Better Auth secret
```
openssl rand -base64 32   # set as BETTER_AUTH_SECRET
```
Also set `BETTER_AUTH_URL` (e.g. `http://localhost:3000`, or your prod URL).

## 3. Google OAuth (optional — the button only shows when both are set)
1. https://console.cloud.google.com → APIs & Services → Credentials → OAuth client (Web).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   (add the production URL too when deploying).
3. Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 4. Resend (verification, password reset, subscriber confirmations)
Email sign-up **requires email verification**, so Resend must work before new
accounts can sign in.
1. https://resend.com → API key. Set `RESEND_API_KEY`.
2. Verify a sending domain (SPF/DKIM); set `EMAIL_FROM` to an address on it,
   e.g. `"Porcelaine <editorial@yourdomain.com>"`.
   - Before verifying a domain, use `"Porcelaine <onboarding@resend.dev>"` —
     it only delivers to your own Resend account email (dev only).

## 5. PDF storage — Cloudflare R2 (S3 API)
1. Cloudflare dashboard → R2 → bucket `porcelainepublishing` (keep it **private**).
2. Create an R2 API token (Object Read & Write). Set:
   - `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com` (no bucket in the path)
   - `S3_REGION=auto`, `S3_BUCKET=porcelainepublishing`
   - `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
3. CORS on the bucket — allow browser `PUT`/`GET` from your origin:
   ```json
   [{ "AllowedOrigins": ["http://localhost:3000"],
      "AllowedMethods": ["PUT","GET"],
      "AllowedHeaders": ["content-type"] }]
   ```
Later (self-host): point `S3_ENDPOINT` at MinIO and swap credentials — no code change.

## 6. Make yourself an admin
After registering once at `/register` and verifying your email (creates your
`user` row + default `reader` role):
```sql
update user_role set role = 'admin'
where user_id = (select id from "user" where email = 'you@example.com');
```
From then on, manage every other user from **/admin/manage/users**.

## Roles & flow
- **Reader** (default) — browse the site only.
- **Writer** — `/admin/writer`: choose a journal, upload one PDF, trade comments
  with the editor, replace the PDF on request.
- **Editor** — `/admin/editor`: sees only assigned journals; downloads the PDF,
  comments, sets status, marks **complete** to pass it on.
- **Admin** — `/admin/manage/*`: roles, editor↔journal assignments, publish queue.
  Cannot demote itself or the last admin.

## Out of scope (separate content step)
Publishing marks a completed submission `published` and archives it. Typesetting
the PDF into a public `article` row inside an `edition` is editorial content work
— the public catalogue renders prose blocks, not PDFs — and is not automated here.
