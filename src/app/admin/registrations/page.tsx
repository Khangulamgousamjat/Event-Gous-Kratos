import React from 'react';
import { db } from '@/db';
import { registrations, users, events, teamMembers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import TrafficRegistryClient from '@/components/admin/TrafficRegistryClient';
import { requireStaffPageAccess } from '@/lib/authz';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRegistrationsPage() {
  const session = await requireStaffPageAccess();

  const allRegistrations = await db.select({
    id: registrations.id,
    participantName: users.name,
    participantEmail: users.email,
    eventName: events.name,
    eventId: registrations.eventId,
    amount: registrations.totalFee,
    status: registrations.status,
    createdAt: registrations.createdAt,
    transactionId: registrations.transactionId,
    teamId: registrations.teamId,
    teamName: registrations.teamName,
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .orderBy(desc(registrations.createdAt));

  const allTeamMembers = await db.select().from(teamMembers);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Registrations</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Review submissions, screenshots, and status updates</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Admin Panel
        </Link>
      </div>

      <TrafficRegistryClient
        registrations={allRegistrations}
        teamMembers={allTeamMembers}
        canManageRegistrations={session.user.role === 'ADMIN'}
      />
    </div>
  );
}
