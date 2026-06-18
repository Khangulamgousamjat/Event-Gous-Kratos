'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { registerAdmin } from '@/lib/actions';

export default function AdminRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await registerAdmin(formData);
    setLoading(false);

    if ('error' in result) {
      setError(`[ERROR] ${result.error}`);
    } else {
      router.push('/auth/adminlogin?registered=true');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-on-surface">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="inline-block bg-primary-container px-3 py-1 mb-4">
            <span className="text-on-primary-container font-display font-black text-xs tracking-widest uppercase">Staff Setup</span>
          </div>
          <h1 className="text-4xl font-black text-surface tracking-tighter uppercase italic">
            Staff Registration
          </h1>
        </header>

        <BrutalCard shadowColor="black" className="bg-surface-container-low">
          <form action={handleSubmit} className="space-y-6">
            {error ? (
              <div className="p-4 bg-red-100 border-2 border-red-800 text-red-800 text-xs font-bold uppercase italic animate-pulse">
                {error}
              </div>
            ) : null}

            <BrutalInput
              label="Name"
              name="name"
              type="text"
              placeholder="Enter staff name"
              required
            />

            <BrutalInput
              label="Staff Email"
              name="email"
              type="email"
              placeholder="staff@kratos.fest"
              required
            />

            <BrutalInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-display font-bold uppercase tracking-widest text-on-surface">
                Staff Role
              </label>
              <select
                name="role"
                defaultValue="VOLUNTEER"
                className="w-full px-4 py-3 bg-white brutal-border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ADMIN">Super Admin (requires signed-in admin)</option>
              </select>
            </div>

            <BrutalInput
              label="Setup Key"
              name="setupKey"
              type="password"
              placeholder="Required unless a super admin is already signed in"
            />

            <BrutalButton type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Staff Account'}
            </BrutalButton>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-on-surface/10 text-center">
            <Link href="/auth/adminlogin" className="text-[10px] font-black uppercase text-primary hover:underline block">
              &larr; Back to Staff Login
            </Link>
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
