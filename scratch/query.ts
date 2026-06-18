import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '../src/db';
import { systemSettings } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const res = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
