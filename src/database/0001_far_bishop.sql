ALTER TABLE "reviews" DROP CONSTRAINT "reviews_bot_id_fkey";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_review_id_fkey";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_id_fkey";
--> statement-breakpoint
ALTER TABLE "_BotToUser" DROP CONSTRAINT "_BotToUser_A_fkey";
--> statement-breakpoint
ALTER TABLE "_BotToUser" DROP CONSTRAINT "_BotToUser_B_fkey";
--> statement-breakpoint
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_A_fkey";
--> statement-breakpoint
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_B_fkey";
--> statement-breakpoint
ALTER TABLE "_BadgeToUser" DROP CONSTRAINT "_BadgeToUser_A_fkey";
--> statement-breakpoint
ALTER TABLE "_BadgeToUser" DROP CONSTRAINT "_BadgeToUser_B_fkey";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_bot_id_fkey";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "review_replies" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "badges" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "badges" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "badges" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "short_description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "user_permissions" SET DATA TYPE json[];--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "user_permissions" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "user_permissions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "display_name" text NOT NULL;--> statement-breakpoint
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
 ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_id_bots_id_fk" FOREIGN KEY ("id") REFERENCES "bots"("id") ON DELETE cascade ON UPDATE cascade;
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
