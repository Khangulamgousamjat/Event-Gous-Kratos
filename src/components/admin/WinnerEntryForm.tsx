'use client';

import React, { useState, useTransition } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import { updateEventWinners } from '@/lib/actions';

export default function WinnerEntryForm({ eventId, eventName, currentWinners }: { eventId: string, eventName: string, currentWinners: unknown }) {
  const [isPending, startTransition] = useTransition();

  const defaultWinners = Array.isArray(currentWinners) ? currentWinners : [
    { place: 1, name: '', college: '' },
    { place: 2, name: '', college: '' },
    { place: 3, name: '', college: '' }
  ];

  const [winners, setWinners] = useState(defaultWinners);

  const handleSave = () => {
    startTransition(async () => {
      await updateEventWinners(eventId, winners);
    });
  };

  const updateWinner = (index: number, field: string, value: string) => {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  };

  return (
    <div className="border-4 border-on-surface bg-main p-6 shadow-[6px_6px_0px_0px_#000]">
      <h4 className="font-display font-black uppercase text-xl mb-4 italic tracking-widest text-primary border-b-2 border-on-surface pb-2">
        {eventName}
      </h4>
      
      <div className="space-y-4 mb-6">
        {winners.map((win: { place: number; name: string; college: string }, idx: number) => (
          <div key={idx} className="flex flex-col md:flex-row gap-4 items-center bg-surface-container-low border-2 border-on-surface p-3">
            <span className="font-display font-black text-2xl px-4 text-primary">0{win.place}</span>
            <input 
              type="text" 
              placeholder="OPERATIVE NAME" 
              value={win.name}
              onChange={(e) => updateWinner(idx, 'name', e.target.value)}
              className="w-full bg-surface border-2 border-on-surface p-2 font-display uppercase text-sm font-bold outline-none focus:border-primary"
            />
            <input 
              type="text" 
              placeholder="INSTITUTE" 
              value={win.college}
              onChange={(e) => updateWinner(idx, 'college', e.target.value)}
              className="w-full bg-surface border-2 border-on-surface p-2 font-sans font-medium text-xs uppercase outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>

      <BrutalButton onClick={handleSave} disabled={isPending} size="sm" className="w-full justify-center">
        {isPending ? "INJECTING..." : "SAVE WINNER DISTRIBUTION"}
      </BrutalButton>
    </div>
  );
}
