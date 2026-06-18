'use client';

import React, { useState } from 'react';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { completeProfile } from '@/lib/actions';
import Image from 'next/image';

type CompleteProfileFormProps = {
  userEmail: string;
  userName: string;
};

export default function CompleteProfileForm({ userEmail, userName }: CompleteProfileFormProps) {
  const [collegeType, setCollegeType] = useState<'MPGI' | 'OTHER'>('MPGI');
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 border-b-4 border-on-surface pb-6">
        <span className="inline-block bg-primary-container text-on-primary-container px-3 py-1 brutal-border mb-4 font-display font-black text-xs uppercase tracking-widest animate-pulse">
          Action Required
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
          Fill Academic<br />Details
        </h1>
        <div className="font-sans font-bold opacity-70 border-l-4 border-primary pl-4 uppercase text-xs mt-4 space-y-1">
          <p className="text-sm normal-case">Welcome, <span className="text-primary">{userName}</span> 👋</p>
          <p className="text-xs uppercase">Google login complete.</p>
          <p className="text-xs uppercase">Add your college details to unlock full access.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setLoading(true);
          const cType = collegeType;
          const otherC = formData.get('college_other') as string;
          if (cType === 'MPGI') {
            formData.set('college', 'Matoshri Pratishthan Group of Institutions (SOE)');
          } else {
            formData.set('college', otherC);
          }
          await completeProfile(formData);
        }} 
        className="space-y-6"
      >
        <input type="hidden" name="email" value={userEmail} />
        
        <div className="flex flex-col gap-3">
          <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">College / Institution</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCollegeType('MPGI')}
              className={`flex items-center gap-3 p-4 brutal-border transition-all ${
                collegeType === 'MPGI' 
                ? 'bg-primary-container text-on-primary-container translate-x-1 translate-y-1 shadow-none' 
                : 'bg-surface hover:bg-surface-container-low shadow-[4px_4px_0px_0px_var(--on-surface)]'
              }`}
            >
              <div className="w-10 h-10 bg-white brutal-border p-1 flex items-center justify-center shrink-0">
                <Image src="/branding/college-logo.png" alt="MPGI" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-display font-black text-left leading-tight text-xs uppercase">MPGI SOE</span>
            </button>

            <button
              type="button"
              onClick={() => setCollegeType('OTHER')}
              className={`flex items-center gap-3 p-4 brutal-border transition-all ${
                collegeType === 'OTHER' 
                ? 'bg-secondary-container text-on-secondary-container translate-x-1 translate-y-1 shadow-none' 
                : 'bg-surface hover:bg-surface-container-low shadow-[4px_4px_0px_0px_var(--on-surface)]'
              }`}
            >
              <div className="w-10 h-10 bg-on-surface text-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">school</span>
              </div>
              <span className="font-display font-black text-left leading-tight text-xs uppercase">Other College</span>
            </button>
          </div>
        </div>

        {collegeType === 'OTHER' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <BrutalInput 
              label="Enter College Name" 
              name="college_other" 
              placeholder="e.g. Imperial Institute of Technology" 
              required 
            />
          </div>
        )}

        <BrutalInput 
          label="Current Year (e.g., 1/2/3/4)" 
          name="year" 
          type="number"
          min={1}
          max={6}
          placeholder="e.g. 2"
          required 
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">Branch / Specialization</label>
          <select name="branch" required className="brutal-border bg-surface p-3 outline-none focus:border-primary font-display font-bold uppercase h-[46px]">
            <option value="">-- SELECT BRANCH --</option>
            <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
            <option value="Computer Science Engineering (CSE)">Computer Science Engineering (CSE)</option>
            <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
            <option value="Mechanical and Automation Engineering (ME)">Mechanical and Automation Engineering (ME)</option>
            <option value="Electronics and Telecommunication Engineering (E&TC)">Electronics and Telecommunication Engineering (E&TC)</option>
            <option value="Artificial Intelligence and Data Science (AI&DS)">Artificial Intelligence and Data Science (AI&DS)</option>
            <option value="Artificial Intelligence and Machine learning (AI&ML)">Artificial Intelligence and Machine learning (AI&ML)</option>
            <option value="Other">Other / Not Listed</option>
          </select>
        </div>

        <BrutalInput 
          label="Contact Number" 
          name="phone" 
          type="tel"
          placeholder="+91 00000 00000" 
          required 
        />

        <BrutalButton type="submit" size="xl" className="w-full mt-4" disabled={loading}>
          {loading ? 'SYNCING...' : 'CONTINUE'}
        </BrutalButton>
      </form>
    </div>
  );
}
