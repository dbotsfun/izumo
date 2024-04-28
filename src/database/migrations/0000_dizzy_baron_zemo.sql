CREATE TABLE IF NOT EXISTS "_BadgeToUser" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BotToTag" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_BotToUser" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bots" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"certified" boolean DEFAULT false NOT NULL,
	"banner" text,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"prefix" text,
	"github" text,
	"invite_link" text,
	"support_server" text,
	"website" text,
	"guild_count" integer DEFAULT 0 NOT NULL,
	"api_key" text,
	"imported_from" text,
	"user_permissions" jsonb[] DEFAULT '{}'::jsonb[] NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"user_id" text PRIMARY KEY NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"avatar" text,
	"banner" text,
	"bio" text,
	"permissions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vanities" (
	"id" text PRIMARY KEY NOT NULL,
	"target_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" text NOT NULL,
	"user_id" text NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"events" text[] NOT NULL,
	"payload_fields" text[] DEFAULT '{}'::text[] NOT NULL
);
