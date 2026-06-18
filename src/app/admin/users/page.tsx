import React from 'react';
import UserManagementPage from '@/app/admin/_users/page';

export const dynamic = 'force-dynamic';

export default function AdminUsersRoute() {
  return <UserManagementPage />;
}
