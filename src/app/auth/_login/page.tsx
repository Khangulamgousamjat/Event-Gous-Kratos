"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <BrutalCard shadowColor="gold">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Login</h1>
        <p className="text-sm opacity-60 font-sans uppercase font-bold tracking-wider italic">Login to your account</p>
      </div>

      <div className="mb-6">
        <BrutalButton 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            setLoading(true);
            signIn('google', { callbackUrl: '/dashboard' });
          }}
          disabled={loading}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale contrast-200" />
          CONTINUE WITH GOOGLE
        </BrutalButton>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-on-surface text-center">
        <p className="text-sm font-sans mb-4">
          No account? <Link href="/auth/register" className="font-bold uppercase border-b-2 border-primary-container">Sign Up here</Link>
        </p>
      </div>
    </BrutalCard>
  );
}
