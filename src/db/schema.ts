import { pgTable, text, timestamp, integer, boolean, pgEnum, uuid, json, index } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['PARTICIPANT', 'ADMIN', 'VOLUNTEER']);
export const registrationStatusEnum = pgEnum('registration_status', ['PENDING', 'APPROVED', 'REJECTED']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password'),
    college: text('college'),
    branch: text('branch'),
    year: integer('year'),
    phone: text('phone'),
    role: userRoleEnum('role').default('PARTICIPANT'),
    xp: integer('xp').default(0),
    level: integer('level').default(1),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    usersPhoneIdx: index('users_phone_idx').on(table.phone),
    usersRoleIdx: index('users_role_idx').on(table.role),
  }),
);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category'),
  tagline: text('tagline'),
  description: text('description'),
  fee: integer('fee').notNull(),
  schedule: text('schedule'),
  venue: text('venue'),
  format: text('format').default('SOLO'),
  isCommon: boolean('is_common').default(false),
  teamSize: integer('team_size').default(1),
  teamSizeMin: integer('team_size_min').default(1),
  expectedParticipants: integer('expected_participants'),
  prizeDetails: text('prize_details'),
  winners: json('winners'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const organizers = pgTable('organizers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizerName: text('organizer_name').notNull(),
  role: text('role'),
  contact: text('contact'),
  imageUrl: text('image_url'),
  description: text('description'),
  department: text('department'),
  linkedin: text('linkedin'),
  instagram: text('instagram'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Teams are persisted separately from registrations, so we can store members individually
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id').references(() => teams.id).notNull(),
    name: text('name').notNull(),
    college: text('college'),
    branch: text('branch'),
    year: integer('year'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    teamMembersTeamIdx: index('team_members_team_idx').on(table.teamId),
    teamMembersPhoneIdx: index('team_members_phone_idx').on(table.phone),
  }),
);

export const registrations = pgTable(
  'registrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    teamId: uuid('team_id').references(() => teams.id),
    teamName: text('team_name'),
    members: json('members'),
    paymentScreenshot: text('payment_screenshot'),
    transactionId: text('transaction_id'),
    paymentNotes: text('payment_notes'),
    status: registrationStatusEnum('status').default('PENDING'),
    totalFee: integer('total_fee'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    registrationsUserIdx: index('registrations_user_idx').on(table.userId),
    registrationsEventIdx: index('registrations_event_idx').on(table.eventId),
    registrationsStatusIdx: index('registrations_status_idx').on(table.status),
    registrationsTeamIdx: index('registrations_team_idx').on(table.teamId),
  }),
);

export const announcements = pgTable(
  'announcements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    isActive: boolean('is_active').default(true),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    announcementsActiveIdx: index('announcements_active_idx').on(table.isActive),
  }),
);

export const galleryPhotos = pgTable('gallery_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemSettings = pgTable('system_settings', {
  id: integer('id').primaryKey().default(1),
  isSiteLocked: boolean('is_site_locked').default(false).notNull(),
  isGalleryLocked: boolean('is_gallery_locked').default(true),
  resultsRevealTime: timestamp('results_reveal_time'),
  resultsVideoUrl: text('results_video_url'),
  registrationOpen: boolean('registration_open').default(true).notNull(),
  registrationPaused: boolean('registration_paused').default(false).notNull(),
  upiId: text('upi_id'),
  feePerPerson: integer('fee_per_person').default(0).notNull(),
  deadline: timestamp('deadline'),
  heroImage: text('hero_image'),
  aboutImage1: text('about_image_1'),
  aboutImage2: text('about_image_2'),
  aboutImage3: text('about_image_3'),
});

export const liveViewers = pgTable('live_viewers', {
  viewerId: text('viewer_id').primaryKey(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
});

export const squadPosts = pgTable('squad_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  bio: text('bio').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teamMessages = pgTable('team_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationId: uuid('registration_id').references(() => registrations.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const scheduleSlots = pgTable(
  'schedule_slots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    day: integer('day').notNull(), // 1 or 2
    sortIndex: integer('sort_index').notNull(),
    timeSlot: text('time_slot').notNull(),
    venue: text('venue'),
    linkedEventId: uuid('linked_event_id').references(() => events.id),
    isBreak: boolean('is_break').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    scheduleSlotsDaySortIdx: index('schedule_slots_day_sort_idx').on(table.day, table.sortIndex),
    scheduleSlotsEventIdx: index('schedule_slots_event_idx').on(table.linkedEventId),
  }),
);
