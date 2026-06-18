import { db } from '@/db';
import { liveViewers } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { viewerId } = await req.json();
    if (!viewerId) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    await db.insert(liveViewers)
      .values({ viewerId, lastSeenAt: new Date() })
      .onConflictDoUpdate({
        target: liveViewers.viewerId,
        set: { lastSeenAt: new Date() }
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
    const res = await db.select({ 
      count: sql<number>`count(*)::int` 
    })
    .from(liveViewers)
    .where(sql`last_seen_at >= now() - interval '15 seconds'`);

    return NextResponse.json({ count: res[0].count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
