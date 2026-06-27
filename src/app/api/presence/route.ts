import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { viewerId } = await req.json();
    if (!viewerId) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    await db.collection('liveViewers').doc(viewerId).set({
      viewerId,
      lastSeenAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// NOTE: We opt out of caching so the counter is genuinely live.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fifteenSecsAgo = new Date(Date.now() - 15000).toISOString();
    const activeViewers = await db.collection('liveViewers')
      .where('lastSeenAt', '>=', fifteenSecsAgo)
      .get();

    return NextResponse.json({ count: activeViewers.size });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
