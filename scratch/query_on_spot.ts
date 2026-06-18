import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '../src/db';
import { registrations } from '../src/db/schema';
import { ilike, eq, or, and } from 'drizzle-orm';

async function main() {
  const onSpotRegistrations = await db
    .select()
    .from(registrations)
    .where(
      or(
        ilike(registrations.transactionId, 'DESK-%'),
        ilike(registrations.paymentNotes, '%Desk registration%')
      )
    );
  
  console.log(`Found ${onSpotRegistrations.length} on-spot registrations.`);
  
  const pendingRegistrations = onSpotRegistrations.filter(r => r.status === 'PENDING');
  const approvedRegistrations = onSpotRegistrations.filter(r => r.status === 'APPROVED');
  const rejectedRegistrations = onSpotRegistrations.filter(r => r.status === 'REJECTED');
  
  console.log(`PENDING: ${pendingRegistrations.length}`);
  console.log(`APPROVED: ${approvedRegistrations.length}`);
  console.log(`REJECTED: ${rejectedRegistrations.length}`);
  
  if (onSpotRegistrations.length > 0) {
      console.log('Sample registration:', onSpotRegistrations[0]);
  }
}

main().catch(console.error);
