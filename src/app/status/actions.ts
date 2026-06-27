'use server';

import { db } from '@/db';
import { Filter } from 'firebase-admin/firestore';
import { getPhoneCandidates, normalizePhone, normalizeTransactionId } from '@/lib/registration';

type StatusLookupResult =
  | {
      results: Array<{
        createdAt: Date | null;
        eventName: string | null;
        regId: string;
        status: string | null;
        teamName: string | null;
        transactionId: string | null;
      }>;
    }
  | { error: string };

export async function lookupStatus(query: string): Promise<StatusLookupResult> {
  const trimmedQuery = query.trim();
  const normalizedPhone = normalizePhone(trimmedQuery);
  const normalizedTransactionId = normalizeTransactionId(trimmedQuery);

  if (!trimmedQuery || (!normalizedPhone && normalizedTransactionId.length < 5)) {
    return { error: 'Please enter a valid phone number or transaction ID.' };
  }

  try {
    const phoneCandidates = getPhoneCandidates(trimmedQuery);

    let leaderIds: string[] = [];
    if (phoneCandidates.length > 0) {
      const usersSnap = await db.collection('users')
        .where('phone', 'in', phoneCandidates)
        .limit(10)
        .get();
      leaderIds = usersSnap.docs.map((doc: any) => doc.id);
    }

    let teamIds: string[] = [];
    if (phoneCandidates.length > 0) {
      const membersSnap = await db.collection('teamMembers')
        .where('phone', 'in', phoneCandidates)
        .limit(10)
        .get();
      teamIds = membersSnap.docs.map((doc: any) => doc.data().teamId).filter(Boolean);
    }

    const filters: Filter[] = [];

    if (leaderIds.length > 0) {
      filters.push(Filter.where('userId', 'in', leaderIds));
    }

    if (teamIds.length > 0) {
      filters.push(Filter.where('teamId', 'in', teamIds));
    }

    if (normalizedTransactionId.length >= 5) {
      filters.push(
        Filter.where('transactionId', 'in', [trimmedQuery, normalizedTransactionId]),
      );
    }

    if (filters.length === 0) {
      return { error: 'No registrations found for this phone number or transaction ID.' };
    }

    const queryFilter = filters.length === 1 ? filters[0] : Filter.or(...filters);
    const regSnap = await db.collection('registrations')
      .where(queryFilter)
      .get();

    const regDocs = regSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

    if (regDocs.length === 0) {
      return { error: 'No registrations found for this phone number or transaction ID.' };
    }

    // Sort by createdAt descending
    regDocs.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const eventIds = Array.from(new Set(regDocs.map((reg: any) => reg.eventId).filter(Boolean)));
    const eventsMap: Record<string, string> = {};

    if (eventIds.length > 0) {
      const eventSnaps = await Promise.all(
        eventIds.map((id) => db.collection('events').doc(id as string).get())
      );
      eventSnaps.forEach((snap: any) => {
        if (snap.exists) {
          eventsMap[snap.id] = (snap.data() as any).name;
        }
      });
    }

    const results = regDocs.map((reg: any) => ({
      createdAt: reg.createdAt ? new Date(reg.createdAt) : null,
      eventName: eventsMap[reg.eventId] || 'Unknown Event',
      regId: reg.id,
      status: reg.status,
      teamName: reg.teamName,
      transactionId: reg.transactionId,
    }));

    return { results };
  } catch (error) {
    console.error('Status lookup error:', error);
    return { error: 'Failed to look up status. Please try again.' };
  }
}
