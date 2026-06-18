'use client';
import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { updateAnnouncement } from '@/lib/actions';

const BroadcastForm = () => {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateAnnouncement(formData);
    setLoading(false);
    if (result.success) {
      alert('Announcement Updated.');
    } else {
      alert(result.error);
    }
  }

  return (
    <BrutalCard shadow={true} shadowColor="black">
      <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-on-surface pb-2 flex items-center gap-2">
        <span className="material-symbols-outlined">campaign</span>
        Announcements
      </h3>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Single Line Message</label>
          <input 
            name="content"
            type="text" 
            placeholder="E.G. REGISTRATION DEADLINE EXTENDED..." 
            className="w-full px-4 py-2 brutal-border text-sm font-bold uppercase outline-none focus:border-primary"
            required
          />
        </div>
        <div className="flex items-center gap-2">
           <input type="checkbox" name="isActive" id="isActive" defaultChecked className="w-4 h-4" />
           <label htmlFor="isActive" className="text-[10px] font-black uppercase">Show Announcement</label>
        </div>
        <BrutalButton type="submit" className="w-full" size="sm" disabled={loading}>
          {loading ? 'UPDATING...' : 'UPDATE ANNOUNCEMENT'}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
};

export default BroadcastForm;
