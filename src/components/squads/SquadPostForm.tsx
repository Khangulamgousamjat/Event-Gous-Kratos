'use client';

import React, { useState } from 'react';
import type { InferSelectModel } from 'drizzle-orm';
import { events } from '@/db/schema';
import BrutalButton from '@/components/ui/BrutalButton';
import { createSquadPost } from '@/lib/actions';

type EventRecord = InferSelectModel<typeof events>;

type SquadPostFormProps = {
  events: Pick<EventRecord, 'id' | 'name'>[];
};

export default function SquadPostForm({ events }: SquadPostFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createSquadPost(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form action={action} className="space-y-6">
      {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}
      
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Target Module</label>
        <select 
          name="eventId" 
          required 
          className="w-full brutal-border bg-surface px-4 py-2 font-display font-bold uppercase text-xs"
        >
          <option value="">SELECT MODULE</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
         <label className="block text-[10px] font-black uppercase tracking-widest opacity-60">Recruitment Bio</label>
         <textarea 
           name="bio" 
           required
           placeholder="e.g. Fullstack dev with React/Next.js skills. Looking for a serious hackathon squad."
           className="w-full brutal-border bg-surface p-4 font-sans text-sm min-h-[120px]"
         />
      </div>

      <BrutalButton type="submit" disabled={loading} className="w-full">
        {loading ? 'Transmitting...' : 'Broadcast Signal'}
      </BrutalButton>
    </form>
  );
}
