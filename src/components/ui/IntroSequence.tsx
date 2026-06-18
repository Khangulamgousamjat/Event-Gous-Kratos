'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroSequence() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Forces the loading animation to play on every hard refresh for 2 seconds
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-primary-container flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {mounted && (
            <div className="w-full max-w-2xl space-y-12 animate-in fade-in zoom-in duration-500">
              
              {/* Header Section */}
              <div className="text-center relative">
                <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4 text-on-surface">
                  KRATOS 2026
                </h1>
                <div className="h-4 bg-on-surface w-full mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"></div>
                <div className="flex justify-between items-center px-1 font-display font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface/80">
                  <span>Operational Mode</span>
                  <span className="animate-pulse">Initializing Terminal...</span>
                  <span>Precision Mandatory</span>
                </div>
              </div>

              {/* Brutalist Scanner Animation */}
              <div className="w-full border-8 border-on-surface bg-on-surface/5 h-32 overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-24 bg-on-surface opacity-20 animate-[scan_2s_linear_infinite]"></div>
                <div className="h-full bg-on-surface opacity-10 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="font-display font-black text-3xl md:text-5xl uppercase tracking-[0.4em] text-on-surface animate-pulse">
                     LOADING
                   </span>
                </div>
              </div>

              {/* Footer Logic Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['SYS_AUTH', 'DB_LINK', 'GEO_SCAN', 'UI_GEN'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 border-4 border-on-surface p-3 bg-surface">
                    <div className="w-3 h-3 bg-on-surface animate-ping"></div>
                    <span className="font-display font-black text-[10px] uppercase tracking-tighter">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <style jsx global>{`
            @keyframes scan {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(1000%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
