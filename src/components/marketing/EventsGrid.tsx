import React from 'react';
import { db } from '@/db';
import EventsClientFilter from './EventsClientFilter';
import { isRegistrationKillSwitchEnabled } from '@/lib/env';
import { resolvePerParticipantFee } from '@/lib/registration';

const EventsGrid = async () => {
  let resolvedEvents: any[] = [];
  let settings: any = null;

  try {
    const eventsSnap = await db.collection('events').get();
    const dbEvents = eventsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
    
    // Sort in-memory: sortOrder desc, then createdAt desc
    dbEvents.sort((a: any, b: any) => {
      const sortOrderA = a.sortOrder || 0;
      const sortOrderB = b.sortOrder || 0;
      if (sortOrderA !== sortOrderB) {
        return sortOrderB - sortOrderA;
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    try {
      const settingsDoc = await db.collection('systemSettings').doc('1').get();
      settings = settingsDoc.exists ? (settingsDoc.data() as any) : null;
    } catch (err) {
      console.warn('Failed to load system settings from Firestore in EventsGrid:', err);
    }

    resolvedEvents = dbEvents.map((event: any) => ({
      ...event,
      fee: resolvePerParticipantFee(event.fee, settings?.feePerPerson),
    }));
  } catch (error) {
    console.warn('Failed to load events from Firestore in EventsGrid:', error);
  }

  const registrationOpen = settings?.registrationOpen ?? true;
  const deadline = settings?.deadline ?? null;
  const now = new Date();

  const isKilled = isRegistrationKillSwitchEnabled();
  let isRegistrationClosed = !!(!registrationOpen || (deadline && now > new Date(deadline)));

  if (isKilled) {
    isRegistrationClosed = true;
  }

  return (
    <section id="events" className="py-12 md:py-24 px-4 md:px-6 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
        <div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">Our Events</h2>
        </div>
        <p className="max-w-[300px] md:text-right font-sans italic opacity-70 text-sm leading-tight">
          Choose your event, register quickly, and plan your day with confidence.
        </p>
      </div>

      <div className="w-full brutal-border bg-[#FEFCE8] border-[#D4AF37] p-5 mb-16 shadow-[4px_4px_0px_0px_rgba(212,175,55,0.2)]">
        <p className="text-sm font-black uppercase text-on-surface tracking-tight">
          All events are open to students from all branches.
        </p>
      </div>

      {resolvedEvents.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-on-surface/20">
          <p className="text-xl font-display font-bold uppercase tracking-widest opacity-50">NO EVENTS AVAILABLE</p>
          <p className="text-sm font-sans mt-2 opacity-40">No events have been added yet. Check back soon!</p>
        </div>
      ) : (
        <EventsClientFilter allEvents={resolvedEvents} isRegistrationClosed={isRegistrationClosed} />
      )}
    </section>
  );
};

export default EventsGrid;
