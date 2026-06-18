'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  shadowColor?: 'black' | 'gold';
  onClick?: () => void;
}

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BrutalCard = ({ 
  children, 
  className, 
  shadow = true, 
  shadowColor = 'black',
  onClick 
}: BrutalCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gleamX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const gleamY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02, rotateX: -5, rotateY: 5 } : { scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-surface brutal-border p-8 relative overflow-hidden group",
        shadow && shadowColor === 'black' && "hard-shadow",
        shadow && shadowColor === 'gold' && "hard-shadow-gold",
        onClick && "cursor-pointer transition-all tactile-click",
        className
      )}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [gleamX, gleamY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,209,0,0.15), transparent 40%)`
          )
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default BrutalCard;
