'use client';

import React, { useMemo, useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { sendOperationalNotification } from '@/lib/actions';

type EventOption = {
  id: string;
  name: string;
};

type Props = {
  events: EventOption[];
  capabilities: {
    email: boolean;
    whatsapp: boolean;
  };
};

export default function NotificationBlastForm({ events, capabilities }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [audience, setAudience] = useState<'APPROVED' | 'ALL_USERS' | 'EVENT'>('APPROVED');

  const eventOptions = useMemo(() => [...events].sort((a, b) => a.name.localeCompare(b.name)), [events]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setResult(null);

    const response = await sendOperationalNotification(formData);

    if ('error' in response) {
      setResult(response.error || 'Failed to send notifications');
    } else {
      const summary = [
        `Email sent: ${response.emailSent}`,
        `WhatsApp sent: ${response.whatsappSent}`,
        `Failures: ${response.failureCount}`,
      ].join(' | ');
      setResult(summary);
    }

    setLoading(false);
  }

  return (
    <BrutalCard shadowColor="gold">
      <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-on-surface pb-2 flex items-center gap-2">
        <span className="material-symbols-outlined">notifications_active</span>
        Notifications
      </h3>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Audience</label>
            <select
              name="audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value as 'APPROVED' | 'ALL_USERS' | 'EVENT')}
              className="w-full px-4 py-3 brutal-border text-sm font-bold uppercase bg-surface outline-none focus:border-primary"
            >
              <option value="APPROVED">Approved Participants</option>
              <option value="ALL_USERS">All Participant Accounts</option>
              <option value="EVENT">Single Event Participants</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Subject</label>
            <input
              name="subject"
              type="text"
              defaultValue="KRATOS 2026 Update"
              className="w-full px-4 py-3 brutal-border text-sm font-bold bg-surface outline-none focus:border-primary"
            />
          </div>
        </div>

        {audience === 'EVENT' ? (
          <div>
            <label className="block text-[10px] font-black uppercase mb-1">Event</label>
            <select
              name="eventId"
              className="w-full px-4 py-3 brutal-border text-sm font-bold uppercase bg-surface outline-none focus:border-primary"
              required
            >
              <option value="">Select event</option>
              {eventOptions.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Message</label>
          <textarea
            name="message"
            rows={4}
            required
            placeholder="Kratos starts tomorrow at 10:30 AM. Report 20 minutes early with your entry pass."
            className="w-full px-4 py-3 brutal-border text-sm font-bold bg-surface outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-black uppercase">
          <label className={`flex items-center gap-3 brutal-border px-4 py-3 ${capabilities.email ? 'bg-surface' : 'bg-surface/60 opacity-60'}`}>
            <input type="checkbox" name="sendEmail" defaultChecked={capabilities.email} disabled={!capabilities.email} className="w-4 h-4 accent-primary" />
            Email {capabilities.email ? 'Enabled' : 'Not Configured'}
          </label>
          <label className={`flex items-center gap-3 brutal-border px-4 py-3 ${capabilities.whatsapp ? 'bg-surface' : 'bg-surface/60 opacity-60'}`}>
            <input type="checkbox" name="sendWhatsapp" defaultChecked={capabilities.whatsapp} disabled={!capabilities.whatsapp} className="w-4 h-4 accent-primary" />
            WhatsApp {capabilities.whatsapp ? 'Enabled' : 'Not Configured'}
          </label>
        </div>

        {result ? (
          <div className="p-3 border-2 border-on-surface bg-surface-container-low text-[10px] font-black uppercase tracking-wide">
            {result}
          </div>
        ) : null}

        <BrutalButton type="submit" className="w-full" size="sm" disabled={loading}>
          {loading ? 'SENDING...' : 'SEND ALERT'}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
