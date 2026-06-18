import { NextResponse } from 'next/server';
import { desc, eq, inArray } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { events, registrations, teamMembers, users } from '@/db/schema';
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
      const allUsers = await db
        .select({
          branch: users.branch,
          college: users.college,
          email: users.email,
          joinedAt: users.createdAt,
          level: users.level,
          name: users.name,
          phone: users.phone,
          role: users.role,
          xp: users.xp,
          year: users.year,
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      if (allUsers.length === 0) {
        return new NextResponse('No users found.', { status: 404 });
      }

      const csv = buildCsv(
        ['Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Role', 'XP', 'Level', 'Joined'],
        allUsers.map((row) => [
          row.name,
          row.email,
          row.phone,
          row.college,
          row.branch,
          row.year,
          row.role,
          row.xp,
          row.level,
          row.joinedAt ? new Date(row.joinedAt).toISOString() : '',
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

    const registrationsData = await db
      .select({
        createdAt: registrations.createdAt,
        eventName: events.name,
        participantBranch: users.branch,
        participantCollege: users.college,
        participantEmail: users.email,
        participantName: users.name,
        participantPhone: users.phone,
        participantYear: users.year,
        registrationId: registrations.id,
        status: registrations.status,
        teamId: registrations.teamId,
        teamName: registrations.teamName,
        totalFee: registrations.totalFee,
        transactionId: registrations.transactionId,
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id))
      .innerJoin(events, eq(registrations.eventId, events.id))
      .orderBy(desc(registrations.createdAt));

    if (registrationsData.length === 0) {
      return new NextResponse('No registrations found.', { status: 404 });
    }

    const teamIds = registrationsData
      .map((registration) => registration.teamId)
      .filter((teamId): teamId is string => Boolean(teamId));

    const additionalMembers =
      teamIds.length > 0
        ? await db
            .select({
              branch: teamMembers.branch,
              college: teamMembers.college,
              name: teamMembers.name,
              phone: teamMembers.phone,
              teamId: teamMembers.teamId,
              year: teamMembers.year,
            })
            .from(teamMembers)
            .where(inArray(teamMembers.teamId, teamIds))
        : [];

    const membersByTeamId = new Map<string, typeof additionalMembers>();
    additionalMembers.forEach((member) => {
      const currentMembers = membersByTeamId.get(member.teamId) ?? [];
      currentMembers.push(member);
      membersByTeamId.set(member.teamId, currentMembers);
    });

    const rows = registrationsData.flatMap((registration) => {
      const baseRow = {
        createdAt: registration.createdAt ? new Date(registration.createdAt).toISOString() : '',
        eventName: registration.eventName,
        registrationId: registration.registrationId,
        status: registration.status,
        teamName: registration.teamName || '',
        totalFee: registration.totalFee ?? '',
        transactionId: registration.transactionId || '',
      };

      const leaderRow: Array<string | number | null | undefined> = [
        baseRow.registrationId,
        baseRow.eventName,
        baseRow.teamName,
        'Leader',
        registration.participantName,
        registration.participantEmail,
        registration.participantPhone,
        registration.participantCollege,
        registration.participantBranch,
        registration.participantYear,
        baseRow.status,
        baseRow.totalFee,
        baseRow.transactionId,
        baseRow.createdAt,
      ];

      const extraRows = (registration.teamId ? membersByTeamId.get(registration.teamId) : undefined) ?? [];

      return [
        leaderRow,
        ...extraRows.map((member) => [
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
