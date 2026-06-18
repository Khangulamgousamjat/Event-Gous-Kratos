'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type AboutSectionProps = {
  img1?: string | null;
  img2?: string | null;
  img3?: string | null;
};

const AboutSection = ({ img1, img2, img3 }: AboutSectionProps) => {
  return (
    <section id="about" className="py-20 px-6 max-w-[1440px] mx-auto bg-[#FEFCE8] overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
      >
        {/* Left Content */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="w-full lg:w-[55%] flex flex-col"
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="text-[12px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4"
          >
            ABOUT KRATOS 2K26
          </motion.p>

          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-8 max-w-2xl"
          >
            STUDENT-FRIENDLY
            <br />
            FESTIVAL EXPERIENCE
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-base md:text-lg font-sans text-on-surface/70 leading-relaxed mb-12 max-w-xl"
          >
            Matoshri Pratishthan Group of Institutions brings students together for hands-on learning,
            competition, and collaboration. KRATOS 2K26 is designed to make registration, team building,
            and event-day planning simple for everyone.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 brutal-border mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
          >
            <div className="p-6 border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-on-surface hover:bg-secondary-container transition-colors duration-300">
              <h3 className="text-sm font-black uppercase mb-4 tracking-tight">ABOUT THE COLLEGE</h3>
              <p className="text-[11px] font-bold opacity-60 leading-relaxed">
                Matoshri Pratishthan Group of Institutions brings together technical education, practical
                learning, and industry-focused training for students in Nanded.
              </p>
            </div>

            <div className="p-6 border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-on-surface hover:bg-secondary-container transition-colors duration-300">
              <h3 className="text-sm font-black uppercase mb-4 tracking-tight">WHY KRATOS</h3>
              <p className="text-[11px] font-bold opacity-60 leading-relaxed">
                KRATOS is the annual student technical festival where classroom ideas turn into live
                competitions, team projects, and real event-day experience.
              </p>
            </div>

            <div className="p-6 hover:bg-secondary-container transition-colors duration-300">
              <h3 className="text-sm font-black uppercase mb-4 tracking-tight">OPEN FOR EVERYONE</h3>
              <p className="text-[11px] font-bold opacity-60 leading-relaxed">
                All events are open to students from all branches.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
            className="w-full brutal-border bg-[#FDE68A] p-4 font-display font-black text-xs md:text-sm uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all cursor-default"
          >
            Affiliated to Dr. Babasaheb Ambedkar Technological University, Lonere.
          </motion.div>
        </motion.div>

        {/* Right Gallery Collage */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9, rotate: -5 },
            visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="w-full lg:w-[45%] flex flex-col gap-4"
        >
          <div className="w-full aspect-[16/9] brutal-border bg-on-surface/5 overflow-hidden relative hard-shadow-gold">
            {img1 ? (
              <Image
                src={img1}
                alt="Kratos Experience"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="material-symbols-outlined text-4xl opacity-20">image</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] brutal-border bg-on-surface/5 overflow-hidden relative shadow-md">
              {img2 ? (
                <Image
                  src={img2}
                  alt="Kratos Focus"
                  fill
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="object-cover transition-transform hover:scale-105 duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                </div>
              )}
            </div>

            <div className="aspect-[4/5] brutal-border bg-on-surface/5 overflow-hidden relative shadow-md">
              {img3 ? (
                <Image
                  src={img3}
                  alt="Kratos Event"
                  fill
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="object-cover transition-transform hover:scale-105 duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
