import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { organizers } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { requireAdminPageAccess } from '@/lib/authz';
import AdminOrganizersClient from '@/components/admin/AdminOrganizersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizersPage() {
  await requireAdminPageAccess();

  const allOrganizers = await db
    .select()
    .from(organizers)
    .orderBy(asc(organizers.sortOrder), asc(organizers.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Organizer Management</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Create, edit &amp; manage organizer profiles</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <AdminOrganizersClient organizers={allOrganizers} />
    </div>
  );
}
