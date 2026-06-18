'use client';

import React, { useState, useEffect, useRef } from 'react';
import CinematicGate from '@/components/ui/CinematicGate';
import { motion } from 'framer-motion';

const SINGLE_SONG = '/audio/song1.mp3';
const SONG_DURATION = 180;

export default function CinematicProviders() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolume] = useState(0.4);

  // Initialize volume
  useEffect(() => {
    const savedVolume = localStorage.getItem('kratos_volume');
    if (savedVolume !== null) setVolume(parseFloat(savedVolume));
  }, []);

  // Sync volume to audio tag
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem('kratos_volume', volume.toString());
  }, [volume]);

  // Pre-buffer song on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = SINGLE_SONG;
      audioRef.current.load();
    }
  }, []);

  const handleEnter = () => {
    if (audioRef.current) {
      setHasStarted(true);
      
      // Calculate global sync position instantly
      const now = Math.floor(Date.now() / 1000);
      const duration = audioRef.current.duration || SONG_DURATION;
      const trackOffset = now % duration;
      
      audioRef.current.currentTime = trackOffset;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  // Keep synced every 10 seconds
  useEffect(() => {
    if (!hasStarted) return;
    
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const now = Math.floor(Date.now() / 1000);
        const duration = audioRef.current.duration || SONG_DURATION;
        const trackOffset = now % duration;
        
        if (Math.abs(audioRef.current.currentTime - trackOffset) > 5) {
          audioRef.current.currentTime = trackOffset;
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <>
      <audio ref={audioRef} loop style={{ display: 'none' }} />
      
      <CinematicGate onEnter={handleEnter} />

      {/* Top Right HUD - only visible after entering */}
      {hasStarted && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '80px',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 20, 8, 24, 12, 4], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8 + (i * 0.1), repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: '3px', background: '#00ffff', borderRadius: '2px', boxShadow: '0 0 10px #00ffffaa' }}
                />
              ))}
            </div>
            <div style={{ color: '#00ffff', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.6 }}>
              Kratos_Audio_Feed
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,0,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(0,255,255,0.2)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="2" style={{ opacity: 0.6 }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <input
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '80px', height: '2px', appearance: 'none', background: 'rgba(0,255,255,0.2)', outline: 'none', cursor: 'pointer' }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
