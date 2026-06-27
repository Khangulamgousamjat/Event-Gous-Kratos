import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
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
    const snap = await db.collection('registrations').get();
    const regDocs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

    if (regDocs.length === 0) {
      return new NextResponse('No payment records found.', { status: 404 });
    }

    // Sort by createdAt descending
    regDocs.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const userIds = Array.from(new Set(regDocs.map((r: any) => r.userId).filter(Boolean)));
    const eventIds = Array.from(new Set(regDocs.map((r: any) => r.eventId).filter(Boolean)));

    const usersMap: Record<string, string> = {};
    const eventsMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const userSnaps = await Promise.all(
        userIds.map((id) => db.collection('users').doc(id).get())
      );
      userSnaps.forEach((snap: any) => {
        if (snap.exists) {
          usersMap[snap.id] = (snap.data() as any).name;
        }
      });
    }

    if (eventIds.length > 0) {
      const eventSnaps = await Promise.all(
        eventIds.map((id) => db.collection('events').doc(id).get())
      );
      eventSnaps.forEach((snap: any) => {
        if (snap.exists) {
          eventsMap[snap.id] = (snap.data() as any).name;
        }
      });
    }

    const csv = [
      ['Participant Name', 'Event Name', 'Status', 'Transaction ID', 'Payment Screenshot URL'].join(','),
      ...regDocs.map((proof: any) =>
        [
          toCsvCell(usersMap[proof.userId]),
          toCsvCell(eventsMap[proof.eventId]),
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
