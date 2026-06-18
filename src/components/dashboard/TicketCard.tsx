'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import Image from 'next/image';
import BrutalButton from '@/components/ui/BrutalButton';
import TeamChat from '@/components/dashboard/TeamChat';

type TicketCardProps = {
  reg: {
    id: string;
    status: string | null;
    teamName: string | null;
    eventName: string;
    eventSlug: string;
    format: string | null;
  };
  userName: string;
  college: string | null;
  currentUserId: string;
  teamMembers: {
    id: string;
    name: string;
    college: string | null;
    branch: string | null;
    year: number | null;
    phone: string | null;
  }[];
};

export default function TicketCard({ reg, userName, college, currentUserId, teamMembers }: TicketCardProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
  // Create a list of all participants (Leader + Members)
  const participants = [
    { id: reg.id, name: userName, isLeader: true, college: college },
    ...teamMembers.map(m => ({ id: m.id, name: m.name, isLeader: false, college: m.college || college }))
  ];

  const downloadTicket = async (participantId: string, participantName: string) => {
    const element = document.getElementById(`ticket-${participantId}`);
    if (element && !isDownloading) {
      setIsDownloading(participantId);
      try {
        const canvas = await html2canvas(element, { 
          backgroundColor: '#FFFFFF',
          scale: 2,
          useCORS: true,
          logging: false
        });
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `KRATOS_PASS_${participantName.replace(/\s+/g, '_')}_${participantId.substring(0,6)}.png`;
        link.href = image;
        link.click();
      } catch (e) {
        console.error('Failed to generate pass:', e);
        alert('Ticket pipeline failed. Please retry.');
      } finally {
        setIsDownloading(null);
      }
    }
  };

  const isTeam = reg.format === 'TEAM' || reg.format === 'SOLO_TEAM' || reg.format === 'SOLO_PAIR';

  if (reg.status === 'REJECTED') {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-4 border-red-600 bg-red-50 relative overflow-hidden gap-4 shadow-[4px_4px_0px_0px_#dc2626]">
        <div className="absolute -top-6 -right-6 opacity-10">
          <span className="material-symbols-outlined text-[150px] text-red-600">block</span>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black uppercase text-red-900">{reg.eventName}</h3>
            <span className="px-2 py-0.5 border-2 bg-red-200 text-red-900 border-red-900 text-[10px] font-black uppercase tracking-tighter">ACCESS DENIED</span>
          </div>
          <p className="text-sm font-sans font-bold text-red-800 mb-2">Transaction Verification Failed / Payment Rejected</p>
          <p className="text-xs font-mono opacity-80 text-red-900">REF: {reg.id.substring(0,8)} | Your payment screenshot was marked invalid by the organizers.</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0 relative z-10">
          <Link href={`/events/${reg.eventSlug}/register`}>
            <BrutalButton size="sm" className="w-full bg-red-600 hover:bg-red-500 text-white shadow-[4px_4px_0px_0px_black] border-black">
              Retry Registration
            </BrutalButton>
          </Link>
        </div>
      </div>
    );
  }

  if (reg.status === 'PENDING') {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 brutal-border bg-yellow-50 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-black uppercase">{reg.eventName}</h3>
            <span className="px-2 py-0.5 border-2 bg-yellow-200 text-yellow-900 border-yellow-900 text-[10px] font-black uppercase tracking-tighter">PENDING VERIFICATION</span>
          </div>
          <p className="text-xs font-sans opacity-70 italic">
            FORMAT: {isTeam ? `TEAM/PAIR (${reg.teamName || 'NO NAME'})` : 'SOLO'} | REF: <span className="font-mono">{reg.id.substring(0,8)}</span>
          </p>
          {isTeam && (
            <div className="mt-4">
              <TeamChat registrationId={reg.id} currentUserId={currentUserId} />
            </div>
          )}
        </div>
        <div className="w-full md:w-auto">
          <BrutalButton size="sm" variant="outline" className="w-full md:w-auto" disabled>
            <span className="material-symbols-outlined text-sm mr-2 animate-spin">sync</span>
            Processing...
          </BrutalButton>
        </div>
      </div>
    );
  }

  // APPROVED TICKET VIEW
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      
      {/* Hidden printable Ticket elements for each participant */}
      <div className="absolute opacity-0 pointer-events-none z-[-1]" style={{ top: 0, left: 0 }}>
        {participants.map((p) => (
          <div key={p.id} id={`ticket-${p.id}`} className="w-[800px] h-[300px] bg-[#F9F9F9] border-4 border-[#000000] p-0 flex relative overflow-hidden font-sans text-[#1A1C1C] mb-4">
            {/* Left Tear Section */}
            <div className="w-16 border-r-4 border-[#000000] border-dashed flex items-center justify-center relative bg-[#FFD700]">
               <p className="transform -rotate-90 whitespace-nowrap font-black uppercase text-xl font-display tracking-widest">
                 KRATOS 2026 OFFICIAL
               </p>
            </div>
            
            {/* Main Info */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                   <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{reg.eventName}</h2>
                   <span className="bg-[#000000] text-[#FFFFFF] px-2 py-1 font-black text-xs uppercase tracking-widest">ADMIT ONE</span>
                </div>
                <p className="font-display font-bold uppercase text-[#705D00] text-sm tracking-widest">{isTeam ? 'Team Pass' : 'Solo Pass'}</p>
              </div>
              
              <div className="mt-6 flex justify-between items-end">
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50">PARTICIPANT NAME</p>
                    <p className="text-lg font-black uppercase">{p.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50">AFFILIATION</p>
                    <p className="text-sm font-bold uppercase">{p.college || 'UNKNOWN'}</p>
                  </div>
                  {isTeam && (
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-50">SQUADRON (TEAM)</p>
                      <p className="text-sm font-bold uppercase text-[#FFD700] bg-[#000000] px-1 inline-block">{reg.teamName}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase opacity-50 mb-1">{p.isLeader ? 'RECOGNITION KEY' : 'MEMBER TOKEN'}</p>
                    <p className="font-mono text-[10px] font-bold bg-[#E5E7EB] text-[#1A1C1C] px-2 py-1">{p.id}</p>
                </div>
              </div>
            </div>
            
            {/* Right Branding Section */}
            <div className="w-[180px] border-l-4 border-[#000000] p-6 flex flex-col items-center justify-center bg-[#FFFFFF] relative">
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                 <span className="w-2 h-2 bg-[#000000] rounded-full block"></span>
                 <span className="w-2 h-2 bg-[#000000] rounded-full block"></span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                 <span className="w-2 h-2 bg-[#000000] rounded-full block"></span>
                 <span className="w-2 h-2 bg-[#000000] rounded-full block"></span>
              </div>
              <Image
                src="/UPDATED COLLEGE LOGO.png"
                alt="College Logo"
                width={120}
                height={120}
                className="w-[120px] h-auto opacity-10 grayscale mb-2"
              />
              <p className="text-[10px] font-black uppercase tracking-widest text-center mt-2">OFFICIAL PASS</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visible Dashboard UI */}
      <div className="flex flex-col p-6 brutal-border bg-surface-container-low gap-6 w-full relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-black uppercase">{reg.eventName}</h3>
              <span className="px-2 py-0.5 border-2 bg-green-200 text-green-900 border-green-900 text-[10px] font-black uppercase tracking-tighter">APPROVED MISSION</span>
            </div>
            <p className="text-xs font-sans opacity-70 italic">
              TRANSIT KEY: <span className="font-mono">{reg.id.substring(0,8)}</span> | {isTeam ? `TEAM: ${reg.teamName || 'N/A'}` : 'SOLO OP'}
            </p>
          </div>
          <div className="bg-primary text-on-primary px-3 py-1 text-[10px] font-black uppercase">
             {participants.length} PASSES GENERATED
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((p) => (
            <div key={p.id} className="p-4 bg-surface border-2 border-on-surface hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_black] transition-all flex flex-col justify-between gap-4">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[8px] font-black px-1.5 border capitalize ${p.isLeader ? 'bg-primary-container text-on-primary-container border-on-primary-container' : 'bg-surface-container-highest text-on-surface border-on-surface'}`}>
                        {p.isLeader ? 'Squad Leader' : 'Team Member'}
                     </span>
                  </div>
                  <p className="text-lg font-black uppercase leading-none truncate">{p.name}</p>
                  <p className="text-[10px] opacity-40 uppercase mt-1 font-mono">{p.id.substring(0,12)}...</p>
               </div>

               <button
                  onClick={() => downloadTicket(p.id, p.name)}
                  disabled={isDownloading === p.id}
                  className={`w-full py-3 bg-on-surface text-surface font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isDownloading === p.id ? 'opacity-50' : 'hover:bg-primary hover:text-on-primary'}`}
               >
                  <span className={`material-symbols-outlined text-sm ${isDownloading === p.id ? 'animate-spin' : ''}`}>
                    {isDownloading === p.id ? 'sync' : 'download_2'}
                  </span>
                  {isDownloading === p.id ? 'GEN-PASS...' : 'DOWNLOAD PASS'}
               </button>
            </div>
          ))}
        </div>

        {isTeam && (
          <div className="mt-2 border-t-2 border-on-surface/10 pt-4">
             <TeamChat registrationId={reg.id} currentUserId={currentUserId} />
          </div>
        )}
      </div>
    </div>
  );
}
