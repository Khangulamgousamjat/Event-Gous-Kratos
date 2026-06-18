import { Metadata } from 'next';
import { db } from '@/db';
import { organizers } from '@/db/schema';
import { asc } from 'drizzle-orm';
import OrganizersPageClient from '@/components/organizers/OrganizersPageClient';

export const metadata: Metadata = {
  title: 'Organizers | Kratos 2026',
  description: 'Meet the dedicated organizers behind KRATOS 2026 — the minds powering innovation at Matoshri Pratishthan Group of Institutions, Nanded.',
};

export const dynamic = 'force-dynamic';

export default async function OrganizersPage() {
  const allOrganizers = await db
    .select()
    .from(organizers)
    .orderBy(asc(organizers.sortOrder), asc(organizers.createdAt));

  return <OrganizersPageClient organizers={allOrganizers} />;
}
