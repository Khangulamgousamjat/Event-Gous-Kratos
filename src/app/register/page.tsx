import React from 'react';
import { db } from '@/db';
import { events as eventsTable, systemSettings } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import UnifiedRegistrationForm from './UnifiedRegistrationForm';
import { isRegistrationKillSwitchEnabled, getRegistrationKillSwitchMessage } from '@/lib/env';
import { resolvePerParticipantFee } from '@/lib/registration';
import AutoRefresh from './AutoRefresh';
import Link from 'next/link';

export default async function RegistrationPage(props: { searchParams: Promise<{ event?: string }> }) {
  const searchParams = await props.searchParams;
  const requestedEvent = searchParams.event?.trim() || '';

  const allEventsRawSorted = await db.select().from(eventsTable).orderBy(asc(eventsTable.sortOrder), asc(eventsTable.name));
  const allEventsRaw = [...allEventsRawSorted].reverse();
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));

  const allEvents = allEventsRaw.map((event) => ({
    ...event,
    fee: resolvePerParticipantFee(event.fee, settings?.feePerPerson),
  }));

  const preselectedEventId =
    allEvents.find((event) => event.id === requestedEvent || event.slug === requestedEvent)?.id ?? '';

  const registrationOpen = settings?.registrationOpen ?? true;
  const registrationPaused = settings?.registrationPaused ?? false;
  const deadline = settings?.deadline ?? null;
  const now = new Date();

  const isKilled = isRegistrationKillSwitchEnabled();
  const killMessage = getRegistrationKillSwitchMessage();
  let isRegistrationClosed = !registrationOpen || (deadline && now > deadline);

  if (isKilled) {
    isRegistrationClosed = true;
  }

  if (registrationPaused || isKilled) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <AutoRefresh intervalMs={30000} />
        <div className="bg-yellow-50 border-4 border-yellow-500 p-8 md:p-12 max-w-xl w-full brutal-shadow flex flex-col items-center">
          <svg className="w-16 h-16 text-yellow-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-yellow-900 mb-4">Registrations Paused</h1>
          <p className="text-base md:text-lg font-bold text-yellow-800 mb-8">
            {isKilled && killMessage ? killMessage : 'Registrations are temporarily closed due to technical maintenance.'}
          </p>
          <Link href="/" className="px-8 py-4 bg-yellow-500 text-yellow-950 font-black uppercase tracking-widest border-2 border-yellow-900 hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(113,63,18,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const upiId = settings?.upiId || '9834147160@kotak811';

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-on-surface italic mb-4">
          Register Fast
        </h1>
        <p className="text-base md:text-lg font-sans font-medium opacity-80 max-w-lg mx-auto">
          Complete the form below to confirm your spot in KRATOS 2026. Fast. Simple. Direct.
        </p>
      </header>

      {isRegistrationClosed ? (
        <div className="bg-surface-container-low brutal-border p-8 border-l-8 border-l-red-500 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Registrations Closed</h2>
          {isKilled ? (
            <p className="font-sans font-bold uppercase text-red-600 bg-red-100 p-4 border border-red-200 inline-block">
              {killMessage || 'Registrations are currently paused.'}
            </p>
          ) : (
            <p className="font-sans opacity-70 uppercase tracking-widest text-sm">
              Please contact the event organizers for further instructions or queries.
            </p>
          )}
        </div>
      ) : (
        <UnifiedRegistrationForm events={allEvents} initialEventId={preselectedEventId} upiId={upiId} />
      )}
    </div>
  );
}
