ALTER TABLE "_BotToUser" ADD COLUMN "is_owner" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "_BotToUser" ADD COLUMN "permissions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bots" DROP COLUMN IF EXISTS "user_permissions";