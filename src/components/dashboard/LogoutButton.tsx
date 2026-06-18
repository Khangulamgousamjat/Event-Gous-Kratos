"use client";

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import BrutalButton from '@/components/ui/BrutalButton';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <BrutalButton 
      variant="secondary" 
      size="sm" 
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? 'TERMINATING...' : 'Log Out'}
    </BrutalButton>
  );
}
