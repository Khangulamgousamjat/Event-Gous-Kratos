import React from 'react';
import { db } from '@/db';
import Link from 'next/link';
import TrafficRegistryClient from '@/components/admin/TrafficRegistryClient';
import { requireStaffPageAccess } from '@/lib/authz';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRegistrationsPage() {
  const session = await requireStaffPageAccess();

  const usersSnap = await db.collection('users').get();
  const usersMap: Record<string, any> = {};
  usersSnap.docs.forEach((doc: any) => {
    usersMap[doc.id] = doc.data();
  });

  const eventsSnap = await db.collection('events').get();
  const eventsMap: Record<string, any> = {};
  eventsSnap.docs.forEach((doc: any) => {
    eventsMap[doc.id] = doc.data();
  });

  const regsSnap = await db.collection('registrations').get();
  const regs = regsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

  // Sort in-memory: createdAt desc
  regs.sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const allRegistrations = regs.map((reg: any) => {
    const user = usersMap[reg.userId] || {};
    const event = eventsMap[reg.eventId] || {};
    return {
      id: reg.id,
      participantName: user.name || 'Unknown User',
      participantEmail: user.email || '',
      eventName: event.name || 'Unknown Event',
      eventId: reg.eventId,
      amount: reg.totalFee,
      status: reg.status,
      createdAt: reg.createdAt,
      transactionId: reg.transactionId,
      teamId: reg.teamId,
      teamName: reg.teamName,
    };
  });

  const teamMembersSnap = await db.collection('teamMembers').get();
  const allTeamMembers = teamMembersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

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
