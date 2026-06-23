CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article" (
	"id" text PRIMARY KEY NOT NULL,
	"edition_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"abstract" text,
	"body" jsonb,
	"doi" text,
	"keywords" text[],
	"published_on" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "article_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "article_author" (
	"article_id" text NOT NULL,
	"person_id" text NOT NULL,
	"ord" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "article_author_article_id_person_id_pk" PRIMARY KEY("article_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"isbn" text,
	"topic" text,
	"synopsis" text,
	"cover_url" text,
	"tint" text,
	"published_on" date,
	"access_note" text,
	CONSTRAINT "book_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "book_author" (
	"book_id" text NOT NULL,
	"person_id" text NOT NULL,
	"ord" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "book_author_book_id_person_id_pk" PRIMARY KEY("book_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "edition" (
	"id" text PRIMARY KEY NOT NULL,
	"journal_id" text NOT NULL,
	"slug" text NOT NULL,
	"volume" integer,
	"issue" integer,
	"title" text,
	"summary" text,
	"cover_url" text,
	"published_on" date
);
--> statement-breakpoint
CREATE TABLE "journal" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"issn" text,
	"topic" text,
	"description" text,
	"cover_url" text,
	"tint" text,
	"founded_year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "journal_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "journal_editor" (
	"journal_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "journal_editor_journal_id_user_id_pk" PRIMARY KEY("journal_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"kind" text[] DEFAULT '{author}'::text[] NOT NULL,
	"affiliation" text,
	"bio" text,
	"photo_url" text,
	"orcid" text,
	"user_id" text,
	CONSTRAINT "person_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "review_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"author_user_id" text NOT NULL,
	"sender_role" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_comment_sender" CHECK ("review_comment"."sender_role" in ('writer','editor'))
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_id" text NOT NULL,
	"author_user_id" text NOT NULL,
	"title" text NOT NULL,
	"abstract" text,
	"pdf_key" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"target_edition_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "submission_status" CHECK ("submission"."status" in ('submitted','in_review','changes_requested','accepted','complete','published'))
);
--> statement-breakpoint
CREATE TABLE "subscriber" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'reader' NOT NULL,
	CONSTRAINT "user_role_role" CHECK ("user_role"."role" in ('reader','writer','editor','admin'))
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_edition_id_edition_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."edition"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "article_author_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "article_author_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edition" ADD CONSTRAINT "edition_journal_id_journal_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_editor" ADD CONSTRAINT "journal_editor_journal_id_journal_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_editor" ADD CONSTRAINT "journal_editor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comment" ADD CONSTRAINT "review_comment_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_comment" ADD CONSTRAINT "review_comment_author_user_id_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_journal_id_journal_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_author_user_id_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_target_edition_id_edition_id_fk" FOREIGN KEY ("target_edition_id") REFERENCES "public"."edition"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_article_edition" ON "article" USING btree ("edition_id");--> statement-breakpoint
CREATE UNIQUE INDEX "edition_journal_slug" ON "edition" USING btree ("journal_id","slug");--> statement-breakpoint
CREATE INDEX "idx_edition_journal_date" ON "edition" USING btree ("journal_id","published_on");--> statement-breakpoint
CREATE INDEX "idx_review_comment_submission" ON "review_comment" USING btree ("submission_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_submission_journal_status" ON "submission" USING btree ("journal_id","status");--> statement-breakpoint
CREATE INDEX "idx_submission_author" ON "submission" USING btree ("author_user_id","status");