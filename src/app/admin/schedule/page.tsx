import React from 'react';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { events, scheduleSlots } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { updateScheduleSlots } from '@/lib/actions';
import { requireAdminPageAccess } from '@/lib/authz';

export const dynamic = 'force-dynamic';

export default async function AdminSchedulePage() {
  await requireAdminPageAccess();

  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  const existingSlots = await db.select().from(scheduleSlots);

  const slotDefs = [
    { sortIndex: 1, timeSlot: '10:30 AM - 11:00 AM' },
    { sortIndex: 2, timeSlot: '11:00 AM - 01:00 PM' },
    { sortIndex: 3, timeSlot: '01:00 PM - 01:30 PM' },
    { sortIndex: 4, timeSlot: '01:30 PM - 04:00 PM' },
    { sortIndex: 5, timeSlot: '04:00 PM - 05:30 PM' },
  ];

  const slotByDayAndIndex = new Map<string, (typeof existingSlots)[number]>();
  for (const slot of existingSlots) {
    slotByDayAndIndex.set(`${slot.day}-${slot.sortIndex}`, slot);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Schedule System</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Day 1 / Day 2 time slots + venue + linked event</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <BrutalCard shadowColor="black" className="p-8">
        <form action={updateScheduleSlots} className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4 w-1/5">Time Slot</th>
                  <th className="p-4 w-2/5">Day 1</th>
                  <th className="p-4 w-2/5">Day 2</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-surface/10">
                {slotDefs.map((slot) => {
                  const isBreak = slot.sortIndex === 3;
                  const day1Existing = slotByDayAndIndex.get(`1-${slot.sortIndex}`);
                  const day2Existing = slotByDayAndIndex.get(`2-${slot.sortIndex}`);

                  return (
                    <tr key={slot.sortIndex} className="hover:bg-primary-container/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold uppercase text-sm">{slot.timeSlot}</div>
                        <div className="text-[10px] opacity-60 uppercase font-mono">{isBreak ? 'Break slot' : 'Active slot'}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Linked Event</label>
                            <select
                              name={`day1_event_${slot.sortIndex}`}
                              defaultValue={day1Existing?.linkedEventId ?? ''}
                              disabled={isBreak}
                              className="w-full p-2 brutal-border bg-surface text-xs font-bold uppercase outline-none focus:border-primary"
                            >
                              <option value="">- Unassigned -</option>
                              {allEvents.map((event) => (
                                <option key={event.id} value={event.id}>
                                  {event.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Venue</label>
                            <input
                              type="text"
                              name={`day1_venue_${slot.sortIndex}`}
                              defaultValue={day1Existing?.venue ?? ''}
                              placeholder="e.g. Auditorium"
                              className="w-full p-2 brutal-border bg-surface text-xs font-mono font-bold uppercase outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Linked Event</label>
                            <select
                              name={`day2_event_${slot.sortIndex}`}
                              defaultValue={day2Existing?.linkedEventId ?? ''}
                              disabled={isBreak}
                              className="w-full p-2 brutal-border bg-surface text-xs font-bold uppercase outline-none focus:border-primary"
                            >
                              <option value="">- Unassigned -</option>
                              {allEvents.map((event) => (
                                <option key={event.id} value={event.id}>
                                  {event.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Venue</label>
                            <input
                              type="text"
                              name={`day2_venue_${slot.sortIndex}`}
                              defaultValue={day2Existing?.venue ?? ''}
                              placeholder="e.g. Auditorium"
                              className="w-full p-2 brutal-border bg-surface text-xs font-mono font-bold uppercase outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t-2 border-on-surface flex justify-end">
            <BrutalButton type="submit" size="lg">
              BROADCAST STRUCTURED SCHEDULE
            </BrutalButton>
          </div>
        </form>
      </BrutalCard>
    </div>
  );
}
