import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
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
    const snap = await db.collection('teamMessages')
      .where('registrationId', '==', registrationId)
      .get();

    const messages = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

    // Sort by createdAt ascending
    messages.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });

    const senderIds = Array.from(new Set(messages.map((m: any) => m.senderId).filter(Boolean)));
    const usersMap: Record<string, string> = {};

    if (senderIds.length > 0) {
      const userSnaps = await Promise.all(
        senderIds.map((id) => db.collection('users').doc(id as string).get())
      );
      userSnaps.forEach((snap: any) => {
        if (snap.exists) {
          usersMap[snap.id] = (snap.data() as any).name;
        }
      });
    }

    const formattedMessages = messages.map((m: any) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt ? new Date(m.createdAt) : null,
      senderId: m.senderId,
      senderName: usersMap[m.senderId] || 'Anonymous',
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
