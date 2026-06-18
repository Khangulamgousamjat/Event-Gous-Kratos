import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import bcrypt from 'bcryptjs';

async function execute() {
  try {
    const email = 'testadmin@kratos.com';
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    await db.insert(users).values({
      name: 'Test Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      college: 'Kratos HQ',
      branch: 'Admin',
      phone: '1234567890'
    }).onConflictDoUpdate({
      target: users.email,
      set: { password: hashedPassword, role: 'ADMIN' }
    });
    console.log('Created admin testadmin@kratos.com / password123');
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
execute();
