import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ── Firebase Admin Init ────────────────────────────────────────────────
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = getFirestore();

// ── Config ─────────────────────────────────────────────────────────────
const ADMIN_NAME     = 'Gulamgous Khan';
const ADMIN_EMAIL    = 'gousk2004@gmail.com';
const ADMIN_PASSWORD = 'Kingkhan@12';

async function main() {
  console.log(`🚀 Seeding admin account: ${ADMIN_EMAIL} ...`);

  // 1. Check if user already exists
  const snap = await db.collection('users')
    .where('email', '==', ADMIN_EMAIL)
    .limit(1)
    .get();

  if (!snap.empty) {
    const docRef = snap.docs[0].ref;
    const data   = snap.docs[0].data();
    if (data.role === 'ADMIN') {
      console.log('✅ Admin account already exists. Nothing to do.');
    } else {
      await docRef.update({ role: 'ADMIN' });
      console.log('✅ Existing user upgraded to ADMIN role.');
    }
    return;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  // 3. Create the admin document in Firestore
  await db.collection('users').add({
    name:      ADMIN_NAME,
    email:     ADMIN_EMAIL,
    password:  hashedPassword,
    role:      'ADMIN',
    createdAt: new Date().toISOString(),
  });

  console.log('');
  console.log('✅ Admin account created successfully!');
  console.log('─────────────────────────────────────');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log(`   Role     : ADMIN`);
  console.log('─────────────────────────────────────');
  console.log('👉 Log in at  /auth/adminlogin');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
