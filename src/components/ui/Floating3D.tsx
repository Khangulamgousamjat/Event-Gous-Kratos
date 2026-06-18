'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Floating3DProps {
  type?: 'cube' | 'pyramid' | 'grid';
  size?: number;
  className?: string;
  delay?: number;
}

const Floating3D = ({ type = 'cube', size = 100, className = '', delay = 0 }: Floating3DProps) => {
  if (type === 'cube') {
    return (
      <div 
        className={`relative ${className}`} 
        style={{ 
          width: size, 
          height: size, 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 180, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: delay
          }}
        >
          {/* Cube Faces */}
          {[
            { transform: `translateZ(${size/2}px)`, bg: 'bg-primary-container/40' },
            { transform: `rotateY(180deg) translateZ(${size/2}px)`, bg: 'bg-primary/20' },
            { transform: `rotateY(90deg) translateZ(${size/2}px)`, bg: 'bg-primary-container/60' },
            { transform: `rotateY(-90deg) translateZ(${size/2}px)`, bg: 'bg-primary/40' },
            { transform: `rotateX(90deg) translateZ(${size/2}px)`, bg: 'bg-primary-container/30' },
            { transform: `rotateX(-90deg) translateZ(${size/2}px)`, bg: 'bg-primary/50' },
          ].map((face, i) => (
            <div 
              key={i}
              className={`absolute inset-0 border-2 border-on-surface/20 ${face.bg} backdrop-blur-[2px]`}
              style={{ transform: face.transform }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (type === 'pyramid') {
     const h = size;
     const w = size;
     return (
        <div 
          className={`relative ${className}`} 
          style={{ 
            width: w, 
            height: h, 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateY: [0, 360],
              y: [0, -15, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay
            }}
          >
            {/* Pyramid Base */}
            <div 
              className="absolute inset-0 bg-primary/20 border-2 border-on-surface/20"
              style={{ transform: `rotateX(90deg) translateZ(${-h/2}px)` }}
            />
            {/* Pyramid Sides */}
            {[0, 90, 180, 270].map((angle, i) => (
              <div 
                key={i}
                className="absolute inset-0 bg-primary-container/40 border-2 border-on-surface/20"
                style={{ 
                  transform: `rotateY(${angle}deg) rotateX(30deg) translateZ(${w/4}px)`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transformOrigin: 'bottom'
                }}
              />
            ))}
          </motion.div>
        </div>
     );
  }

  if (type === 'grid') {
     return (
        <div className={`relative overflow-hidden pointer-events-none ${className}`} style={{ perspective: '1000px' }}>
            <motion.div 
               className="w-[200%] h-[200%] border-[1px] border-primary/10"
               style={{ 
                  backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  transform: 'rotateX(60deg) translateY(-20%)',
                  transformOrigin: 'top'
               }}
               animate={{
                  translateY: ['-20%', '-40%']
               }}
               transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
               }}
            />
        </div>
     )
  }

  return null;
};

export default Floating3D;
