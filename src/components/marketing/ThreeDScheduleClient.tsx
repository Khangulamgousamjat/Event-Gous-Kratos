'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

type ScheduleItem = {
  time: string;
  day1: string;
  day2: string;
  day1Venue: string | null;
  day2Venue: string | null;
  isBreak: boolean;
};

export default function ThreeDScheduleClient({ scheduleData }: { scheduleData: ScheduleItem[] }) {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  return (
    <section id="schedule" className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter">
            Timeline <span className="text-primary-container">3D</span>
          </h2>
          <p className="font-display font-bold uppercase tracking-widest text-primary text-sm border-l-4 border-primary pl-4">
            Interactive Event Schedule
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: 3D Selector */}
          <div
            className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-8 justify-center items-center py-12"
            style={{ perspective: '1000px' }}
          >
            {[1, 2].map((day) => (
              <motion.div
                key={day}
                onClick={() => setActiveDay(day as 1 | 2)}
                whileHover={{ scale: 1.05, rotateY: 30 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: activeDay === day ? 25 : 0,
                  rotateX: activeDay === day ? -10 : 0,
                  z: activeDay === day ? 50 : 0,
                  x: activeDay === day ? 20 : 0,
                }}
                className={`
                  w-48 h-48 brutal-border cursor-pointer flex flex-col items-center justify-center relative transition-colors duration-500
                  ${
                    activeDay === day
                      ? 'bg-primary-container text-on-primary-container hard-shadow-gold'
                      : 'bg-surface text-on-surface hover:bg-surface-container-low'
                  }
                `}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-3 -left-3 bg-on-surface text-surface px-2 py-1 text-[10px] font-black uppercase">
                  Slot {day}
                </div>
                <h3 className="text-6xl font-black uppercase italic leading-none">D{day}</h3>
                <p className="font-display font-bold uppercase tracking-widest text-xs mt-2">
                  {day === 1 ? 'Ignition' : 'Surge'}
                </p>
                {/* 3D Sides */}
                <div
                  className="absolute right-[-10px] top-[10px] w-[10px] h-full bg-on-surface/20 origin-left"
                  style={{ transform: 'rotateY(90deg)' }}
                />
                <div
                  className="absolute bottom-[-10px] left-[10px] w-full h-[10px] bg-on-surface/10 origin-top"
                  style={{ transform: 'rotateX(-90deg)' }}
                />
              </motion.div>
            ))}
          </div>

          {/* Right: Content Reveal */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 10 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="brutal-border bg-on-surface text-surface p-8 md:p-12 hard-shadow-gold min-h-[500px]"
              >
                <div className="flex justify-between items-center mb-12 border-b-2 border-surface/20 pb-6">
                  <h4 className="text-4xl font-black uppercase italic">
                    DAY {activeDay} <span className="text-primary-container">Itinerary</span>
                  </h4>
                  <div className="flex items-center gap-2 px-3 py-1 brutal-border bg-surface text-on-surface font-black text-xs uppercase">
                    <Clock className="w-4 h-4" /> Live
                  </div>
                </div>

                <div className="space-y-6">
                  {scheduleData.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`
                        p-6 brutal-border group transition-all
                        ${item.isBreak ? 'bg-surface/5 border-dashed opacity-60' : 'bg-surface/10 hover:bg-surface/20 hover:translate-x-2'}
                      `}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 brutal-border bg-primary-container flex items-center justify-center text-on-primary-container group-hover:rotate-12 transition-transform">
                            <span className="font-black">{`0${i + 1}`}</span>
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-primary-container mb-1">{item.time}</p>
                            <h5 className="text-xl font-bold uppercase tracking-tight">
                              {activeDay === 1 ? item.day1 : item.day2}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                          <MapPin className="w-3 h-3 text-primary-container" />
                          {activeDay === 1 ? item.day1Venue || 'Venue TBA' : item.day2Venue || 'Venue TBA'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right z-0" />
    </section>
  );
}

