'use client';

import React, { useTransition } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalCard from '@/components/ui/BrutalCard';
import { updateGalleryLock } from '@/lib/actions';

export default function GalleryAdminToggle({ isLocked }: { isLocked: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await updateGalleryLock(!isLocked);
    });
  };

  return (
    <BrutalCard shadow={true}>
      <div className="flex justify-between items-center mb-4 border-b-2 border-on-surface pb-2">
        <h3 className="text-xl font-black uppercase">Global Gallery Lock</h3>
        <span className={`px-3 py-1 text-xs font-black uppercase text-white ${isLocked ? 'bg-red-600' : 'bg-green-600'}`}>
          {isLocked ? "ACCESS DENIED" : "PUBLIC ACCESS"}
        </span>
      </div>
      <p className="text-xs font-bold uppercase opacity-70 mb-6">
        {isLocked 
          ? "The Memory Gallery is currently offline. Participants cannot upload or view photos." 
          : "The Memory Gallery is live. Participants can upload and the public can view."}
      </p>
      
      <BrutalButton 
        onClick={handleToggle}
        disabled={isPending}
        className={`w-full justify-center ${isLocked ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
      >
        <span className="material-symbols-outlined mr-2">
          {isLocked ? "lock_open" : "lock"}
        </span>
        {isPending ? "PROCESSING OVERRIDE..." : (isLocked ? "UNLOCK GALLERY" : "INITIATE LOCKDOWN")}
      </BrutalButton>
    </BrutalCard>
  );
}
