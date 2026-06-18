'use client';

import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import Floating3D from '@/components/ui/Floating3D';
import { motion } from 'framer-motion';
import { Users, GraduationCap } from 'lucide-react';

const TEAM_DATA = {
  faculty: [
    { name: 'Faculty Advisors To Be Announced', role: 'Faculty Coordination Team', dept: 'MPGI School of Engineering' },
  ],
  students: [
    { name: 'Final Student Core Team Pending Approval', role: 'Student Department', year: 'Roster Updates Soon' },
  ],
  developers: [
    { name: 'Rahil Hussain', role: 'Frontend Developer', LinkedIn: 'https://www.linkedin.com/in/shaikh-rahil-hussain-a54348291' },
    { name: 'Pranav Birhade', role: 'Backend Developer', github: 'https://github.com/PRANAVBIRHADE' },
  ]
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-container-low pb-24 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <Floating3D type="cube" size={200} className="absolute -top-10 -right-20" delay={1} />
        <Floating3D type="cube" size={100} className="absolute top-[40%] -left-10" delay={3} />
        <Floating3D type="grid" className="absolute bottom-0 w-full h-[30%]" />
      </div>

      {/* Hero Section */}
      <section className="bg-on-surface text-surface py-16 md:py-24 px-4 md:px-6 border-b-8 border-primary-container relative z-10 transition-colors">
        <div className="max-w-[1440px] mx-auto">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-primary-container text-base md:text-lg mb-4 block"
          >
            [ TEAM_DATABASE_V1.0 ]
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-6 md:mb-8"
          >
            MEET THE <br />
            <span className="text-primary-container">TEAM</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl text-base md:text-xl font-display opacity-80 leading-relaxed uppercase"
          >
            The people working behind the scenes to make KRATOS 2026 a success.
          </motion.p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 mt-12 md:mt-20 space-y-20 md:space-y-32">

        {/* Faculty Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-primary flex-shrink-0" />
              <h2 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter">FACULTY ADVISORS</h2>
            </div>
            <div className="w-full h-2 bg-on-surface"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM_DATA.faculty.map((member, i) => (
              <BrutalCard key={i} className="flex flex-col justify-between" onClick={() => { }}>
                <div>
                  <h3 className="text-xl md:text-3xl font-black uppercase mb-2">{member.name}</h3>
                  <p className="text-primary font-bold uppercase tracking-widest text-sm">{member.role}</p>
                </div>
                <div className="mt-6 pt-6 border-t-2 border-on-surface/10">
                  <span className="font-mono text-sm opacity-60">DEPT: {member.dept}</span>
                </div>
              </BrutalCard>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 md:w-12 md:h-12 text-primary flex-shrink-0" />
              <h2 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter">STUDENT TEAM</h2>
            </div>
            <div className="w-full h-2 bg-on-surface"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_DATA.students.map((member, i) => (
              <BrutalCard key={i} shadowColor="gold" className="hover:bg-primary-container/20 transition-colors" onClick={() => { }}>
                <h3 className="text-lg md:text-xl font-black uppercase mb-1">{member.name}</h3>
                <p className="text-xs font-bold uppercase opacity-60 mb-4">{member.role}</p>
                <div className="bg-on-surface text-surface text-[10px] px-2 py-0.5 inline-block font-black uppercase italic">
                  {member.year}
                </div>
              </BrutalCard>
            ))}
          </div>
        </motion.section>

        {/* Developer Wing */}
        <section id="developers" className="bg-on-surface p-6 md:p-12 brutal-border shadow-[12px_12px_0px_0px_var(--primary-container)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <h2 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter text-surface leading-none">
                OUR <br />
                <span className="text-primary-container">DEVELOPERS</span>
              </h2>
              <p className="text-surface/60 mt-4 max-w-xl font-mono uppercase text-xs md:text-sm">
                Built with modern tech to make registration and event management easy for everyone.
              </p>
            </div>
            <div className="bg-surface/5 p-4 md:p-6 border-2 border-surface/20 font-mono text-xs text-primary-container space-y-2">
              <p>{'>'} STACK: NEXT.JS + TAILWIND + NEON_POSTGRES</p>
              <p>{'>'} STATUS: SYSTEM_ONLINE</p>
              <p>{'>'} BUILD: v1.0.26_STABLE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {TEAM_DATA.developers.map((dev, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-primary-container/20 translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-all"></div>
                <div className="relative bg-surface p-5 md:p-8 border-4 border-on-surface">
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-on-surface mb-2">{dev.name}</h3>
                  <p className="font-display font-bold text-primary italic uppercase tracking-widest text-sm md:text-lg mb-4 md:mb-6">{dev.role}</p>
                  {(dev.LinkedIn ?? dev.github) && (
                    <Link href={(dev.LinkedIn ?? dev.github)!}>
                      <BrutalButton size="sm" variant="outline" className="w-full md:w-auto">
                        View Protocol
                      </BrutalButton>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 md:py-20">
          <h3 className="text-2xl md:text-4xl font-black uppercase italic mb-8">WANT TO JOIN THE RESERVE TEAM?</h3>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/contact">
              <BrutalButton size="xl" className="px-12">Contact Command</BrutalButton>
            </Link>
            <Link href="/">
              <BrutalButton size="xl" variant="outline" className="px-12">Back to HQ</BrutalButton>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
