import React from 'react';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { requireStaffPageAccess } from '@/lib/authz';
import WalkInDeskForm from '@/components/admin/WalkInDeskForm';
import BrutalCard from '@/components/ui/BrutalCard';

export const dynamic = 'force-dynamic';

export default async function AdminDeskPage() {
  await requireStaffPageAccess();

  const allEvents = await db
    .select({
      id: events.id,
      name: events.name,
      format: events.format,
      teamSizeMin: events.teamSizeMin,
      teamSize: events.teamSize,
      fee: events.fee,
    })
    .from(events)
    .orderBy(desc(events.createdAt));

  const latestDeskEntries = await db
    .select({
      id: registrations.id,
      participantName: users.name,
      eventName: events.name,
      createdAt: registrations.createdAt,
      status: registrations.status,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id))
    .orderBy(desc(registrations.createdAt))
    .limit(8);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">On-Spot Entries</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Fast-track event-day registration terminal</p>
        </div>
        <Link href="/admin/registrations" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Staff Tools
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <WalkInDeskForm events={allEvents} />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <BrutalCard shadowColor="black" className="p-6">
            <h2 className="text-2xl font-black uppercase italic mb-4">Desk Workflow</h2>
            <div className="space-y-3 text-xs font-black uppercase tracking-wide">
              <p>1. Select the event.</p>
              <p>2. Capture name and phone.</p>
              <p>3. Add extra team members only when needed.</p>
              <p>4. Save and send the student straight to the event desk.</p>
            </div>
          </BrutalCard>

          <BrutalCard className="p-0 overflow-hidden" shadowColor="gold">
            <div className="p-4 border-b-2 border-on-surface bg-surface-container-low">
              <h2 className="text-xl font-black uppercase italic">Latest Desk Entries</h2>
            </div>
            <div className="divide-y-2 divide-on-surface/10">
              {latestDeskEntries.length === 0 ? (
                <div className="p-6 text-center text-xs font-black uppercase opacity-40">No desk entries yet</div>
              ) : (
                latestDeskEntries.map((entry) => (
                  <div key={entry.id} className="p-4">
                    <p className="font-black uppercase">{entry.participantName}</p>
                    <p className="text-[10px] font-black uppercase opacity-60">{entry.eventName}</p>
                    <p className="text-[10px] font-mono opacity-50">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
