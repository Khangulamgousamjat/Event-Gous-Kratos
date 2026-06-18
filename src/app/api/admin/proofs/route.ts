import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { isStaffRole } from '@/lib/authz';

function toCsvCell(value: string | null | undefined) {
  return `"${(value ?? '').replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!isStaffRole(session.user.role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const proofs = await db
      .select({
        eventName: events.name,
        participantName: users.name,
        paymentScreenshot: registrations.paymentScreenshot,
        status: registrations.status,
        transactionId: registrations.transactionId,
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id))
      .innerJoin(events, eq(registrations.eventId, events.id))
      .orderBy(desc(registrations.createdAt));

    if (proofs.length === 0) {
      return new NextResponse('No payment records found.', { status: 404 });
    }

    const csv = [
      ['Participant Name', 'Event Name', 'Status', 'Transaction ID', 'Payment Screenshot URL'].join(','),
      ...proofs.map((proof) =>
        [
          toCsvCell(proof.participantName),
          toCsvCell(proof.eventName),
          toCsvCell(proof.status),
          toCsvCell(proof.transactionId),
          toCsvCell(proof.paymentScreenshot),
        ].join(','),
      ),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="kratos_payment_proofs.csv"',
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Proof export error:', error);
    return new NextResponse('Export failed.', { status: 500 });
  }
}
