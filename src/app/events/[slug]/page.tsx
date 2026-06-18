import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalCard from '@/components/ui/BrutalCard';

import { db } from '@/db';
import { events, systemSettings, scheduleSlots } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { isRegistrationKillSwitchEnabled } from '@/lib/env';
import { resolvePerParticipantFee } from '@/lib/registration';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [dbEvent] = await db.select().from(events).where(eq(events.slug, slug));
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));

  if (!dbEvent) {
    notFound();
  }

  const feePerPersonResolved = resolvePerParticipantFee(dbEvent.fee, settings?.feePerPerson);
  const deadline = settings?.deadline ?? null;
  const registrationOpen = settings?.registrationOpen ?? true;
  const isRegistrationClosed =
    isRegistrationKillSwitchEnabled() || !registrationOpen || (deadline ? new Date() > deadline : false);

  const scheduleForEvent = await db
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.linkedEventId, dbEvent.id))
    .orderBy(asc(scheduleSlots.day), asc(scheduleSlots.sortIndex));

  const scheduleText =
    scheduleForEvent.length > 0
      ? scheduleForEvent
          .map((slot) => `D${slot.day} ${slot.timeSlot}${slot.venue ? ` @ ${slot.venue}` : ''}`)
          .join(' | ')
      : dbEvent.schedule || 'TBA';

  const event = {
    name: dbEvent.name,
    tagline: dbEvent.tagline || 'Engineering the next infrastructure layer.',
    description: dbEvent.description || 'Event details coming soon...',
    rules: [
      `Team size allowed: ${dbEvent.teamSizeMin ?? 1}-${dbEvent.teamSize ?? 1} members.`,
      'Participants must bring their own hardware when the event rules require it.',
      'Submissions must be original unless the official rule sheet states otherwise.',
      'Judgment will be based on innovation, execution, and structural clarity.',
    ],
    fee: feePerPersonResolved > 0 ? `INR ${feePerPersonResolved} per person` : 'FREE',
    schedule: scheduleText,
    venue: dbEvent.venue || 'Venue TBA',
  };

  const deadlineText = deadline
    ? deadline.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Deadline not configured';

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <span className="text-sm font-display font-bold uppercase text-primary tracking-[0.2em] mb-4 block">Event Details // 01</span>
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight italic">
            {event.name}
          </h1>
          <p className="text-xl md:text-2xl font-sans italic border-l-8 border-primary-container pl-4 md:pl-6 mb-8 md:mb-12">
            {event.tagline}
          </p>

          <div className="prose prose-xl font-sans opacity-80 mb-16">
            <p>{event.description}</p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-on-surface w-fit">Rules &amp; Guidelines</h2>
              <ul className="space-y-4">
                {event.rules.map((rule, index) => (
                  <li key={rule} className="flex gap-4 items-start">
                    <span className="font-display font-black text-primary-container text-2xl" style={{ WebkitTextStroke: '1px #1A1C1C' }}>{index + 1}</span>
                    <p className="font-sans font-bold uppercase text-sm tracking-wide pt-1">{rule}</p>
                  </li>
                ))}
              </ul>

              {dbEvent.prizeDetails ? (
                <div className="mt-10">
                  <h3 className="text-2xl font-black uppercase italic mb-4 border-b-2 border-on-surface w-fit">Prize Details</h3>
                  <p className="font-sans font-bold uppercase text-sm opacity-80">{dbEvent.prizeDetails}</p>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        <div className="lg:col-span-4 h-fit sticky top-32">
          <BrutalCard shadowColor="gold" className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b-2 border-on-surface pb-2 gap-1 sm:gap-4">
                <span className="text-[10px] font-black uppercase opacity-60">Registration Fee</span>
                <span className="font-display font-black uppercase text-lg md:text-xl">{event.fee}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b-2 border-on-surface pb-2 gap-1 sm:gap-4">
                <span className="text-[10px] font-black uppercase opacity-60">Time &amp; Schedule</span>
                <span className="font-display font-black uppercase text-sm md:text-base">{event.schedule}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b-2 border-on-surface pb-2 gap-1 sm:gap-4">
                <span className="text-[10px] font-black uppercase opacity-60">Venue</span>
                <span className="font-display font-black uppercase text-sm md:text-base">{event.venue}</span>
              </div>
              {dbEvent.category ? (
                <div className="flex justify-between border-b-2 border-on-surface pb-2">
                  <span className="text-[10px] font-black uppercase opacity-60">Category</span>
                  <span className="font-display font-black uppercase">{dbEvent.category}</span>
                </div>
              ) : null}
              {dbEvent.expectedParticipants ? (
                <div className="flex justify-between border-b-2 border-on-surface pb-2">
                  <span className="text-[10px] font-black uppercase opacity-60">Expected Participants</span>
                  <span className="font-display font-black uppercase">{dbEvent.expectedParticipants}</span>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 pt-4">
              {isRegistrationClosed ? (
                <div className="w-full border-2 border-red-500 bg-red-50 text-red-700 font-black uppercase text-center py-4">
                  Registrations Closed
                </div>
              ) : (
                <Link href={`/events/${dbEvent.slug}/register`} className="block">
                  <BrutalButton className="w-full" size="lg">Register</BrutalButton>
                </Link>
              )}
              <Link href="/events" className="block">
                <BrutalButton className="w-full" variant="outline">Back to Events</BrutalButton>
              </Link>
            </div>

            <p className="text-[10px] font-sans italic text-center opacity-60 uppercase">
              Deadline for registration: {deadlineText}
            </p>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
