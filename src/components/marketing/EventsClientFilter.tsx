'use client';

import React, { Suspense } from 'react';
import type { InferSelectModel } from 'drizzle-orm';
import Link from 'next/link';
import { events } from '@/db/schema';

type EventRecord = InferSelectModel<typeof events>;
type EventCardRecord = Pick<EventRecord, 'id' | 'name' | 'description' | 'tagline' | 'slug' | 'fee' | 'format' | 'teamSize' | 'teamSizeMin'>;

const getFormatLabel = (format: string | null) => {
  switch (format) {
    case 'TEAM':
      return 'TEAM FORMAT';
    case 'SOLO_TEAM':
      return 'SOLO/TEAM FORMAT';
    case 'SOLO_PAIR':
      return 'SOLO/PAIR FORMAT';
    case 'SOLO_TEAM_ASSIGNED':
      return 'SOLO (TEAM ASSIGNED)';
    case 'SOLO':
    default:
      return 'SOLO FORMAT';
  }
};

function FilterContent({ allEvents, isRegistrationClosed }: { allEvents: EventCardRecord[], isRegistrationClosed: boolean }) {
  if (!allEvents || allEvents.length === 0) {
    return (
      <div className="font-display font-bold uppercase text-on-surface opacity-50 tracking-widest text-center py-20">
        NO EVENTS AVAILABLE
      </div>
    );
  }

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 brutal-border overflow-hidden">
        {allEvents.map((event) => (
          <div key={event.id} className="p-5 md:p-8 border-b-2 border-r-2 last:border-b-0 md:last:border-b-2 lg:[&:nth-child(3n)]:border-r-0 border-on-surface flex flex-col justify-between hover:bg-primary-container transition-colors group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                  local_activity
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest border-2 border-on-surface px-2 py-1">
                    {getFormatLabel(event.format)}
                  </span>
                  {(event.format === 'TEAM' || event.format === 'SOLO_TEAM' || event.format === 'SOLO_PAIR') && (
                    <span className="text-[9px] font-bold uppercase opacity-70">
                      Team Size: {event.teamSizeMin || 1}-{event.teamSize || 1}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-3 md:mb-4 leading-none">{event.name}</h3>
              <p className="mb-4 md:mb-8 opacity-70 font-sans text-sm md:text-base group-hover:text-on-primary-container">
                {event.description || event.tagline || 'Event details coming soon...'}
              </p>
              <div className="flex gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-on-surface text-surface px-2 py-0.5">
                  Min: {event.teamSizeMin || 1}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-on-surface text-surface px-2 py-0.5">
                  Max: {event.teamSize || 1}
                </span>
              </div>
            </div>
            {isRegistrationClosed ? (
              <span className="font-display font-bold uppercase border-b-2 border-red-500 w-fit text-red-500 block mt-4 md:mt-8 text-sm md:text-base opacity-70">
                Registrations Closed
              </span>
            ) : (
              <Link
                href={`/register?event=${event.id}`}
                className="font-display font-bold uppercase border-b-2 border-on-surface w-fit hover:border-primary transition-colors block mt-4 md:mt-8 text-sm md:text-base"
              >
                {event.fee > 0 ? `Register [INR ${event.fee}]` : 'Register'}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventsClientFilter({ allEvents, isRegistrationClosed }: { allEvents: EventCardRecord[], isRegistrationClosed: boolean }) {
  return (
    <Suspense fallback={<div className="font-display font-bold uppercase text-primary tracking-widest">LOADING EVENTS...</div>}>
      <FilterContent allEvents={allEvents} isRegistrationClosed={isRegistrationClosed} />
    </Suspense>
  );
}
