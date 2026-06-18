import { relations } from "drizzle-orm/relations";
import { users, registrations, events, galleryPhotos, squadPosts, teamMessages } from "./schema";

export const registrationsRelations = relations(registrations, ({one, many}) => ({
	user: one(users, {
		fields: [registrations.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [registrations.eventId],
		references: [events.id]
	}),
	teamMessages: many(teamMessages),
}));

export const usersRelations = relations(users, ({many}) => ({
	registrations: many(registrations),
	galleryPhotos: many(galleryPhotos),
	squadPosts: many(squadPosts),
	teamMessages: many(teamMessages),
}));

export const eventsRelations = relations(events, ({many}) => ({
	registrations: many(registrations),
	squadPosts: many(squadPosts),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({one}) => ({
	user: one(users, {
		fields: [galleryPhotos.userId],
		references: [users.id]
	}),
}));

export const squadPostsRelations = relations(squadPosts, ({one}) => ({
	user: one(users, {
		fields: [squadPosts.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [squadPosts.eventId],
		references: [events.id]
	}),
}));

export const teamMessagesRelations = relations(teamMessages, ({one}) => ({
	registration: one(registrations, {
		fields: [teamMessages.registrationId],
		references: [registrations.id]
	}),
	user: one(users, {
		fields: [teamMessages.senderId],
		references: [users.id]
	}),
}));