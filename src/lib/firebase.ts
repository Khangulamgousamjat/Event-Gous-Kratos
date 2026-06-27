import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    app = initializeApp({ projectId: 'kratos-platform-dev' });
  } else {
    try {
      app = initializeApp();
    } catch (e) {
      // Fallback: Initialize with dummy ID so compiler/build does not fail
      app = initializeApp({
        projectId: 'kratos-dummy-project',
      });
    }
  }
} else {
  app = getApp();
}

export const db = getFirestore(app);
