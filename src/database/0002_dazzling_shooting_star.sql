DO $$ BEGIN
 CREATE TYPE "VanityType" AS ENUM('USER', 'BOT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vanities" (
	"id" text PRIMARY KEY NOT NULL,
	"target_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" "VanityType" NOT NULL
);
