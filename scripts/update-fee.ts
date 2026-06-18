import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';
import { eq, ne } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required in .env.local');
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function updateFee() {
  console.log('--- UPDATING REGISTRATION FEE TO 49 ---');

  // 1. Update System Settings (Global Fee)
  console.log('Updating global fee in system settings...');
  await db.update(schema.systemSettings)
    .set({
      feePerPerson: 49,
    })
    .where(eq(schema.systemSettings.id, 1));

  // 2. Update all events where fee is > 0
  console.log('Updating event-specific fees where current fee is greater than 0...');
  await db.update(schema.events)
    .set({
      fee: 49,
    })
    .where(ne(schema.events.fee, 0));
  
  console.log('Fee updated successfully in the database.');
  process.exit(0);
}

updateFee().catch((error) => {
  console.error('Update failed:', error);
  process.exit(1);
});
