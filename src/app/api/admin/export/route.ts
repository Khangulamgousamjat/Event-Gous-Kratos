import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { isStaffRole } from '@/lib/authz';

function toCsvCell(value: string | number | null | undefined) {
  const resolved = value == null ? '' : String(value);
  return `"${resolved.replace(/"/g, '""')}"`;
}

function buildCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  return [headers.join(','), ...rows.map((row) => row.map(toCsvCell).join(','))].join('\n');
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!isStaffRole(session.user.role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dataset = searchParams.get('dataset') || 'participants';

    if (dataset === 'users') {
      const snap = await db.collection('users').get();
      const allUsers = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

      if (allUsers.length === 0) {
        return new NextResponse('No users found.', { status: 404 });
      }

      // Sort by createdAt descending
      allUsers.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      const csv = buildCsv(
        ['Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Role', 'XP', 'Level', 'Joined'],
        allUsers.map((row: any) => [
          row.name,
          row.email,
          row.phone,
          row.college,
          row.branch,
          row.year,
          row.role,
          row.xp,
          row.level,
          row.createdAt ? new Date(row.createdAt).toISOString() : '',
        ]),
      );

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Disposition': 'attachment; filename="kratos_users_export.csv"',
          'Content-Type': 'text/csv',
        },
      });
    }

    const regSnap = await db.collection('registrations').get();
    const registrationsData = regSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

    if (registrationsData.length === 0) {
      return new NextResponse('No registrations found.', { status: 404 });
    }

    // Sort by createdAt descending
    registrationsData.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const userIds = Array.from(new Set(registrationsData.map((r: any) => r.userId).filter(Boolean)));
    const eventIds = Array.from(new Set(registrationsData.map((r: any) => r.eventId).filter(Boolean)));

    const usersMap: Record<string, any> = {};
    const eventsMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const userSnaps = await Promise.all(
        userIds.map((id) => db.collection('users').doc(id).get())
      );
      userSnaps.forEach((snap: any) => {
        if (snap.exists) {
          usersMap[snap.id] = snap.data();
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

    const teamIds = registrationsData
      .map((registration: any) => registration.teamId)
      .filter((teamId: any): teamId is string => Boolean(teamId));

    const additionalMembers: any[] = [];
    if (teamIds.length > 0) {
      // Chunk queries by 10 due to Firestore 'in' limit
      const chunks: string[][] = [];
      for (let i = 0; i < teamIds.length; i += 10) {
        chunks.push(teamIds.slice(i, i + 10));
      }
      const snaps = await Promise.all(
        chunks.map((chunk) => db.collection('teamMembers').where('teamId', 'in', chunk).get())
      );
      snaps.forEach((snap: any) => {
        snap.docs.forEach((doc: any) => {
          additionalMembers.push({ id: doc.id, ...doc.data() });
        });
      });
    }

    const membersByTeamId = new Map<string, any[]>();
    additionalMembers.forEach((member: any) => {
      const currentMembers = membersByTeamId.get(member.teamId) ?? [];
      currentMembers.push(member);
      membersByTeamId.set(member.teamId, currentMembers);
    });

    const rows = registrationsData.flatMap((registration: any) => {
      const baseRow = {
        createdAt: registration.createdAt ? new Date(registration.createdAt).toISOString() : '',
        eventName: eventsMap[registration.eventId] || 'Unknown Event',
        registrationId: registration.id,
        status: registration.status,
        teamName: registration.teamName || '',
        totalFee: registration.totalFee ?? '',
        transactionId: registration.transactionId || '',
      };

      const userDetail = usersMap[registration.userId] || {};

      const leaderRow: Array<string | number | null | undefined> = [
        baseRow.registrationId,
        baseRow.eventName,
        baseRow.teamName,
        'Leader',
        userDetail.name || '',
        userDetail.email || '',
        userDetail.phone || '',
        userDetail.college || '',
        userDetail.branch || '',
        userDetail.year || '',
        baseRow.status,
        baseRow.totalFee,
        baseRow.transactionId,
        baseRow.createdAt,
      ];

      const extraRows = (registration.teamId ? membersByTeamId.get(registration.teamId) : undefined) ?? [];

      return [
        leaderRow,
        ...extraRows.map((member: any) => [
          baseRow.registrationId,
          baseRow.eventName,
          baseRow.teamName,
          'Team Member',
          member.name,
          '',
          member.phone,
          member.college,
          member.branch,
          member.year,
          baseRow.status,
          baseRow.totalFee,
          baseRow.transactionId,
          baseRow.createdAt,
        ]),
      ];
    });

    const csv = buildCsv(
      [
        'Registration ID',
        'Event',
        'Team',
        'Role',
        'Name',
        'Email',
        'Phone',
        'College',
        'Branch',
        'Year',
        'Status',
        'Total Fee',
        'Transaction ID',
        'Submitted At',
      ],
      rows,
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="kratos_registrations_export.csv"',
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed.', { status: 500 });
  }
}
