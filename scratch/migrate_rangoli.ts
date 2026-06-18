import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const RANGOLI_ID = 'd18730a6-6414-4de8-9d69-15de6bd4ebb1';

async function main() {
  console.log('Updating Technical Rangoli from SOLO -> TEAM...');

  const result = await db.update(schema.events)
    .set({
      format: 'TEAM',
      description: 'Teams create rangoli designs based on technical themes such as circuits, AI, robotics, or engineering concepts, combining creativity with innovation.',
    })
    .where(eq(schema.events.id, RANGOLI_ID))
    .returning({
      id: schema.events.id,
      name: schema.events.name,
      format: schema.events.format,
      teamSize: schema.events.teamSize,
      teamSizeMin: schema.events.teamSizeMin,
      description: schema.events.description,
    });

  console.log('Updated event:');
  console.log(JSON.stringify(result, null, 2));

  if (result.length === 0) {
    console.error('ERROR: No rows were updated! Event not found.');
    process.exit(1);
  }

  console.log('\nDone! Technical Rangoli is now a TEAM event.');
}

main().catch(console.error);
