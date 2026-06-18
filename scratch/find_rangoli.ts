import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  // Check existing registrations for Technical Rangoli
  const regs = await db.select({
    id: schema.registrations.id,
    teamName: schema.registrations.teamName,
    members: schema.registrations.members,
    status: schema.registrations.status,
    teamId: schema.registrations.teamId,
  }).from(schema.registrations)
    .where(eq(schema.registrations.eventId, 'd18730a6-6414-4de8-9d69-15de6bd4ebb1'));
  
  console.log(`=== REGISTRATIONS FOR TECHNICAL RANGOLI (${regs.length} total) ===`);
  console.log(JSON.stringify(regs, null, 2));
}

main().catch(console.error);
