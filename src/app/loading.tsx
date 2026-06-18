'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loading() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100000,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background Cinematic Particles (Simplified) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(0,255,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 10 }}
      >
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 100px)',
          fontWeight: 900,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          margin: 0,
          textShadow: '0 0 30px rgba(0,255,255,0.3)'
        }}>
          KRATOS <span style={{ color: '#00ffff' }}>2027</span>
        </h1>
        
        <div style={{ 
          marginTop: '10px',
          color: '#00ffff',
          fontSize: '10px',
          letterSpacing: '0.8em',
          textTransform: 'uppercase',
          opacity: 0.6,
          fontWeight: 900
        }}>
          NEURAL_LINK_ESTABLISHING...
        </div>

        {!hasStarted ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setHasStarted(true)}
            style={{
              marginTop: '50px',
              background: 'transparent',
              border: '1px solid #00ffff',
              color: '#00ffff',
              padding: '12px 30px',
              fontSize: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
          >
            Commence_Initiative
          </motion.button>
        ) : (
          <div style={{ marginTop: '50px' }}>
             <div style={{ 
               width: '200px', 
               height: '2px', 
               background: 'rgba(0,255,255,0.1)', 
               position: 'relative',
               overflow: 'hidden'
             }}>
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 style={{ 
                   position: 'absolute', 
                   inset: 0, 
                   background: 'linear-gradient(90deg, transparent, #00ffff, transparent)' 
                 }}
               />
             </div>
             <p style={{ color: '#00ffff', fontSize: '9px', marginTop: '10px', opacity: 0.5, letterSpacing: '2px' }}>
               SYNCING_BROADCAST_SIGNAL...
             </p>
          </div>
        )}
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
