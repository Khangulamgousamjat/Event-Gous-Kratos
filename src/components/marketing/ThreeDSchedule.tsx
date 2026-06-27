import React from 'react';
import { db } from '@/db';
import ThreeDScheduleClient from './ThreeDScheduleClient';

export const dynamic = 'force-dynamic';

export default async function ThreeDSchedule() {
  const slotDefs = [
    { sortIndex: 1, time: '10:30 AM - 11:00 AM', day1: 'Opening Ceremony', day2: 'Events Begin' },
    { sortIndex: 2, time: '11:00 AM - 01:00 PM', day1: 'Multiple events', day2: 'Multiple events' },
    { sortIndex: 3, time: '01:00 PM - 01:30 PM', day1: 'Lunch Break', day2: 'Lunch Break' },
    { sortIndex: 4, time: '01:30 PM - 04:00 PM', day1: 'Multiple events', day2: 'Final rounds and judging' },
    { sortIndex: 5, time: '04:00 PM - 05:30 PM', day1: 'Wrap-up and qualifiers', day2: 'Prize Distribution' },
  ];

  const slotsSnap = await db.collection('scheduleSlots').get();
  const rawSlots = slotsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

  const eventIds = Array.from(new Set(rawSlots.map((s: any) => s.linkedEventId).filter(Boolean)));
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

  const scheduleRows = rawSlots.map((slot: any) => {
    const event = eventsMap[slot.linkedEventId] || {};
    return {
      day: slot.day,
      sortIndex: slot.sortIndex,
      timeSlot: slot.timeSlot,
      venue: slot.venue,
      isBreak: slot.isBreak,
      linkedEventName: event.name || null,
    };
  });

  if (!scheduleRows || scheduleRows.length === 0) {
    return (
      <ThreeDScheduleClient
        scheduleData={slotDefs.map((slot: any) => ({
          time: slot.time,
          day1: slot.day1,
          day2: slot.day2,
          day1Venue: 'Auditorium',
          day2Venue: 'Main Campus',
          isBreak: slot.sortIndex === 3,
        }))}
      />
    );
  }

  const byKey = new Map<string, any>();
  for (const row of scheduleRows) {
    byKey.set(`${row.day}-${row.sortIndex}`, row);
  }

  const scheduleData = slotDefs.map((slot: any) => {
    const day1Row = byKey.get(`1-${slot.sortIndex}`);
    const day2Row = byKey.get(`2-${slot.sortIndex}`);
    const isBreak = slot.sortIndex === 3;

    return {
      time: day1Row?.timeSlot || day2Row?.timeSlot || slot.time,
      day1: isBreak ? 'Lunch Break' : day1Row?.linkedEventName || slot.day1,
      day2: isBreak ? 'Lunch Break' : day2Row?.linkedEventName || slot.day2,
      day1Venue: day1Row?.venue ?? null,
      day2Venue: day2Row?.venue ?? null,
      isBreak,
    };
  });

  return <ThreeDScheduleClient scheduleData={scheduleData} />;
}
