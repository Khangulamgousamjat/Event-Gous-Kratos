'use server';

import { db } from '@/db';
import { events as eventsTable, registrations, teamMembers, users } from '@/db/schema';
import { desc, eq, inArray, or } from 'drizzle-orm';
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

    const leaderMatches =
      phoneCandidates.length > 0
        ? await db
            .select({ id: users.id })
            .from(users)
            .where(inArray(users.phone, phoneCandidates))
        : [];

    const teamMatches =
      phoneCandidates.length > 0
        ? await db
            .select({ teamId: teamMembers.teamId })
            .from(teamMembers)
            .where(inArray(teamMembers.phone, phoneCandidates))
        : [];

    const leaderIds = leaderMatches.map((match) => match.id);
    const teamIds = teamMatches.map((match) => match.teamId);
    const filters = [];

    if (leaderIds.length > 0) {
      filters.push(inArray(registrations.userId, leaderIds));
    }

    if (teamIds.length > 0) {
      filters.push(inArray(registrations.teamId, teamIds));
    }

    if (normalizedTransactionId.length >= 5) {
      filters.push(
        inArray(registrations.transactionId, [trimmedQuery, normalizedTransactionId]),
      );
    }

    if (filters.length === 0) {
      return { error: 'No registrations found for this phone number or transaction ID.' };
    }

    const results = await db
      .select({
        createdAt: registrations.createdAt,
        eventName: eventsTable.name,
        regId: registrations.id,
        status: registrations.status,
        teamName: registrations.teamName,
        transactionId: registrations.transactionId,
      })
      .from(registrations)
      .leftJoin(eventsTable, eq(registrations.eventId, eventsTable.id))
      .where(filters.length === 1 ? filters[0] : or(...filters))
      .orderBy(desc(registrations.createdAt));

    if (results.length === 0) {
      return { error: 'No registrations found for this phone number or transaction ID.' };
    }

    return { results };
  } catch (error) {
    console.error('Status lookup error:', error);
    return { error: 'Failed to look up status. Please try again.' };
  }
}
