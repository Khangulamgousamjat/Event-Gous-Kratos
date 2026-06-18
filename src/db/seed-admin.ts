import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@kratos.fest';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('SEED_ADMIN_PASSWORD is required before running seed-admin.');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existing = await db.select().from(users).where(eq(users.email, adminEmail));

  if (existing.length > 0) {
    console.log('Admin already exists.');
    return;
  }

  await db.insert(users).values({
    name: 'Kratos Administrator',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log(`Admin account created for ${adminEmail}.`);
}

seedAdmin().catch(console.error);
