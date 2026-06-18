import { pgTable, foreignKey, uuid, text, timestamp, json, unique, integer, boolean, pgEnum } from "drizzle-orm/pg-core"

export const registrationStatus = pgEnum("registration_status", ['PENDING', 'APPROVED', 'REJECTED'])
export const userRole = pgEnum("user_role", ['PARTICIPANT', 'ADMIN'])


export const registrations = pgTable("registrations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	eventId: uuid("event_id").notNull(),
	teamName: text("team_name"),
	paymentScreenshot: text("payment_screenshot"),
	transactionId: text("transaction_id"),
	status: registrationStatus().default('PENDING'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	members: json(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "registrations_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "registrations_event_id_events_id_fk"
		}),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	fee: integer().notNull(),
	schedule: text(),
	venue: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	tagline: text(),
	branch: text(),
	isCommon: boolean("is_common").default(false),
	teamSize: integer("team_size").default(1),
	format: text().default('SOLO'),
	winners: json(),
}, (table) => [
	unique("events_slug_unique").on(table.slug),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text(),
	college: text(),
	branch: text(),
	phone: text(),
	role: userRole().default('PARTICIPANT'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	xp: integer().default(0),
	level: integer().default(1),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const announcements = pgTable("announcements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	isActive: boolean("is_active").default(true),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "gallery_photos_user_id_users_id_fk"
		}),
]);

export const liveViewers = pgTable("live_viewers", {
	viewerId: text("viewer_id").primaryKey().notNull(),
	lastSeenAt: timestamp("last_seen_at", { mode: 'string' }).defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
	id: integer().default(1).primaryKey().notNull(),
	isGalleryLocked: boolean("is_gallery_locked").default(true),
	resultsRevealTime: timestamp("results_reveal_time", { mode: 'string' }),
	resultsVideoUrl: text("results_video_url"),
});

export const squadPosts = pgTable("squad_posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	eventId: uuid("event_id").notNull(),
	bio: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "squad_posts_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "squad_posts_event_id_events_id_fk"
		}),
]);

export const teamMessages = pgTable("team_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	registrationId: uuid("registration_id").notNull(),
	senderId: uuid("sender_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.registrationId],
			foreignColumns: [registrations.id],
			name: "team_messages_registration_id_registrations_id_fk"
		}),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [users.id],
			name: "team_messages_sender_id_users_id_fk"
		}),
]);
