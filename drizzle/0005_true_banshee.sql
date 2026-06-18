ALTER TYPE "public"."user_role" ADD VALUE 'VOLUNTEER';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "sort_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "department" text;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "linkedin" text;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "instagram" text;--> statement-breakpoint
ALTER TABLE "organizers" ADD COLUMN "sort_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "hero_image" text;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "about_image_1" text;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "about_image_2" text;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "about_image_3" text;--> statement-breakpoint
CREATE INDEX "announcements_active_idx" ON "announcements" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "registrations_user_idx" ON "registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "registrations_status_idx" ON "registrations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "registrations_team_idx" ON "registrations" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "schedule_slots_day_sort_idx" ON "schedule_slots" USING btree ("day","sort_index");--> statement-breakpoint
CREATE INDEX "schedule_slots_event_idx" ON "schedule_slots" USING btree ("linked_event_id");--> statement-breakpoint
CREATE INDEX "team_members_team_idx" ON "team_members" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_members_phone_idx" ON "team_members" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "registrations" DROP COLUMN "checked_in";--> statement-breakpoint
ALTER TABLE "registrations" DROP COLUMN "checked_in_at";--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "checked_in";--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "checked_in_at";