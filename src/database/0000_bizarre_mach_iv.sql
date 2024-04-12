DO $$ BEGIN
 CREATE TYPE "BotListSource" AS ENUM('DISCORD_LIST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "BotStatus" AS ENUM('DENIED', 'PENDING', 'APPROVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BadgeToUser" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BotToUser" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bots" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar" text,
	"certified" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"status" "BotStatus" DEFAULT 'PENDING' NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"prefix" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	"github" text,
	"invite_link" text,
	"support_server" text,
	"website" text,
	"guild_count" integer DEFAULT 0 NOT NULL,
	"api_key" text,
	"imported_from" "BotListSource",
	"user_permissions" json[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"bio" text,
	"username" text NOT NULL,
	"avatar" text,
	"banner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BotToTag" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"name" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"rating" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"bot_id" text NOT NULL,
	"user_id" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"user_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token" text NOT NULL,
	CONSTRAINT "sessions_pkey" PRIMARY KEY("refresh_token","access_token")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BadgeToUser_AB_unique" ON "_BadgeToUser" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BadgeToUser_B_index" ON "_BadgeToUser" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BotToUser_AB_unique" ON "_BotToUser" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BotToUser_B_index" ON "_BotToUser" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bots_api_key_key" ON "bots" ("api_key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_BotToTag_AB_unique" ON "_BotToTag" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_BotToTag_B_index" ON "_BotToTag" ("B");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "review_replies_review_id_user_id_key" ON "review_replies" ("review_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_bot_id_user_id_key" ON "reviews" ("bot_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_refresh_token_key" ON "sessions" ("refresh_token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_access_token_key" ON "sessions" ("access_token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BadgeToUser" ADD CONSTRAINT "_BadgeToUser_A_badges_id_fk" FOREIGN KEY ("A") REFERENCES "badges"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BadgeToUser" ADD CONSTRAINT "_BadgeToUser_B_users_id_fk" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BotToUser" ADD CONSTRAINT "_BotToUser_A_bots_id_fk" FOREIGN KEY ("A") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BotToUser" ADD CONSTRAINT "_BotToUser_B_users_id_fk" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BotToTag" ADD CONSTRAINT "_BotToTag_A_bots_id_fk" FOREIGN KEY ("A") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_BotToTag" ADD CONSTRAINT "_BotToTag_B_tags_name_fk" FOREIGN KEY ("B") REFERENCES "tags"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_id_bots_id_fk" FOREIGN KEY ("id") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
