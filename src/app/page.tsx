import React from 'react';
import { db } from '@/db';
import Hero from '@/components/marketing/Hero';
import EventsGrid from '@/components/marketing/EventsGrid';
import CTA from '@/components/marketing/CTA';
import OrganizersSection from '@/components/marketing/OrganizersSection';
import AboutSection from '@/components/marketing/AboutSection';
import PostCreditsCinematic from '@/components/marketing/DnaHorizonScene';

export default async function LandingPage() {
  let settings: any = null;
  let organizersList: any[] = [];

  try {
    const settingsDoc = await db.collection('systemSettings').doc('1').get();
    settings = settingsDoc.exists ? (settingsDoc.data() as any) : null;
  } catch (error) {
    console.warn('Failed to load system settings from Firestore during build:', error);
  }

  try {
    const organizersSnap = await db.collection('organizers').orderBy('sortOrder').get();
    organizersList = organizersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    console.warn('Failed to load organizers from Firestore during build:', error);
  }

  if (settings?.isSiteLocked) {
    return <PostCreditsCinematic organizers={organizersList} />;
  }

  const heroImage = settings?.heroImage ?? null;
  const aboutImage1 = settings?.aboutImage1 ?? '/images/Imageforhero01.jpg';
  const aboutImage2 = settings?.aboutImage2 ?? '/images/Imageforhero02.jpg';
  const aboutImage3 = settings?.aboutImage3 ?? '/images/Imageforhero03.jpg';

  return (
    <>
      <Hero heroImage={heroImage} />
      <AboutSection img1={aboutImage1} img2={aboutImage2} img3={aboutImage3} />
      <EventsGrid />
      <OrganizersSection />
      <CTA />
    </>
  );
}
