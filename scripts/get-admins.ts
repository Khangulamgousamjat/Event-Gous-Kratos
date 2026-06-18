import { db } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

async function execute() {
  try {
    const adminUsers = await db.select({ email: users.email }).from(users).where(eq(users.role, 'ADMIN'));
    console.log('--- ADMIN EMAILS ---');
    console.log(adminUsers);
    console.log('--------------------');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
execute();
