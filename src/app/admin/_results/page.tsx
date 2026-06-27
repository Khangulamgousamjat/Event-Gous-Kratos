import React from 'react';
import { db } from '@/db';
import ResultsSettingsForm from '@/components/admin/ResultsSettingsForm';
import WinnerEntryForm from '@/components/admin/WinnerEntryForm';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import { requireAdminPageAccess } from '@/lib/authz';

export default async function AdminResultsPage() {
  await requireAdminPageAccess();

  const settingsDoc = await db.collection('systemSettings').doc('1').get();
  const currentSettings = settingsDoc.exists ? (settingsDoc.data() as any) : { resultsRevealTime: null, resultsVideoUrl: null };

  const eventsSnap = await db.collection('events').get();
  const allEvents = eventsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
  
  // Sort in-memory: createdAt desc
  allEvents.sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Result Override</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Winner Distribution Subsystems</p>
        </div>
        <Link href="/admin/dashboard">
          <BrutalButton variant="outline" size="sm">&larr; Return to Core</BrutalButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8 space-y-8">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 border-b-4 border-on-surface pb-4">Module Winner Assignments</h2>
           <div className="space-y-12">
              {allEvents.map((evt: any) => (
                <WinnerEntryForm key={evt.id} eventId={evt.id} eventName={evt.name} currentWinners={evt.winners} />
              ))}
           </div>
        </div>

        <div className="col-span-1 lg:col-span-4 space-y-8 h-fit sticky top-32">
           <ResultsSettingsForm currentRevealTime={currentSettings.resultsRevealTime} currentVideoUrl={currentSettings.resultsVideoUrl} />
           
           <div className="bg-primary/10 border-2 border-primary p-6 italic">
              <p className="text-xs font-bold uppercase text-primary tracking-widest leading-loose">
                 <span className="material-symbols-outlined block text-3xl mb-2">warning</span>
                 The Global Reveal Timer strictly controls when the Leaderboard page unlocks for the general public. Make sure your Video Payload URL is accurately formatted as a YouTube embed link.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
