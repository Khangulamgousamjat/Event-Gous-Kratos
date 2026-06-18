import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { users, registrations } from '@/db/schema';
import { desc, count } from 'drizzle-orm';
import Link from 'next/link';
import { updateUser, deleteUser } from '@/lib/actions';
import UsersClientWrapper, { type User } from '@/components/admin/UsersClientWrapper';
import { requireAdminPageAccess } from '@/lib/authz';

export default async function UserManagementPage() {
  await requireAdminPageAccess();

  const allUsersRaw = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  const regCounts = await db
    .select({ userId: registrations.userId, count: count() })
    .from(registrations)
    .groupBy(registrations.userId);

  const regCountMap = new Map(regCounts.map((r) => [r.userId, r.count]));

  const allUsers: User[] = allUsersRaw.map((u) => ({
    ...u,
    registrationCount: regCountMap.get(u.id) ?? 0,
  }));

  const totalUsers = allUsers.length;
  const admins = allUsers.filter((u) => u.role === 'ADMIN').length;
  const noRegistrations = allUsers.filter((u) => u.registrationCount === 0).length;
  const withRegistrations = allUsers.filter((u) => u.registrationCount > 0).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <Link
          href="/admin/dashboard"
          className="font-display font-bold uppercase text-primary tracking-widest text-xs hover:underline inline-flex items-center gap-1 mb-6"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-block bg-primary-container px-3 py-1 brutal-border mb-3 font-display font-bold text-xs uppercase tracking-widest">
              Accounts Registry
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic">
              All User Accounts
            </h1>
            <p className="text-sm font-bold uppercase opacity-60 mt-1 tracking-widest">
              Every account created, with or without event registrations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Accounts', value: totalUsers, color: 'bg-blue-50 border-blue-800 text-blue-900' },
          { label: 'Admins', value: admins, color: 'bg-purple-50 border-purple-800 text-purple-900' },
          { label: 'No Registrations', value: noRegistrations, color: 'bg-orange-50 border-orange-800 text-orange-900' },
          { label: 'Registered for Events', value: withRegistrations, color: 'bg-green-50 border-green-800 text-green-900' },
        ].map((stat) => (
          <div key={stat.label} className={`border-2 p-4 ${stat.color}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{stat.label}</p>
            <p className="text-3xl font-black font-display tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <UsersClientWrapper users={allUsers} updateUser={updateUser} deleteUser={deleteUser} />
    </div>
  );
}
