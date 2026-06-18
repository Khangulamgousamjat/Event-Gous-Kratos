import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';
import { eq, desc } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required in .env.local');
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function updateLiveDates() {
  console.log('--- SAFELY UPDATING LIVE DATES ---');

  // 1. Update System Settings (Deadline)
  console.log('Updating registration deadline...');
  await db.update(schema.systemSettings)
    .set({
      deadline: new Date('2026-04-26T18:00:00Z'),
    })
    .where(eq(schema.systemSettings.id, 1));

  // 2. Update Active Announcement
  console.log('Updating active announcement...');
  const newText = '🚀 Registrations Open — KRATOS 2026 on 27–28 April | Register before evening of 26 April';
  
  // Deactivate old announcements and insert/update the most recent one
  await db.insert(schema.announcements).values({
    content: newText,
    isActive: true,
  });
  
  console.log('Live dates updated successfully in the database.');
  process.exit(0);
}

updateLiveDates().catch((error) => {
  console.error('Update failed:', error);
  process.exit(1);
});
