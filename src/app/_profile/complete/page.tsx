import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CompleteProfileForm from '@/components/profile/CompleteProfileForm';

export default async function ProfileCompletionPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Check if profile is already complete - if so, don't show this page
  // However, the dashboard already handles this redirect, so we assume if they are here, they need it.

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <BrutalCard shadow={true} shadowColor="gold">
        <CompleteProfileForm 
          userEmail={session.user.email} 
          userName={session.user.name || 'Participant'} 
        />
      </BrutalCard>
    </div>
  );
}
