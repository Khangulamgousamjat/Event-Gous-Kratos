'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalCard from '@/components/ui/BrutalCard';
import { bulkUpdateRegistrationStatus, bulkDeleteRegistrations } from '@/lib/actions';

type Registration = {
  amount: number | null;
  createdAt: Date | string | null;
  eventId: string;
  eventName: string;
  id: string;
  participantEmail: string;
  participantName: string;
  status: string | null;
  teamId: string | null;
  teamName: string | null;
  transactionId: string | null;
};

type TeamMember = {
  college: string | null;
  id: string;
  name: string;
  phone: string | null;
  teamId: string;
};

type Props = {
  canManageRegistrations?: boolean;
  registrations: Registration[];
  teamMembers: TeamMember[];
};

function formatDate(value: Date | string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function TrafficRegistryClient({
  registrations,
  teamMembers,
  canManageRegistrations = true,
}: Props) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'EVENTS' | 'TEAMS'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }
      return nextIds;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === registrations.length) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(registrations.map((registration) => registration.id)));
  };

  const handleBulkAction = async (status: 'APPROVED' | 'REJECTED' | 'DELETED') => {
    if (selectedIds.size === 0) {
      return;
    }

    const actionLabel = status === 'APPROVED' ? 'approve' : status === 'REJECTED' ? 'reject' : 'DELETE';
    if (!confirm(`Are you sure you want to ${actionLabel} ${selectedIds.size} registration(s)?`)) {
      return;
    }

    setIsUpdating(true);
    let result;
    
    if (status === 'DELETED') {
        result = await bulkDeleteRegistrations(Array.from(selectedIds));
    } else {
        result = await bulkUpdateRegistrationStatus(Array.from(selectedIds), status);
    }
    
    setIsUpdating(false);

    if ('error' in result) {
      alert(result.error);
      return;
    }

    alert(`Updated ${selectedIds.size} registration(s).`);
    setSelectedIds(new Set());
  };

  const eventsMap = new Map<string, { name: string; registrations: Registration[] }>();
  registrations.forEach((registration) => {
    const currentEvent = eventsMap.get(registration.eventId);
    if (currentEvent) {
      currentEvent.registrations.push(registration);
      return;
    }

    eventsMap.set(registration.eventId, {
      name: registration.eventName,
      registrations: [registration],
    });
  });

  const teamMembersByTeam = new Map<string, TeamMember[]>();
  teamMembers.forEach((member) => {
    const currentMembers = teamMembersByTeam.get(member.teamId) ?? [];
    currentMembers.push(member);
    teamMembersByTeam.set(member.teamId, currentMembers);
  });

  const teamsMap = new Map<
    string,
    { leader: Registration; members: TeamMember[]; name: string }
  >();

  registrations.forEach((registration) => {
    if (!registration.teamId) {
      return;
    }

    if (!teamsMap.has(registration.teamId)) {
      teamsMap.set(registration.teamId, {
        leader: registration,
        members: teamMembersByTeam.get(registration.teamId) ?? [],
        name: registration.teamName || 'Team',
      });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex border-4 border-on-surface bg-surface overflow-hidden">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm transition-all ${
            activeTab === 'ALL' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'
          }`}
        >
          All Registrations
        </button>
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm border-x-4 border-on-surface transition-all ${
            activeTab === 'EVENTS' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'
          }`}
        >
          By Event
        </button>
        <button
          onClick={() => setActiveTab('TEAMS')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm transition-all ${
            activeTab === 'TEAMS' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'
          }`}
        >
          Teams
        </button>
      </div>

      <BrutalCard className="p-0 overflow-hidden shadow-none" shadowColor="black">
        {activeTab === 'ALL' ? (
          <>
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">All Registrations: {registrations.length}</h2>
            </div>
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 w-10">
                      {canManageRegistrations ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.size === registrations.length && registrations.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4"
                        />
                      ) : null}
                    </th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {registrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className={`hover:bg-primary-container/10 transition-colors ${
                        selectedIds.has(registration.id) ? 'bg-primary-container/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        {canManageRegistrations ? (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(registration.id)}
                            onChange={() => toggleSelect(registration.id)}
                            className="w-4 h-4"
                          />
                        ) : null}
                      </td>
                      <td className="p-4 text-xs font-bold opacity-60 uppercase whitespace-nowrap">
                        {formatDate(registration.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold uppercase">{registration.participantName}</div>
                        <div className="text-[10px] opacity-60 truncate max-w-[220px]">{registration.participantEmail}</div>
                      </td>
                      <td className="p-4 font-black text-xs uppercase text-primary">{registration.eventName}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${
                            registration.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800 border-green-800'
                              : registration.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-800'
                                : 'bg-red-100 text-red-800 border-red-800'
                          }`}
                        >
                          {registration.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {canManageRegistrations ? (
                          <Link
                            href={`/admin/verify/${registration.id}`}
                            className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary"
                          >
                            Review
                          </Link>
                        ) : (
                          <span className="text-[10px] font-black uppercase opacity-40">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {activeTab === 'EVENTS' ? (
          <div className="divide-y-4 divide-on-surface">
            {Array.from(eventsMap.entries()).map(([eventId, eventData]) => (
              <details key={eventId} className="group">
                <summary className="p-6 bg-surface-container-low flex justify-between items-center cursor-pointer list-none hover:bg-primary-container/10 transition-all">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic group-open:text-primary">{eventData.name}</h3>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                      {eventData.registrations.length} registration(s)
                    </p>
                  </div>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="p-0 border-t-2 border-on-surface">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-surface-container-highest/30 border-b-2 border-on-surface text-[9px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="p-3">Participant</th>
                        <th className="p-3">Team</th>
                        <th className="p-3">Transaction ID</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-on-surface/10">
                      {eventData.registrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-primary-container/5">
                          <td className="p-3 font-bold uppercase">{registration.participantName}</td>
                          <td className="p-3 italic font-bold text-[10px]">
                            {registration.teamName || 'Individual'}
                          </td>
                          <td className="p-3 font-mono text-[10px] uppercase">
                            {registration.transactionId || 'Free Event'}
                          </td>
                          <td className="p-3 text-right">
                            {canManageRegistrations ? (
                              <Link
                                href={`/admin/verify/${registration.id}`}
                                className="underline font-black uppercase text-[9px]"
                              >
                                Open
                              </Link>
                            ) : (
                              <span className="text-[9px] font-black uppercase opacity-40 italic">Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        ) : null}

        {activeTab === 'TEAMS' ? (
          <div className="divide-y-4 divide-on-surface">
            {Array.from(teamsMap.entries()).map(([teamId, teamData]) => (
              <details key={teamId} className="group">
                <summary className="p-6 bg-surface-container-low flex justify-between items-center cursor-pointer list-none hover:bg-primary-container/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-on-surface text-surface w-10 h-10 flex items-center justify-center font-black rounded-sm group-open:bg-primary">
                      {teamData.members.length + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic group-open:text-primary leading-none">
                        {teamData.name}
                      </h3>
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
                        Event: {teamData.leader.eventName}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="p-6 bg-surface grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t-2 border-on-surface">
                  <div className="p-4 border-2 border-on-surface bg-primary-container/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-black uppercase bg-primary text-on-primary px-1 mb-2 inline-block">
                        Leader
                      </span>
                      <p className="font-black uppercase text-lg">{teamData.leader.participantName}</p>
                      <p className="text-[10px] font-mono opacity-60">{teamData.leader.participantEmail}</p>
                    </div>
                  </div>

                  {teamData.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 border-2 border-on-surface bg-surface-container-low flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[8px] font-black uppercase bg-surface-container-highest text-on-surface px-1 mb-2 inline-block">
                          Team Member
                        </span>
                        <p className="font-black uppercase text-lg">{member.name}</p>
                        <p className="text-[10px] font-mono opacity-60">{member.phone || 'No phone'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            {teamsMap.size === 0 ? (
              <div className="p-20 text-center opacity-30">
                <h2 className="text-4xl font-black uppercase tracking-widest italic">No Teams Found</h2>
              </div>
            ) : null}
          </div>
        ) : null}
      </BrutalCard>

      {canManageRegistrations && selectedIds.size > 0 ? (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <BrutalCard className="flex flex-col md:flex-row items-center gap-6 px-8 py-4 bg-on-surface text-surface" shadowColor="gold">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-black text-on-primary">
                {selectedIds.size}
              </div>
              <span className="font-black uppercase tracking-widest text-sm">Selected</span>
            </div>

            <div className="h-0.5 md:h-8 w-full md:w-0.5 bg-surface/20" />

            <div className="flex gap-4">
              <BrutalButton
                onClick={() => handleBulkAction('APPROVED')}
                disabled={isUpdating}
                variant="secondary"
                size="sm"
                className="bg-green-500 text-on-primary border-green-600 hover:bg-green-600 transition-colors"
              >
                Approve
              </BrutalButton>
              <BrutalButton
                onClick={() => handleBulkAction('REJECTED')}
                disabled={isUpdating}
                variant="secondary"
                size="sm"
                className="bg-red-500 text-on-primary border-red-600 hover:bg-red-600 transition-colors"
              >
                Reject
              </BrutalButton>
              <BrutalButton
                onClick={() => handleBulkAction('DELETED')}
                disabled={isUpdating}
                variant="secondary"
                size="sm"
                className="bg-black text-white border-black hover:bg-gray-800 transition-colors"
              >
                Delete
              </BrutalButton>
              <BrutalButton
                onClick={() => setSelectedIds(new Set())}
                disabled={isUpdating}
                variant="outline"
                size="sm"
                className="text-surface border-surface hover:bg-surface/10 transition-colors"
              >
                Clear
              </BrutalButton>
            </div>
          </BrutalCard>
        </div>
      ) : null}
    </div>
  );
}
