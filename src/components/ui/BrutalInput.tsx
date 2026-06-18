import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-display font-bold uppercase tracking-widest text-on-surface"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-white brutal-border outline-none transition-all",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            error ? "border-red-500" : "border-on-surface",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-red-500 uppercase italic">
            {error}
          </p>
        )}
      </div>
    );
  }
);

BrutalInput.displayName = 'BrutalInput';

export default BrutalInput;
