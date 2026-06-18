'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-on-surface bg-[#FEFCE8] text-on-surface mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
        
        {/* ── COLUMN 1: BRAND & ADDRESS ── */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">KRATOS 2K26</h3>
          <div className="space-y-4 text-sm font-sans leading-relaxed opacity-80 max-w-sm">
            <p className="font-bold">
              Matoshri Pratishthan Group of Institutions, School of Engineering, Nanded
            </p>
            <p>
              Jijau Nagar, Off Nanded-Latur Highway, Khupsarwadi, Post Vishnupuri, Nanded, Maharashtra 431606
            </p>
          </div>
        </div>

        {/* ── COLUMN 2: CONTACT ── */}
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">
            CONTACT
          </p>
          <div className="space-y-3 font-sans text-sm font-bold">
            <p className="hover:text-primary transition-colors cursor-pointer">+91 9834147160</p>
            <p className="hover:text-primary transition-colors cursor-pointer underline decoration-1 underline-offset-4">kratos2k26.mpgi@gmail.com</p>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact Page
            </Link>
          </div>
        </div>

        {/* ── COLUMN 3: LINKS ── */}
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">
            LINKS
          </p>
          <nav className="flex flex-col gap-3 font-sans text-sm font-bold">
            <Link href="https://mpgi.ac.in/" className="hover:text-primary transition-colors">Official Website</Link>
            <Link href="https://mpgi.ac.in/school-of-engineering/" className="hover:text-primary transition-colors">School of Engineering</Link>
            <Link href="mailto:kratos2k26.mpgi@gmail.com" className="hover:text-primary transition-colors">Email</Link>
            <Link href="tel:+919834147160" className="hover:text-primary transition-colors">Call</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
