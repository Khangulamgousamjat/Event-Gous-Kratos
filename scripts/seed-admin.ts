import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@kratos.fest';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password === 'change-this-before-running-seed') {
    console.error('❌ Error: Please set a strong SEED_ADMIN_PASSWORD in your .env.local file first.');
    process.exit(1);
  }

  console.log(`🚀 Bootstrapping admin account: ${email}...`);

  // 1. Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (existingUser) {
    console.log(`⚠️ User with email ${email} already exists. Updating role to ADMIN...`);
    await db.update(schema.users)
      .set({ role: 'ADMIN' })
      .where(eq(schema.users.email, email));
    console.log('✅ Role updated successfully.');
    return;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create admin user
  await db.insert(schema.users).values({
    name: 'System Admin',
    email: email,
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log('✅ Admin account created successfully!');
  console.log('👉 You can now log in at /auth/adminlogin');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
