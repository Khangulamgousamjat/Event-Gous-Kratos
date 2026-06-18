'use client';

import React, { useMemo, useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { createWalkInRegistration } from '@/lib/actions';

type EventOption = {
  id: string;
  name: string;
  format: string | null;
  teamSizeMin: number | null;
  teamSize: number | null;
  fee: number;
};

export default function WalkInDeskForm({ events }: { events: EventOption[] }) {
  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.name.localeCompare(b.name)), [events]);
  const [selectedEventId, setSelectedEventId] = useState(sortedEvents[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedEvent = sortedEvents.find((event) => event.id === selectedEventId) ?? null;
  const isTeamCapable = (selectedEvent?.teamSize ?? 1) > 1 || selectedEvent?.format !== 'SOLO';

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await createWalkInRegistration(formData);

    if ('error' in result) {
      setMessage(result.error || 'Walk-in failed');
    } else {
      setMessage(`Walk-in registered: ${result.participantName}`);
    }

    setLoading(false);
  }

  return (
    <BrutalCard shadowColor="gold" className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Walk-In Desk</h1>
        <p className="text-xs font-black uppercase tracking-widest opacity-60">
          Quick registration for event-day desk entries
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Event</label>
            <select
              name="eventId"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold uppercase outline-none focus:border-primary"
            >
              {sortedEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Payment Mode</label>
            <select
              name="paymentMode"
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold uppercase outline-none focus:border-primary"
            >
              <option value={selectedEvent?.fee ? 'CASH' : 'FREE'}>{selectedEvent?.fee ? 'Cash at Desk' : 'Free Event'}</option>
              <option value="UPI">UPI Verified at Desk</option>
              <option value="WAIVED">Waived by Organizer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase mb-1">Participant Name</label>
            <input
              name="name"
              type="text"
              placeholder="Student name"
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="+91..."
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Email (Optional)</label>
            <input
              name="email"
              type="email"
              placeholder="student@email.com"
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">College</label>
            <input
              name="college"
              type="text"
              defaultValue="MPGI"
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Branch</label>
            <input
              name="branch"
              type="text"
              defaultValue="Desk Entry"
              className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
            />
          </div>
        </div>

        {isTeamCapable ? (
          <>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Team Name</label>
              <input
                name="teamName"
                type="text"
                placeholder="Optional team name"
                className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1">
                Additional Members
              </label>
              <textarea
                name="members"
                rows={4}
                placeholder="One member per line: Name | Phone"
                className="w-full px-4 py-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
              />
              <p className="mt-2 text-[10px] font-black uppercase opacity-50">
                Allowed size: {selectedEvent?.teamSizeMin ?? 1}-{selectedEvent?.teamSize ?? 1} participants
              </p>
            </div>
          </>
        ) : null}

        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Desk Notes</label>
          <textarea
            name="paymentNotes"
            rows={2}
            placeholder="Cash collected / on-spot approved / faculty waiver"
            className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold outline-none focus:border-primary"
          />
        </div>

        {message ? (
          <div className="p-3 border-2 border-on-surface bg-surface-container-low text-[10px] font-black uppercase tracking-wide">
            {message}
          </div>
        ) : null}

        <BrutalButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'REGISTERING...' : 'REGISTER WALK-IN'}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
