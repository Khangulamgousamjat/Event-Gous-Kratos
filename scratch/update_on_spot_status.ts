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
      and(
        eq(registrations.status, 'APPROVED'),
        or(
          ilike(registrations.transactionId, 'DESK-%'),
          ilike(registrations.paymentNotes, '%Desk registration%')
        )
      )
    );
  
  console.log(`Found ${onSpotRegistrations.length} APPROVED on-spot registrations to update.`);
  
  if (onSpotRegistrations.length > 0) {
    const idsToUpdate = onSpotRegistrations.map(r => r.id);
    console.log(`Updating IDs:`, idsToUpdate);
    
    // Perform update
    // Drizzle doesn't support 'inArray' update cleanly in all versions with returning, but we can do it like this:
    // Actually `inArray` is supported.
    const { inArray } = await import('drizzle-orm');
    
    const result = await db
        .update(registrations)
        .set({ status: 'PENDING' })
        .where(inArray(registrations.id, idsToUpdate))
        .returning({ id: registrations.id, status: registrations.status });
        
    console.log(`Successfully updated ${result.length} registrations to PENDING status.`);
  } else {
    console.log('No registrations to update.');
  }
}

main().catch(console.error);
