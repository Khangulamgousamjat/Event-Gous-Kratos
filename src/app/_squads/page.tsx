import React, { Suspense } from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { squadPosts, users, events } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { auth } from '@/auth';
import SquadPostForm from '@/components/squads/SquadPostForm';
import { deleteSquadPost } from '@/lib/actions';

export const dynamic = 'force-dynamic';

async function SquadList() {
  const session = await auth();
  const allPosts = await db.select({
    id: squadPosts.id,
    bio: squadPosts.bio,
    createdAt: squadPosts.createdAt,
    userName: users.name,
    userId: users.id,
    userEmail: users.email,
    userBranch: users.branch,
    eventName: events.name,
    eventId: events.id,
  })
    .from(squadPosts)
    .innerJoin(users, eq(squadPosts.userId, users.id))
    .innerJoin(events, eq(squadPosts.eventId, events.id))
    .orderBy(desc(squadPosts.createdAt));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {allPosts.map((post) => (
        <BrutalCard key={post.id} className="p-8 relative group" shadowColor="gold">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary-container px-2 py-0.5 rounded-sm mb-2 inline-block">
                Recruitment Signal
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">{post.eventName}</h3>
            </div>
            {session?.user?.id === post.userId && (
              <form action={async () => {
                'use server';
                await deleteSquadPost(post.id);
              }}>
                <button type="submit" className="text-red-500 hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined font-black">delete_sweep</span>
                </button>
              </form>
            )}
          </div>

          <p className="font-sans text-sm mb-8 leading-relaxed border-l-4 border-on-surface pl-4 opacity-80">
            <q>{post.bio}</q>
          </p>

          <div className="flex justify-between items-end pt-6 border-t border-on-surface/10">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-60 mb-1 leading-none">Operative Identity</p>
              <p className="font-display font-black uppercase text-sm">{post.userName}</p>
              <p className="text-[10px] font-bold uppercase opacity-40">{post.userBranch}</p>
            </div>
            <a href={`mailto:${post.userEmail}?subject=KRATOS%202026%20Squad%20Inquiry%20-%20${encodeURIComponent(post.eventName)}`}>
              <BrutalButton size="sm" variant="outline">Contact Signal</BrutalButton>
            </a>
          </div>
        </BrutalCard>
      ))}
      {allPosts.length === 0 && (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-on-surface/20">
          <p className="font-display font-black text-2xl uppercase opacity-20 tracking-[0.2em]">No Active Recruitment Signals</p>
        </div>
      )}
    </div>
  );
}

export default async function SquadsPage() {
  const session = await auth();
  const allEvents = await db.select().from(events);

  return (
    <main className="min-h-screen bg-surface pt-20 pb-32">
      <div className="max-w-[1440px] mx-auto px-6">
        <header className="mb-20">
          <span className="inline-block bg-on-surface text-surface px-4 py-1 font-display font-black text-sm uppercase tracking-widest mb-4">
            Network Operations
          </span>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
            Squad<br /><span className="text-primary">Board</span>
          </h1>
          <p className="max-w-xl text-xl font-sans font-bold italic opacity-80 border-l-8 border-primary pl-8">
            Solo operatives seeking formation. Browse active signals or broadcast your own to find a squad for multi-user modules.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="font-display font-black text-4xl animate-pulse uppercase">Scanning Frequencies...</div>}>
              <SquadList />
            </Suspense>
          </div>

          <div className="lg:col-span-4 h-fit sticky top-32">
            <BrutalCard className="p-8" shadow={true}>
              <h2 className="text-2xl font-black uppercase mb-6 underline decoration-4">Broadcast Signal</h2>
              {session ? (
                <SquadPostForm events={allEvents} />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-bold uppercase opacity-60">Authentication required to broadcast signals.</p>
                  <Link href="/auth/login" className="block">
                    <BrutalButton className="w-full">Initialize Login</BrutalButton>
                  </Link>
                </div>
              )}
            </BrutalCard>
          </div>
        </div>
      </div>
    </main>
  );
}
