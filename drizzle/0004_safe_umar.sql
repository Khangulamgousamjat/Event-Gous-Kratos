ALTER TABLE "team_members" ADD COLUMN "checked_in" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "checked_in_at" timestamp;