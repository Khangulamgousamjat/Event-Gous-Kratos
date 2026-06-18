'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CinematicGate = ({ onEnter }: { onEnter: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState('AUTHORIZATION_REQUIRED');

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      setStatus('SCANNING_BIOMETRICS...');
      await new Promise(r => setTimeout(r, 1200));
      setStatus('NEURAL_LINK_READY');
    };
    sequence();
  }, []);

  const handleEnter = () => {
    onEnter();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200000,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Scanning Line Animation */}
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'rgba(0,255,255,0.2)',
              boxShadow: '0 0 20px rgba(0,255,255,0.5)',
              zIndex: 5
            }}
          />

          <div style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 style={{
                fontSize: '12px',
                color: '#00ffff',
                letterSpacing: '1em',
                textTransform: 'uppercase',
                margin: '0 0 40px 0',
                fontWeight: 900,
                opacity: 0.5
              }}>
                {status}
              </h1>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <h2 style={{
                  fontSize: 'clamp(40px, 10vw, 120px)',
                  color: '#fff',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: 0,
                  lineHeight: 1
                }}>
                  KRATOS
                </h2>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-20px',
                  background: '#ff00ff',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '2px 8px',
                  fontWeight: 900,
                  letterSpacing: '2px'
                }}>2027</div>
              </div>

              <div style={{ marginTop: '60px' }}>
                <motion.button
                  whileHover={{ scale: 1.05, background: '#00ffff', color: '#000' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnter}
                  style={{
                    background: 'transparent',
                    border: '2px solid #00ffff',
                    color: '#00ffff',
                    padding: '16px 40px',
                    fontSize: '14px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Enter_Multiverse
                </motion.button>
              </div>

              <p style={{
                marginTop: '40px',
                color: 'rgba(0,255,255,0.3)',
                fontSize: '9px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                maxWidth: '300px',
                margin: '40px auto 0'
              }}>
                Establishing High-Fidelity Audio Stream // Synchronizing Temporal Buffers
              </p>
            </motion.div>
          </div>

          {/* Background Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(0,255,255,0.05) 0%, transparent 70%), linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 50px 50px, 50px 50px',
            pointerEvents: 'none'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicGate;
