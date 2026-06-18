import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teamMessages, users } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: registrationId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await db.select({
      id: teamMessages.id,
      content: teamMessages.content,
      createdAt: teamMessages.createdAt,
      senderId: teamMessages.senderId,
      senderName: users.name,
    })
    .from(teamMessages)
    .innerJoin(users, eq(teamMessages.senderId, users.id))
    .where(eq(teamMessages.registrationId, registrationId))
    .orderBy(asc(teamMessages.createdAt));

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
