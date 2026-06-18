'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountdownTimer from '@/components/marketing/CountdownTimer';
import BrutalButton from '@/components/ui/BrutalButton';

type HeroProps = {
  heroImage?: string | null;
};

const Hero = ({ heroImage }: HeroProps) => {
  return (
    <section className="relative px-6 py-10 md:py-16 max-w-[1440px] mx-auto overflow-visible">
      <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, x: -60 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.15,
              },
            },
          }}
          className="w-full md:w-[60%] flex flex-col"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="flex items-center gap-3 mb-6"
          >
            <Image
              src="/branding/college-logo.png"
              alt="MPGI Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain brutal-border p-0.5 bg-white transition-transform hover:scale-110 duration-300"
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-tight">
                Matoshri Pratishthan Group of Institutions
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 leading-tight">
                School of Engineering, Nanded
              </p>
            </div>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            className="font-display font-black uppercase leading-[0.85] tracking-tighter mb-6"
            style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}
          >
            KRATOS
            <br />
            <span className="text-primary-container">2K26</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            className="text-base md:text-lg font-sans max-w-lg mb-8 border-l-4 border-on-surface pl-5 leading-relaxed text-on-surface/80"
          >
            Join two days of student events, team competitions, and technical showcases at MPGI SOE Nanded.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
            className="grid grid-cols-3 gap-0 brutal-border mb-8 bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="p-4 border-r-2 border-on-surface hover:bg-secondary-container transition-colors duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/50 mb-1">Dates</p>
              <p className="font-display font-black uppercase text-sm md:text-base leading-tight">27 - 28 April 2026</p>
            </div>
            <div className="p-4 border-r-2 border-on-surface hover:bg-secondary-container transition-colors duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/50 mb-1">Venue</p>
              <p className="font-display font-black uppercase text-sm md:text-base leading-tight">Main Engineering Campus</p>
            </div>
            <div className="p-4 hover:bg-secondary-container transition-colors duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/50 mb-1">Open For</p>
              <p className="font-display font-black uppercase text-sm md:text-base leading-tight">All Branches</p>
            </div>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-8 w-fit"
          >
            <CountdownTimer />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/register">
              <BrutalButton size="lg" className="hard-shadow-gold">
                Register
              </BrutalButton>
            </Link>
            <Link href="/#events">
              <BrutalButton
                size="lg"
                variant="outline"
                className="border-2 border-on-surface hover:bg-surface-container-low"
              >
                View All Events
              </BrutalButton>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8, x: 40 }}
          animate={{ opacity: 1, scale: 1, rotate: 3, x: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-[40%] relative flex justify-center md:justify-end mt-8 md:mt-0"
        >
          <div className="brutal-border hard-shadow-gold bg-on-surface w-full md:w-[420px] h-56 md:h-96 overflow-hidden">
            <Image
              src={heroImage || '/event-card.png'}
              alt="MPGI Campus"
              width={420}
              height={384}
              className="w-full h-full object-cover md:object-contain hover:scale-105 transition-transform duration-700 bg-white"
            />
          </div>
          <div className="absolute -bottom-5 -left-4 brutal-border bg-primary-container p-4 md:p-5 hidden md:block hard-shadow">
            <p className="font-display font-black text-3xl md:text-4xl leading-none underline decoration-4">
              02<br />DAYS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
