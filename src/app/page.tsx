import React from 'react';
import { db } from '@/db';
import { systemSettings, organizers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Hero from '@/components/marketing/Hero';
import EventsGrid from '@/components/marketing/EventsGrid';
import CTA from '@/components/marketing/CTA';
import OrganizersSection from '@/components/marketing/OrganizersSection';
import AboutSection from '@/components/marketing/AboutSection';
import PostCreditsCinematic from '@/components/marketing/DnaHorizonScene';

export default async function LandingPage() {
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const organizersList = await db.select().from(organizers).orderBy(organizers.sortOrder);
  
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
