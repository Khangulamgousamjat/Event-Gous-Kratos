import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import LogoutButton from '@/components/dashboard/LogoutButton';
import TicketCard from '@/components/dashboard/TicketCard';
import GalleryUploadClient from '@/components/dashboard/GalleryUploadClient';
import { getPlayerRank } from '@/lib/xp';
import { Zap } from 'lucide-react';
import { formatScheduleSummary, sortScheduleEntries, type ScheduleEntry } from '@/lib/schedule';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Fetch actual user data
  const userSnap = await db.collection('users').where('email', '==', session.user.email).limit(1).get();
  if (userSnap.empty) {
    redirect('/auth/login');
  }
  const dbUser = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() } as any;

  if (!dbUser.college || !dbUser.branch || !dbUser.phone) {
    redirect('/profile/complete');
  }

  // Fetch active registrations joined with event info
  const regsSnap = await db.collection('registrations').where('userId', '==', dbUser.id).get();
  const regs = regsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

  const eventIds = Array.from(new Set(regs.map((r: any) => r.eventId).filter(Boolean)));
  const eventsMap: Record<string, any> = {};
  if (eventIds.length > 0) {
    const eventSnaps = await Promise.all(
      eventIds.map((eid: any) => db.collection('events').doc(eid).get())
    );
    eventSnaps.forEach((snap: any) => {
      if (snap.exists) {
        eventsMap[snap.id] = snap.data();
      }
    });
  }

  const dbRegistrations = regs.map((reg: any) => {
    const event = eventsMap[reg.eventId] || {};
    return {
      id: reg.id,
      eventId: reg.eventId,
      status: reg.status,
      teamName: reg.teamName,
      teamId: reg.teamId,
      eventName: event.name || 'Unknown Event',
      eventSlug: event.slug || '',
      format: event.format || 'SOLO',
      schedule: event.schedule || '',
      venue: event.venue || '',
    };
  });

  // Fetch all team members for these registrations
  const teamIds = dbRegistrations.map((r: any) => r.teamId).filter((id: any) => !!id) as string[];
  
  const allTeamMembers: any[] = [];
  if (teamIds.length > 0) {
    const chunkSize = 30;
    for (let i = 0; i < teamIds.length; i += chunkSize) {
      const chunk = teamIds.slice(i, i + chunkSize);
      const membersSnap = await db.collection('teamMembers').where('teamId', 'in', chunk).get();
      membersSnap.docs.forEach((doc: any) => {
        allTeamMembers.push({ id: doc.id, ...doc.data() });
      });
    }
  }

  const structuredSlots: any[] = [];
  if (eventIds.length > 0) {
    const chunkSize = 30;
    for (let i = 0; i < eventIds.length; i += chunkSize) {
      const chunk = eventIds.slice(i, i + chunkSize);
      const slotsSnap = await db.collection('scheduleSlots').where('linkedEventId', 'in', chunk).get();
      slotsSnap.docs.forEach((doc: any) => {
        structuredSlots.push({ id: doc.id, ...doc.data() });
      });
    }
  }

  // Order structuredSlots by day asc, sortIndex asc in-memory
  structuredSlots.sort((a: any, b: any) => {
    if (a.day !== b.day) {
      return (a.day || 0) - (b.day || 0);
    }
    return (a.sortIndex || 0) - (b.sortIndex || 0);
  });

  const slotsByEventId = new Map<
    string,
    Array<{ day: number; sortIndex: number; timeSlot: string; venue: string | null }>
  >();

  for (const slot of structuredSlots) {
    if (!slot.linkedEventId) continue;
    const existingSlots = slotsByEventId.get(slot.linkedEventId) ?? [];
    existingSlots.push({
      day: slot.day,
      sortIndex: slot.sortIndex,
      timeSlot: slot.timeSlot,
      venue: slot.venue ?? null,
    });
    slotsByEventId.set(slot.linkedEventId, existingSlots);
  }

  const userSchedule = sortScheduleEntries(
    dbRegistrations.flatMap((registration: any): ScheduleEntry[] => {
      const eventSlots = slotsByEventId.get(registration.eventId) ?? [];

      if (eventSlots.length === 0) {
        return [
          {
            id: `${registration.id}-fallback`,
            eventName: registration.eventName as string,
            status: registration.status,
            venue: registration.venue,
            summary: registration.schedule || 'Schedule to be announced',
            day: null as number | null,
            sortIndex: null as number | null,
            timeSlot: null as string | null,
            isStructured: false,
          },
        ];
      }

      return eventSlots.map((slot: any) => ({
        id: `${registration.id}-${slot.day}-${slot.sortIndex}`,
        eventName: registration.eventName,
        status: registration.status,
        venue: slot.venue || registration.venue,
        summary: formatScheduleSummary(slot.day, slot.timeSlot, registration.schedule || 'Schedule to be announced'),
        day: slot.day,
        sortIndex: slot.sortIndex,
        timeSlot: slot.timeSlot,
        isStructured: true,
      }));
    }),
  );

  const settingsDoc = await db.collection('systemSettings').doc('1').get();
  const isGalleryLocked = settingsDoc.exists ? (settingsDoc.data() as any).isGalleryLocked ?? true : true;

  const photosSnap = await db.collection('galleryPhotos').where('userId', '==', dbUser.id).get();
  const userPhotos = photosSnap.docs.map((doc: any) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
    };
  });

  const rank = getPlayerRank(dbUser.xp || 0);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Dashboard</h1>
          <div className="flex items-center gap-3">
             <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Participant: {dbUser.name.toUpperCase()}</p>
             <div className="bg-on-surface text-surface px-2 py-0.5 text-[10px] font-black uppercase italic rounded-sm">
                LVL {rank.level}
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/profile/complete">
            <BrutalButton variant="outline" size="sm">Edit Profile</BrutalButton>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <BrutalCard className="h-fit" shadowColor="gold">
            <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2">Your Profile</h2>

            <div className="mb-8 p-4 bg-on-surface text-surface rounded-sm">
               <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                     <Zap className="w-4 h-4 text-primary-container fill-primary-container" />
                     <span className="text-[10px] font-black uppercase">Tech Progress</span>
                  </div>
                  <span className="text-[10px] font-mono tracking-tighter">LVL {rank.level}</span>
               </div>
               <div className="h-4 bg-surface/20 brutal-border p-0.5 overflow-hidden">
                  <div
                    className="h-full bg-primary-container transition-all duration-1000"
                    style={{ width: `${rank.progressPercent}%` }}
                  />
               </div>
               <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-bold opacity-60 uppercase">{rank.xpInLevel} XP</span>
                  <span className="text-[9px] font-bold opacity-60 uppercase">Next: {rank.xpToNextLevel} XP</span>
               </div>
            </div>

            <div className="space-y-4 font-sans">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Institute</p>
                <p className="font-bold">{dbUser.college || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Branch</p>
                <p className="font-bold">{dbUser.branch || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Participant ID</p>
                <p className="font-bold font-mono text-xs overflow-hidden text-ellipsis">{dbUser.id}</p>
              </div>
            </div>
          </BrutalCard>

        </div>

        {/* Registered Events */}
        <div className="lg:col-span-2 space-y-8">
          <BrutalCard>
            <div className="flex justify-between items-center mb-8 border-b-2 border-on-surface pb-4">
              <h2 className="text-2xl font-black uppercase italic">My Events</h2>
              <p className="text-xs font-bold uppercase opacity-60">{dbRegistrations.length} Active</p>
            </div>

            <div className="space-y-6">
              {dbRegistrations.map((reg: any) => (
                <TicketCard 
                  key={reg.id} 
                  reg={reg} 
                  userName={dbUser.name} 
                  college={dbUser.college} 
                  currentUserId={dbUser.id}
                  teamMembers={allTeamMembers.filter((m: any) => m.teamId === reg.teamId)}
                />
              ))}
              {dbRegistrations.length === 0 && (
                 <div className="text-center py-12 border-2 border-dashed border-on-surface/20">
                    <p className="font-display font-black tracking-widest uppercase opacity-40">NO EVENTS REGISTERED YET</p>
                 </div>
              )}
            </div>

            <div className="mt-8">
              <Link href="/events" className="block">
                <BrutalButton variant="outline" className="w-full">Browse More Events</BrutalButton>
              </Link>
            </div>
          </BrutalCard>

          {dbRegistrations.length > 0 && (
            <BrutalCard shadowColor="black" className="bg-on-surface text-surface">
              <div className="flex justify-between items-center mb-8 border-b border-surface/20 pb-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">My Schedule</h2>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Chronological Timeline</p>
              </div>
              <div className="space-y-4">
                {userSchedule.map((entry: any) => (
                    <div key={entry.id} className="flex gap-6 items-center p-4 border-2 border-surface/20 hover:border-primary-container transition-colors group">
                      <div className="w-24 shrink-0 text-center border-r-2 border-surface/20 pr-4">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">
                          {entry.day ? `Day ${entry.day}` : 'Schedule'}
                        </p>
                        <p className="font-mono text-xs font-bold">{entry.timeSlot || entry.summary}</p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black uppercase text-lg leading-none mb-1 group-hover:text-primary-container transition-colors">{entry.eventName}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{entry.summary}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">{entry.venue || 'Venue TBA'}</p>
                      </div>
                      <div className="hidden md:block">
                         <span className={`px-2 py-0.5 border text-[10px] font-black uppercase ${
                           entry.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                         }`}>
                           {entry.status}
                         </span>
                      </div>
                    </div>
                  ))}
                {userSchedule.length === 0 && (
                  <p className="text-center py-8 font-display font-bold uppercase opacity-40 text-xs tracking-widest">
                    REGISTER FOR EVENTS TO BUILD YOUR TIMELINE
                  </p>
                )}
              </div>
            </BrutalCard>
          )}

          {/* User Gallery Photos Module */}
          <GalleryUploadClient isLocked={isGalleryLocked} photos={userPhotos} />

          {/* Verification Status Notice */}
          <div className="p-6 border-2 border-on-surface bg-primary-container/10 italic">
            <p className="text-sm font-bold uppercase">
              Note: Payment verification usually takes 6-12 hours. Please wait while we process your registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
