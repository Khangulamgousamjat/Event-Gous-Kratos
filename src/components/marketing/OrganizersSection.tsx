'use client';

import React from 'react';
import { motion } from 'framer-motion';

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const OrganizersSection = () => {
  return (
    <section id="organizers" className="py-24 bg-[#FEFCE8] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">

        {/* ── HEADER ── */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4"
          >
            ORGANIZERS <span className="text-[#D4AF37]">KRATOS 2026</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-1.5 h-6 bg-[#D4AF37]"></div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              MEET THE PEOPLE HELPING RUN THE FESTIVAL
            </p>
          </motion.div>
        </div>

        {/* ── CARDS GRID ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* Card 1: Core Leadership */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: 2, 
              rotateY: -2,
              boxShadow: `0 0 40px rgba(0, 255, 255, 0.3)` 
            }}
            className="p-8 brutal-border bg-white hard-shadow-gold flex flex-col h-full min-h-[350px] transition-all hover:border-[#00ffff] group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[#00ffff] transition-opacity" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 block">
              CORE LEADERSHIP
            </span>
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-black uppercase mb-1 tracking-tight">DR L WAGHMARE</h3>
                <p className="text-xs font-bold opacity-60 uppercase mb-4 italic">HEAD OF THE INSTITUTE</p>
                <div className="space-y-1 font-mono text-[10px] font-bold opacity-70 leading-relaxed uppercase">
                  <p>lmwaghmare@yahoo.com</p>
                  <p>+91 9822663185</p>
                </div>
              </div>


            </div>
          </motion.div>

          {/* Card 2: Faculty Coordinators */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: 2, 
              rotateY: -2,
              boxShadow: `0 0 40px rgba(0, 255, 255, 0.3)` 
            }}
            className="p-8 brutal-border bg-white hard-shadow-gold flex flex-col h-full min-h-[350px] transition-all hover:border-[#00ffff] group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[#00ffff] transition-opacity" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 block">
              COORDINATION TEAM
            </span>
            <div className="space-y-8">


              <div className="pt-6 border-t border-on-surface/10">
                <h4 className="text-lg font-black uppercase leading-none">DR. ABDULLAH M.K</h4>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter mb-2">FACULTY COORDINATOR</p>
                <p className="text-[10px] font-mono opacity-80">+91 9076433185</p>
              </div>

              <div className="pt-6 border-t border-on-surface/10">
                <h4 className="text-lg font-black uppercase leading-none">MR. SHAIKH AJIJ</h4>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter mb-2">FACULTY COORDINATOR</p>
                <p className="text-[10px] font-mono opacity-80">+91 9112391234</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Technical Wing */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: 2, 
              rotateY: -2,
              boxShadow: `0 0 40px rgba(0, 255, 255, 0.3)` 
            }}
            className="p-8 brutal-border bg-white hard-shadow flex flex-col h-full min-h-[350px] transition-all hover:border-[#00ffff] group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[#00ffff] transition-opacity" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-8 block">
              TECHNICAL WING
            </span>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-black uppercase leading-none">GULAMGOUS KHAN</h3>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">FULL STACK DEVELOPER</p>
                <a
                  href="https://www.instagram.com/khn.vibes?igsh=MXkwZGIxeHQwZzBnNA=="
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-mono opacity-70 mt-3 hover:opacity-100 hover:text-[#D4AF37] transition-all lowercase"
                >
                  <InstagramIcon />
                  <span>@khn.vibes</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/gulamgous"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-mono opacity-70 mt-2 hover:opacity-100 hover:text-[#D4AF37] transition-all lowercase"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>gulamgous</span>
                </a>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <div className="bg-on-surface text-surface p-4 brutal-border">
                <p className="text-[10px] font-mono uppercase tracking-tighter leading-tight">
                  {">"} System Architected with Next.js 16 <br />
                  {">"} Protocol Version: 1.0.26_STABLE
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default OrganizersSection;
