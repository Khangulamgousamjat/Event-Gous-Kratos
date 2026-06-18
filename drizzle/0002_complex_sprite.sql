CREATE TABLE "organizers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizer_name" text NOT NULL,
	"role" text,
	"contact" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedule_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" integer NOT NULL,
	"sort_index" integer NOT NULL,
	"time_slot" text NOT NULL,
	"venue" text,
	"linked_event_id" uuid,
	"is_break" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"name" text NOT NULL,
	"college" text,
	"branch" text,
	"year" integer,
	"phone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team_size_min" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "expected_participants" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "prize_details" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "team_id" uuid;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "payment_notes" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "total_fee" integer;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "checked_in" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "checked_in_at" timestamp;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "registration_open" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "upi_id" text;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "fee_per_person" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "deadline" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_linked_event_id_events_id_fk" FOREIGN KEY ("linked_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;