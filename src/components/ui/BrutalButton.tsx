'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // I'll need to create this helper

interface BrutalButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BrutalButton = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: BrutalButtonProps) => {
  const variants = {
    primary: 'bg-primary-container text-on-primary-container hard-shadow-gold',
    secondary: 'bg-secondary-container text-foreground hard-shadow',
    outline: 'bg-surface text-foreground',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-4 text-xl',
    xl: 'px-16 py-6 text-2xl',
  };

  return (
    <motion.button
      whileHover={{ y: -4, x: -4, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      whileTap={{ scale: 0.98, x: 2, y: 2, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
      className={cn(
        'brutal-border font-display font-black uppercase tracking-tight transition-all',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default BrutalButton;
