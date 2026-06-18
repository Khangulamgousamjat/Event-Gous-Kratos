import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  const rangoli = await db.select({
    name: schema.events.name,
    format: schema.events.format,
    teamSize: schema.events.teamSize,
    teamSizeMin: schema.events.teamSizeMin,
    description: schema.events.description,
  }).from(schema.events)
    .where(eq(schema.events.id, 'd18730a6-6414-4de8-9d69-15de6bd4ebb1'));
  
  console.log(JSON.stringify(rangoli[0], null, 2));
}

main().catch(console.error);
