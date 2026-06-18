import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { events } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found. Make sure .env.local exists.');
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function main() {
  // First, check current state
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, 'tech-poster'));

  if (!event) {
    console.error('Tech Poster Presentation event not found!');
    process.exit(1);
  }

  console.log('BEFORE update:');
  console.log(`  Name: ${event.name}`);
  console.log(`  Format: ${event.format}`);
  console.log(`  TeamSize: ${event.teamSize}`);
  console.log(`  TeamSizeMin: ${event.teamSizeMin}`);

  // Update: SOLO_TEAM -> TEAM (team event, 1 to 4 members)
  await db
    .update(events)
    .set({
      format: 'TEAM',
      teamSize: 4,
      teamSizeMin: 1,
      description:
        'Teams present posters on emerging technologies, innovations, or engineering concepts and explain them to judges.',
    })
    .where(eq(events.slug, 'tech-poster'));

  // Verify
  const [updated] = await db
    .select()
    .from(events)
    .where(eq(events.slug, 'tech-poster'));

  console.log('\nAFTER update:');
  console.log(`  Name: ${updated.name}`);
  console.log(`  Format: ${updated.format}`);
  console.log(`  TeamSize: ${updated.teamSize}`);
  console.log(`  TeamSizeMin: ${updated.teamSizeMin}`);
  console.log('\n✅ Tech Poster Presentation updated to TEAM format (1-4 members)');
}

main().catch(console.error);
