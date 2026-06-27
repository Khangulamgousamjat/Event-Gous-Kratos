import { Metadata } from 'next';
import { db } from '@/db';
import OrganizersPageClient from '@/components/organizers/OrganizersPageClient';

export const metadata: Metadata = {
  title: 'Organizers | Kratos 2026',
  description: 'Meet the dedicated organizers behind KRATOS 2026 — the minds powering innovation at Matoshri Pratishthan Group of Institutions, Nanded.',
};

export const dynamic = 'force-dynamic';

export default async function OrganizersPage() {
  const organizersSnap = await db.collection('organizers').get();
  const allOrganizers = organizersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
  
  // Sort in-memory: sortOrder asc, then createdAt asc
  allOrganizers.sort((a: any, b: any) => {
    const sortOrderA = a.sortOrder || 0;
    const sortOrderB = b.sortOrder || 0;
    if (sortOrderA !== sortOrderB) {
      return sortOrderA - sortOrderB;
    }
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });

  return <OrganizersPageClient organizers={allOrganizers} />;
}
