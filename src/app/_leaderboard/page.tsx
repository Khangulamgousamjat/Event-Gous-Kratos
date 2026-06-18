import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { systemSettings, events, users } from '@/db/schema';
import { eq, isNotNull, desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import LiveViewerCounter from '@/components/marketing/LiveViewerCounter';
import CountdownTimer from '@/components/marketing/CountdownTimer';
import { Trophy, Medal, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default async function LeaderboardPage() {
  const settings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const currentSettings = settings.length > 0 ? settings[0] : null;

  const revealTime = currentSettings?.resultsRevealTime;
  const videoUrl = currentSettings?.resultsVideoUrl;
  
  // eslint-disable-next-line react-hooks/purity
  const isLocked = !revealTime || revealTime.getTime() > Date.now();

  if (isLocked) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-surface-container-low border-b-4 border-on-surface text-center">
         <span className="material-symbols-outlined text-8xl md:text-[200px] opacity-10 animate-pulse text-primary block mb-12">lock_clock</span>
         <h1 className="text-4xl md:text-8xl font-display font-black uppercase tracking-tighter mb-6 italic">Leaderboard<br/>Offline</h1>
         <div className="h-1 w-32 bg-primary brutal-border mx-auto mb-12"></div>
         <p className="font-sans font-bold text-lg md:text-2xl uppercase opacity-80 mb-8 max-w-2xl tracking-widest leading-loose">
           The outcome of the module trials is sealed. Security clearances will unlock according to the official synchronized timeline.
         </p>
         {revealTime ? (
            <div className="scale-125 mx-auto w-fit border-4 border-on-surface shadow-[6px_6px_0px_#000]">
               <CountdownTimer targetDate={revealTime.toISOString()} enableRefreshOnZero={true} />
            </div>
         ) : (
            <div className="font-display font-black text-xl md:text-3xl uppercase text-red-600 border-4 border-red-600 p-8 bg-red-50">
               AWAITING CHRONOLOGICAL INPUT FROM COMMAND CENTER
            </div>
         )}
      </div>
    );
  }

  // UNLOCKED STATE
  const allEvents = await db.select().from(events).where(isNotNull(events.winners)).orderBy(desc(events.createdAt));
  
  // Fetch Top Operatives (Gamification)
  const topOperatives = await db.select({
    name: users.name,
    xp: users.xp,
    level: users.level,
    college: users.college
  })
  .from(users)
  .orderBy(desc(users.xp))
  .limit(10);

  return (
    <div className="min-h-screen bg-surface-container-low pb-24 border-b-4 border-on-surface">
       {/* Video Splash Block */}
       <div className="bg-main border-y-4 border-on-surface pt-32 pb-6 md:pb-12 px-6 shadow-[0_12px_0_0_#000]">
          <div className="max-w-[1440px] mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                   <h1 className="text-6xl md:text-8xl font-black font-display uppercase italic tracking-tighter text-on-surface mb-2 leading-[0.8] mt-4">Leaderboard<br/>& Results</h1>
                   <div className="h-2 w-32 bg-primary brutal-border mt-4 mb-4"></div>
                   <p className="font-sans font-bold text-primary uppercase text-xs tracking-[0.3em]">Module Trials Concluded. Operational Superiority Determined.</p>
                </div>
                <LiveViewerCounter />
             </div>

             {videoUrl ? (
                <div className="relative w-full aspect-video border-4 border-on-surface bg-black brutal-border">
                   <iframe src={videoUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0"></iframe>
                </div>
             ) : (
                <div className="relative w-full aspect-video border-4 border-on-surface bg-surface flex flex-col justify-center items-center text-center brutal-border p-12">
                   <span className="material-symbols-outlined text-[100px] opacity-20 block mb-6 animate-pulse">videocam_off</span>
                   <p className="font-display font-black uppercase tracking-widest text-2xl opacity-60">NO VISUAL PAYLOAD UPLOADED</p>
                </div>
             )}
          </div>
        </div>

        {/* Global Operative Rankings (3D Podium) */}
        <div className="max-w-[1440px] mx-auto px-6 mt-24">
           <div className="mb-12 flex items-center justify-between border-b-4 border-on-surface pb-6">
              <div>
                 <h2 className="text-4xl font-black font-display uppercase italic tracking-tighter">Global Rankings</h2>
                 <p className="text-xs font-bold uppercase text-primary tracking-widest mt-1">Direct Feed from the Tech Quest Matrix</p>
              </div>
              <div className="hidden md:flex gap-4">
                 <div className="p-3 brutal-border bg-on-surface text-surface flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-container" />
                    <span className="text-xs font-bold uppercase italic">XP Real-time</span>
                 </div>
              </div>
           </div>

           {/* 3D Podium for Top 3 */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mb-16 pt-12" style={{ perspective: '1000px' }}>
              {/* Silver (2nd) */}
              {topOperatives[1] && (
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="order-2 md:order-1 flex flex-col items-center"
                 >
                    <div className="mb-4 text-center">
                       <p className="font-black text-xl uppercase truncate max-w-[200px]">{topOperatives[1].name}</p>
                       <p className="text-[10px] uppercase font-bold opacity-60 bg-on-surface/5 px-2 py-0.5">{topOperatives[1].college}</p>
                    </div>
                    <div className="w-full h-40 brutal-border bg-on-surface text-surface flex flex-col items-center justify-center relative hard-shadow" style={{ transform: 'rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
                       <Medal className="w-12 h-12 text-slate-400 mb-2" />
                       <span className="text-5xl font-black italic">2</span>
                       <p className="text-[10px] font-bold uppercase tracking-widest mt-2">{topOperatives[1].xp} XP</p>
                       {/* 3D Side */}
                       <div className="absolute left-[-10px] top-0 w-[10px] h-full bg-on-surface/20 origin-right" style={{ transform: 'rotateY(-90deg)' }} />
                    </div>
                 </motion.div>
              )}

              {/* Gold (1st) */}
              {topOperatives[0] && (
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="order-1 md:order-2 flex flex-col items-center"
                 >
                    <div className="mb-6 text-center">
                       <Trophy className="w-8 h-8 text-primary-container inline-block mb-2 animate-bounce" />
                       <p className="font-black text-2xl uppercase truncate max-w-[250px]">{topOperatives[0].name}</p>
                       <p className="text-[10px] uppercase font-bold opacity-80 bg-primary-container text-on-primary-container px-3 py-1 brutal-border inline-block mt-1">{topOperatives[0].college}</p>
                    </div>
                    <div className="w-full h-56 brutal-border bg-primary-container text-on-primary-container flex flex-col items-center justify-center relative hard-shadow-gold" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                       <span className="text-7xl font-black italic">1</span>
                       <p className="text-xs font-black uppercase tracking-widest mt-4 underline decoration-4 underline-offset-4">{topOperatives[0].xp} XP</p>
                       <div className="mt-2 flex items-center gap-1 bg-on-primary-container text-primary-container px-2 py-0.5 text-[8px] font-black uppercase">
                          <Zap className="w-3 h-3 fill-primary-container" /> ELITE OPERATIVE
                       </div>
                    </div>
                 </motion.div>
              )}

              {/* Bronze (3rd) */}
              {topOperatives[2] && (
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.4 }}
                   className="order-3 md:order-3 flex flex-col items-center"
                 >
                    <div className="mb-4 text-center">
                       <p className="font-black text-xl uppercase truncate max-w-[200px]">{topOperatives[2].name}</p>
                       <p className="text-[10px] uppercase font-bold opacity-60 bg-on-surface/5 px-2 py-0.5">{topOperatives[2].college}</p>
                    </div>
                    <div className="w-full h-32 brutal-border bg-on-surface text-surface flex flex-col items-center justify-center relative hard-shadow" style={{ transform: 'rotateY(15deg)', transformStyle: 'preserve-3d' }}>
                       <Medal className="w-10 h-10 text-orange-600 mb-2" />
                       <span className="text-4xl font-black italic">3</span>
                       <p className="text-[10px] font-bold uppercase tracking-widest mt-1">{topOperatives[2].xp} XP</p>
                       {/* 3D Side */}
                       <div className="absolute right-[-10px] top-0 w-[10px] h-full bg-on-surface/20 origin-left" style={{ transform: 'rotateY(90deg)' }} />
                    </div>
                 </motion.div>
              )}
           </div>

           {/* Remaining List */}
           <div className="bg-surface brutal-border p-6 md:p-8 hard-shadow mb-24">
              <div className="overflow-x-auto">
                 <table className="w-full border-collapse font-sans min-w-[600px]">
                    <thead>
                       <tr className="border-b-2 border-on-surface text-left">
                          <th className="py-4 px-4 text-[10px] font-black uppercase opacity-40 text-center w-20">Rank</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase opacity-40">Operative</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase opacity-40 hidden md:table-cell">Institute</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase opacity-40 text-right w-40">XP Gained</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-on-surface/10">
                       {topOperatives.slice(3).map((op, i) => (
                          <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                             <td className="py-5 px-4 font-display font-black text-xl italic opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all text-center">#{i + 4}</td>
                             <td className="py-5 px-4">
                                <p className="font-bold text-sm uppercase tracking-tight">{op.name}</p>
                                <p className="text-[10px] font-bold uppercase opacity-60 md:hidden">{op.college}</p>
                             </td>
                             <td className="py-5 px-4 text-xs font-bold uppercase opacity-60 hidden md:table-cell">{op.college}</td>
                             <td className="py-5 px-4 text-right">
                                <div className="inline-flex items-center gap-2 bg-on-surface/5 px-4 py-1 brutal-border transition-all group-hover:bg-primary/10">
                                   <Zap className="w-3 h-3 text-primary" />
                                   <span className="font-mono font-black text-sm">{op.xp}</span>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Results Matrix Grid */}

       <div className="max-w-[1440px] mx-auto px-6 mt-24">
          <div className="mb-12">
             <h2 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-4">Official Transmission Data</h2>
             <div className="h-2 w-24 bg-primary brutal-border"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {allEvents.map((evt) => {
                const winnersList = evt.winners as Array<{place: number, name: string, college: string}> || [];
                // Sort by place
                winnersList.sort((a,b) => a.place - b.place);
                
                return (
                   <BrutalCard key={evt.id} className="p-0 overflow-hidden flex flex-col h-full bg-surface" shadowColor="gold">
                      <div className="bg-primary text-on-primary p-6 border-b-4 border-on-surface flex justify-between items-center text-left h-fit min-h-24">
                         <div>
                            <h3 className="font-display font-black text-2xl uppercase tracking-widest truncate max-w-[200px] md:max-w-xs">{evt.name}</h3>
                            <p className="font-bold text-[10px] opacity-80 uppercase font-sans tracking-widest mt-1">Event // {evt.category || 'Universal'}</p>
                         </div>
                         <span className="material-symbols-outlined text-4xl opacity-50">workspace_premium</span>
                      </div>
                      
                      <div className="p-6 space-y-4 flex-grow divide-y-2 divide-on-surface/20">
                         {winnersList.map((win, idx) => (
                           <div key={idx} className="pt-4 first:pt-0 flex gap-4 items-center">
                              <span className={`font-display font-black text-4xl w-12 text-center text-on-surface/30`}>0{win.place}</span>
                              <div className="flex-1 overflow-hidden min-h-12 flex justify-center flex-col">
                                 {win.name ? (
                                    <>
                                       <p className="font-black text-sm uppercase tracking-widest truncate text-on-surface leading-tight">{win.name}</p>
                                       <p className="font-sans font-bold text-[10px] opacity-60 uppercase truncate">{win.college}</p>
                                    </>
                                 ) : (
                                    <p className="font-display font-bold uppercase text-[10px] opacity-20 italic bg-on-surface/5 p-2 w-fit">NULL DATA</p>
                                 )}
                              </div>
                           </div>
                         ))}
                      </div>
                   </BrutalCard>
                )
             })}
             
             {allEvents.length === 0 && (
                <div className="col-span-full text-center py-20 border-4 border-dashed border-on-surface opacity-50 bg-secondary-container/50">
                   <p className="font-display font-black text-2xl uppercase tracking-widest mb-2">Null Sector Array</p>
                   <p className="font-sans font-bold uppercase text-xs">No event distributions tracked.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
