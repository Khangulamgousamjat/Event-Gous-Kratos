import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';

const CTA = () => {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-on-surface text-surface overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <div className="w-full h-full brutal-border border-surface transform rotate-12 translate-x-20"></div>
      </div>
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-4 md:mb-8 leading-none">
          READY TO <br /><span className="text-primary-container">COMPETE?</span>
        </h2>
        <p className="text-lg md:text-2xl font-sans max-w-2xl mx-auto mb-8 md:mb-12 opacity-80">
          Registrations are now open. Choose your events, form your team, and be part of KRATOS 2026. Limited time to register.
        </p>
        <div className="flex justify-center">
          <Link href="/register">
            <BrutalButton size="xl" className="hard-shadow-gold hover:shadow-[10px_10px_0px_0px_var(--primary-container)]">
              Register
            </BrutalButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
