'use client';

import React, { useTransition } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalCard from '@/components/ui/BrutalCard';
import { updateResultsSettings } from '@/lib/actions';

export default function ResultsSettingsForm({ currentRevealTime, currentVideoUrl }: { currentRevealTime: Date | null, currentVideoUrl: string | null }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateResultsSettings(formData);
    });
  };

  // Convert DB Date to datetime-local friendly string formatting: "YYYY-MM-DDThh:mm"
  const defaultDateStr = currentRevealTime 
    ? new Date(currentRevealTime.getTime() - currentRevealTime.getTimezoneOffset() * 60000).toISOString().slice(0,16)
    : '';

  return (
    <BrutalCard shadow={true}>
      <h3 className="text-2xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2">Global Reveal Configuration</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Chronological Unlock Target (Local Time)</label>
          <input 
            type="datetime-local" 
            name="revealTime" 
            defaultValue={defaultDateStr}
            className="w-full bg-surface-container-low border-2 border-on-surface p-4 font-sans font-bold uppercase outline-none focus:border-primary disabled:opacity-50"
          />
          <p className="text-[10px] mt-2 opacity-60 uppercase font-bold">Leaving this blank keeps the Leaderboard permanently locked.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest opacity-80 mb-2">YouTube Video Payload URL</label>
          <input 
            type="url" 
            name="videoUrl" 
            placeholder="https://www.youtube.com/embed/..." 
            defaultValue={currentVideoUrl || ''}
            className="w-full bg-surface-container-low border-2 border-on-surface p-4 font-sans uppercase outline-none focus:border-primary disabled:opacity-50"
          />
          <p className="text-[10px] mt-2 text-primary uppercase font-bold tracking-widest">Ensure you use the /embed/ link from YouTube.</p>
        </div>

        <BrutalButton type="submit" disabled={isPending} className="w-full justify-center">
          {isPending ? "SYNCHRONIZING..." : "LOCK IN MASTER SETTINGS"}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
