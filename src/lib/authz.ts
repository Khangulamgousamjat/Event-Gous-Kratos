import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export type AppRole = 'ADMIN' | 'VOLUNTEER' | 'PARTICIPANT';

export function isStaffRole(role: AppRole | undefined | null): role is 'ADMIN' | 'VOLUNTEER' {
  return role === 'ADMIN' || role === 'VOLUNTEER';
}

export function canVolunteerAccessPath(pathname: string): boolean {
  return (
    pathname.startsWith('/admin/registrations') ||
    pathname.startsWith('/admin/checkin') ||
    pathname.startsWith('/admin/scanner') ||
    pathname.startsWith('/admin/desk') ||
    pathname.startsWith('/api/admin/export')
  );
}

export async function requireAuthenticatedStaff() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/adminlogin');
  }

  if (!isStaffRole(session.user.role)) {
    redirect('/dashboard');
  }

  return session;
}

export async function requireAdminPageAccess() {
  const session = await requireAuthenticatedStaff();

  if (session.user.role !== 'ADMIN') {
    redirect('/admin/registrations');
  }

  return session;
}

export async function requireStaffPageAccess() {
  return requireAuthenticatedStaff();
}

export async function assertAdminAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized. Admin access required.');
  }

  return session;
}

export async function assertStaffAction() {
  const session = await auth();

  if (!session?.user || !isStaffRole(session.user.role)) {
    throw new Error('Unauthorized. Staff access required.');
  }

  return session;
}

export async function getActionSession() {
  return auth();
}
