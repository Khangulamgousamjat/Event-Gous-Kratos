import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
const seedAdminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@kratos.fest';
const seedAdminPasswordEnv = process.env.SEED_ADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required before running the seed script.');
}

if (!seedAdminPasswordEnv) {
  throw new Error('SEED_ADMIN_PASSWORD is required before running the seed script.');
}

const seedAdminPassword = seedAdminPasswordEnv;

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Starting database reset...');

  console.log('Clearing dependent tables...');
  await db.delete(schema.teamMessages);
  await db.delete(schema.galleryPhotos);
  await db.delete(schema.squadPosts);
  await db.delete(schema.teamMembers);
  await db.delete(schema.teams);
  await db.delete(schema.registrations);
  await db.delete(schema.scheduleSlots);
  await db.delete(schema.organizers);
  await db.delete(schema.announcements);
  await db.delete(schema.liveViewers);
  await db.delete(schema.systemSettings);

  console.log('Clearing root tables...');
  await db.delete(schema.users);
  await db.delete(schema.events);

  console.log('Creating admin account...');
  const hashedPassword = await bcrypt.hash(seedAdminPassword, 10);

  await db.insert(schema.users).values({
    name: 'Kratos Administrator',
    email: seedAdminEmail,
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log('Applying system settings...');
  await db.insert(schema.systemSettings).values({
    id: 1,
    registrationOpen: true,
    isGalleryLocked: true,
    upiId: '9834147160@kotak811',
    feePerPerson: 49,
    deadline: new Date('2026-04-26T18:00:00Z'),
    resultsRevealTime: new Date('2026-04-22T13:00:00Z'),
    resultsVideoUrl: null,
  });

  console.log('Publishing default announcement...');
  await db.insert(schema.announcements).values({
    content: 'Registrations Open - KRATOS 2026 on 27-28 April | Register before evening of 26 April',
    isActive: true,
  });

  console.log('Seeding events...');
  const eventsData = [
    {
      name: 'Hackathon',
      slug: 'hackathon',
      category: 'Coding / Innovation',
      tagline: 'Build something impactful in just 3 hours',
      description: 'A fast-paced coding and innovation challenge where teams design and develop a solution to a given problem statement within 3 hours. Focus is on creativity, functionality, and real-world applicability.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 2,
      expectedParticipants: 60,
      venue: 'Computer Lab',
      schedule: 'Day 1 - 11:00 AM to 02:00 PM',
      prizeDetails: '1st: INR 5000 | 2nd: INR 3000 | 3rd: INR 2000',
    },
    {
      name: 'Tech Quiz',
      slug: 'tech-quiz',
      category: 'Knowledge / Quiz',
      tagline: 'Test your engineering IQ',
      description: 'A multi-round quiz competition covering core engineering concepts, technology trends, and logical reasoning.',
      fee: 49,
      format: 'SOLO_TEAM',
      isCommon: true,
      teamSize: 2,
      teamSizeMin: 1,
      expectedParticipants: 40,
      venue: 'Seminar Hall',
      schedule: 'Day 1 - Prelims 11:00 AM | Day 2 - Finals 02:00 PM',
      prizeDetails: '1st: INR 2500 | 2nd: INR 1000 | 3rd: INR 500',
    },
    {
      name: 'Tech Treasure Hunt',
      slug: 'tech-treasure-hunt',
      category: 'Puzzle / Adventure',
      tagline: 'Decode. Solve. Conquer.',
      description: 'A campus-wide technical treasure hunt where teams solve clues related to engineering and logic to reach the final destination. At least one girl member is mandatory per team.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 5,
      teamSizeMin: 3,
      expectedParticipants: 60,
      venue: 'Campus Area',
      schedule: 'Day 1 - 01:30 PM to 03:00 PM',
      prizeDetails: '1st: INR 2500 | 2nd: INR 1000 | 3rd: INR 500',
    },
    {
      name: 'Tech Poster Presentation',
      slug: 'tech-poster',
      category: 'Design / Research',
      tagline: 'Present your ideas visually',
      description: 'Teams present posters on emerging technologies, innovations, or engineering concepts and explain them to judges.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 20,
      venue: 'Seminar Hall',
      schedule: 'Day 1 - 04:00 PM to 05:00 PM',
      prizeDetails: '1st: INR 1500 | 2nd: INR 500 | 3rd: INR 500',
    },
    {
      name: 'Junkyard Innovation',
      slug: 'junkyard-innovation',
      category: 'Design / Build',
      tagline: 'Build innovation from waste',
      description: 'A hands-on challenge where teams create innovative models using scrap or low-cost materials. Focus is on creativity, usability, and engineering thinking.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 40,
      venue: 'Workshop / Open Area',
      schedule: 'Day 2 - 10:30 AM to 12:00 PM',
      prizeDetails: '1st: INR 3000 | 2nd: INR 1500 | 3rd: INR 500',
    },
    {
      name: 'Circuit Designing Competition',
      slug: 'circuit-design',
      category: 'Electronics',
      tagline: 'Design. Analyze. Solve.',
      description: 'Participants design and simulate electronic circuits based on given problem statements, testing their understanding of circuit logic and design.',
      fee: 49,
      format: 'SOLO',
      isCommon: true,
      teamSize: 1,
      teamSizeMin: 1,
      expectedParticipants: 20,
      venue: 'Electronics Lab',
      schedule: 'Day 1 - 12:00 PM to 01:00 PM',
      prizeDetails: '1st: INR 1500 | 2nd: INR 500 | 3rd: INR 500',
    },
    {
      name: 'Bridge Designing Competition',
      slug: 'bridge-design',
      category: 'Civil / Design',
      tagline: 'Build strength through design',
      description: 'Teams construct a bridge model using basic materials and test its load-bearing capacity.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 40,
      venue: 'Workshop Area',
      schedule: 'Day 2 - 10:30 AM to 12:00 PM',
      prizeDetails: '1st: INR 2000 | 2nd: INR 1500 | 3rd: INR 500',
    },
    {
      name: 'Hardware Project Competition',
      slug: 'hardware-project',
      category: 'Hardware / Innovation',
      tagline: 'Showcase real engineering',
      description: 'Participants present working hardware projects demonstrating practical engineering applications such as IoT, robotics, and embedded systems.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 40,
      venue: 'Project Gallery / Lab',
      schedule: 'Day 1 - Display 01:30 PM | Day 2 - Final Demo 12:00 PM',
      prizeDetails: '1st: INR 4000 | 2nd: INR 2500 | 3rd: INR 1500',
    },
    {
      name: 'Components Identifying Competition',
      slug: 'components-identifying',
      category: 'Electronics',
      tagline: 'Identify. Understand. Apply.',
      description: 'Participants identify electronic components and their functions within a time limit.',
      fee: 49,
      format: 'SOLO',
      isCommon: true,
      teamSize: 1,
      teamSizeMin: 1,
      expectedParticipants: 25,
      venue: 'Electronics Lab',
      schedule: 'Day 1 - 03:00 PM to 04:00 PM',
      prizeDetails: 'Prizes to be announced',
    },
    {
      name: 'E-Sports Tournament (BGMI)',
      slug: 'bgmi',
      category: 'Gaming',
      tagline: 'Strategy. Survival. Victory.',
      description: 'A competitive BGMI tournament where participants battle in a structured format emphasizing strategy and skill.',
      fee: 49,
      format: 'SOLO',
      isCommon: true,
      teamSize: 1,
      teamSizeMin: 1,
      expectedParticipants: 48,
      venue: 'Computer Lab',
      schedule: 'Day 1 - Qualifiers 04:00 PM | Day 2 - Finals 12:00 PM',
      prizeDetails: '1st: INR 2000 | 2nd: INR 1500 | 3rd: INR 500',
    },
    {
      name: 'Reel Competition',
      slug: 'reel-competition',
      category: 'Creative / Media',
      tagline: 'Create. Capture. Inspire.',
      description: 'Participants create short reels showcasing technical ideas, innovation, or college life. Online submission before Day 2, with judging and screening on Day 2.',
      fee: 0,
      format: 'SOLO_TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 20,
      venue: 'Online Submission + Auditorium Screening',
      schedule: 'Submission before Day 2 | Judging on Day 2 from 03:00 PM to 04:00 PM',
      prizeDetails: '1st: INR 1000 | 2nd: INR 500',
    },
    {
      name: 'Technical Rangoli',
      slug: 'technical-rangoli',
      category: 'Creative',
      tagline: 'Where Art Meets Engineering',
      description: 'Teams create rangoli designs based on technical themes such as circuits, AI, robotics, or engineering concepts, combining creativity with innovation.',
      fee: 49,
      format: 'TEAM',
      isCommon: true,
      teamSize: 4,
      teamSizeMin: 1,
      expectedParticipants: 30,
      venue: 'Corridor',
      schedule: null,
      prizeDetails: null,
    },
  ];

  await db.insert(schema.events).values(eventsData);

  console.log('Seeding schedule slots...');
  const day1Slots = [
    { day: 1, sortIndex: 1, timeSlot: '10:30 AM - 11:00 AM', venue: 'Auditorium', isBreak: false },
    { day: 1, sortIndex: 2, timeSlot: '11:00 AM - 01:00 PM', venue: 'Multiple Venues', isBreak: false },
    { day: 1, sortIndex: 3, timeSlot: '01:00 PM - 01:30 PM', venue: '-', isBreak: true },
    { day: 1, sortIndex: 4, timeSlot: '01:30 PM - 04:00 PM', venue: 'Multiple Venues', isBreak: false },
    { day: 1, sortIndex: 5, timeSlot: '04:00 PM - 05:30 PM', venue: 'Multiple Venues', isBreak: false },
  ];

  const day2Slots = [
    { day: 2, sortIndex: 1, timeSlot: '10:30 AM - 11:00 AM', venue: 'Main Campus', isBreak: false },
    { day: 2, sortIndex: 2, timeSlot: '11:00 AM - 01:00 PM', venue: 'Multiple Venues', isBreak: false },
    { day: 2, sortIndex: 3, timeSlot: '01:00 PM - 01:30 PM', venue: '-', isBreak: true },
    { day: 2, sortIndex: 4, timeSlot: '01:30 PM - 04:00 PM', venue: 'Auditorium', isBreak: false },
    { day: 2, sortIndex: 5, timeSlot: '04:00 PM - 05:30 PM', venue: 'Auditorium', isBreak: false },
  ];

  await db.insert(schema.scheduleSlots).values([...day1Slots, ...day2Slots]);

  console.log(`Database seeding complete. Admin created for ${seedAdminEmail}.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
