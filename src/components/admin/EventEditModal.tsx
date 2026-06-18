'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalInput from '@/components/ui/BrutalInput';
import { updateEvent } from '@/lib/actions';

interface Event {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  tagline: string | null;
  description: string | null;
  fee: number;
  schedule: string | null;
  venue: string | null;
  format: string | null;
  isCommon: boolean | null;
  teamSize: number | null;
  teamSizeMin: number | null;
  expectedParticipants: number | null;
  prizeDetails: string | null;
  sortOrder: number | null;
}

interface EventEditModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventEditModal({ event, isOpen, onClose }: EventEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateEvent(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-surface brutal-border shadow-[12px_12px_0px_0px_var(--primary-container)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b-4 border-on-surface bg-primary-container/20 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Edit Event Packet</h2>
                <p className="text-[10px] font-mono opacity-60">UUID: {event.id}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center brutal-border bg-surface hover:bg-red-100 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <form action={handleSubmit} id="edit-event-form" className="space-y-8">
                <input type="hidden" name="id" value={event.id} />
                
                {error && (
                  <div className="p-4 bg-red-100 border-2 border-red-800 text-red-800 flex items-center gap-3 font-bold uppercase text-xs">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h3 className="font-black uppercase tracking-widest text-xs opacity-40 border-b-2 border-on-surface/10 pb-2">Core Registry</h3>
                    
                    <BrutalInput 
                      label="Event Name" 
                      name="name" 
                      defaultValue={event.name} 
                      required 
                      placeholder="e.g. CODE RELAY"
                    />
                    
                    <BrutalInput 
                      label="Tagline" 
                      name="tagline" 
                      defaultValue={event.tagline || ''} 
                      placeholder="A short catchy hook..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <BrutalInput 
                        label="Category" 
                        name="category" 
                        defaultValue={event.category || ''} 
                        placeholder="TECH, CULTURAL etc."
                      />
                      <BrutalInput 
                        label="Venue" 
                        name="venue" 
                        defaultValue={event.venue || ''} 
                        placeholder="Lab 101, Ground etc."
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <label className="block text-sm font-display font-bold uppercase tracking-widest text-on-surface">Description</label>
                      <textarea
                        name="description"
                        defaultValue={event.description || ''}
                        className="w-full px-4 py-3 bg-white brutal-border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[120px] font-sans"
                        placeholder="Detailed event rules and itinerary..."
                      />
                    </div>
                  </div>

                  {/* Operational Parameters */}
                  <div className="space-y-6">
                    <h3 className="font-black uppercase tracking-widest text-xs opacity-40 border-b-2 border-on-surface/10 pb-2">Operational Logic</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <BrutalInput 
                        label="Fee (₹)" 
                        name="fee" 
                        type="number" 
                        defaultValue={event.fee} 
                        required 
                      />
                      <BrutalInput 
                        label="Max Capacity" 
                        name="expectedParticipants" 
                        type="number" 
                        defaultValue={event.expectedParticipants || ''} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <BrutalInput 
                        label="Min Team" 
                        name="teamSizeMin" 
                        type="number" 
                        defaultValue={event.teamSizeMin || 1} 
                        min={1} 
                        max={4}
                      />
                      <BrutalInput 
                        label="Max Team" 
                        name="teamSize" 
                        type="number" 
                        defaultValue={event.teamSize || 1} 
                        min={1} 
                        max={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-display font-bold uppercase tracking-widest text-on-surface">Format</label>
                        <select 
                          name="format" 
                          defaultValue={event.format || 'SOLO'}
                          className="w-full px-4 py-3 bg-white brutal-border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold"
                        >
                          <option value="SOLO">SOLO</option>
                          <option value="TEAM">TEAM</option>
                          <option value="DUO">DUO</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-4 h-full pt-8">
                         <input 
                           type="checkbox" 
                           name="isCommon" 
                           id="isCommon" 
                           defaultChecked={event.isCommon || false}
                           className="w-6 h-6 brutal-border bg-white checked:bg-primary accent-primary cursor-pointer"
                         />
                         <label htmlFor="isCommon" className="text-xs font-black uppercase tracking-widest cursor-pointer">Common Event</label>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <label className="block text-sm font-display font-bold uppercase tracking-widest text-on-surface">Prize Details</label>
                      <input
                        name="prizeDetails"
                        defaultValue={event.prizeDetails || ''}
                        className="w-full px-4 py-3 bg-white brutal-border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold"
                        placeholder="₹5000 + Certificate etc."
                      />
                    </div>

                    <BrutalInput 
                      label="Schedule Time" 
                      name="schedule" 
                      defaultValue={event.schedule || ''} 
                      placeholder="e.g. Day 1, 10:00 AM"
                    />

                    <BrutalInput 
                      label="Priority / Sort Order (Higher = First)" 
                      name="sortOrder" 
                      type="number" 
                      defaultValue={event.sortOrder || 0} 
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t-4 border-on-surface flex justify-end gap-4 bg-surface-container-low">
              <BrutalButton 
                onClick={onClose} 
                variant="outline" 
                disabled={loading}
                className="bg-white"
              >
                Cancel
              </BrutalButton>
              <BrutalButton 
                form="edit-event-form" 
                type="submit" 
                disabled={loading}
                className="bg-primary text-on-primary min-w-[180px]"
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </BrutalButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
