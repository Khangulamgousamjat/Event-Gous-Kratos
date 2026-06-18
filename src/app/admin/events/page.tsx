import React from 'react';
import { db } from '@/db';
import { events } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { requireAdminPageAccess } from '@/lib/authz';
import EventManagementClient from '@/components/admin/EventManagementClient';

export default async function EventManagementPage() {
  await requireAdminPageAccess();

  const allEvents = await db.select().from(events).orderBy(desc(events.sortOrder), desc(events.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="inline-block bg-primary-container px-3 py-1 brutal-border mb-4 font-display font-bold text-xs uppercase tracking-widest">
            Event Registry
          </span>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 italic">Control Center: Events</h1>
          <Link href="/admin/dashboard" className="font-display font-bold uppercase text-primary tracking-widest text-sm hover:underline flex items-center gap-2">
            &larr; Return to Dashboard
          </Link>
        </div>
        
        <div className="bg-black text-white px-4 py-2 brutal-border font-mono text-xs uppercase tracking-widest">
           System Status: <span className="text-green-400">Operational</span>
        </div>
      </div>

      <EventManagementClient initialEvents={allEvents} />
      
      <div className="mt-12 p-8 bg-primary-container/10 border-4 border-dashed border-on-surface/20 flex flex-col items-center justify-center text-center">
        <p className="font-display font-black uppercase text-xl mb-4 italic transition-colors">Total Registry Entries: {allEvents.length}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60 max-w-lg">
          Changes applied in this interface are immediate and will be reflected across the global event schedule and participant portals.
        </p>
      </div>
    </div>
  );
}
