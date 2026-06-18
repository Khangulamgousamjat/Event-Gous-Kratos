'use client';

import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { deleteEvent } from '@/lib/actions';
import { Edit2, Trash2, MapPin, Users, Ticket, Calendar } from 'lucide-react';
import EventEditModal from './EventEditModal';

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

interface EventManagementClientProps {
  initialEvents: Event[];
}

export default function EventManagementClient({ initialEvents }: EventManagementClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <BrutalCard className="p-0 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse">
            <thead className="bg-[#1A1C1C] text-white border-b-4 border-black text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-6">Registry Entry</th>
                <th className="p-6">Structural Specs</th>
                <th className="p-6">Logistics</th>
                <th className="p-6">Priority</th>
                <th className="p-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {initialEvents.map((event) => (
                <tr key={event.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                        {event.category || 'GENERAL'}
                      </span>
                      <p className="font-black uppercase text-2xl tracking-tighter leading-none italic group-hover:text-primary transition-colors">
                        {event.name}
                      </p>
                      <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter mt-1">
                        ID: {event.id}
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <Ticket size={14} className="opacity-40" />
                         <span className="text-sm font-bold">₹{event.fee}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Users size={14} className="opacity-40" />
                         <span className="text-xs font-bold uppercase tracking-tight">
                           {event.teamSizeMin === event.teamSize 
                             ? `${event.teamSize} Member(s)` 
                             : `${event.teamSizeMin}-${event.teamSize} Members`}
                         </span>
                       </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <MapPin size={14} className="opacity-40" />
                         <span className="text-xs font-bold uppercase truncate max-w-[150px]">
                           {event.venue || 'TBD'}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Calendar size={14} className="opacity-40" />
                         <span className="text-xs font-bold uppercase">
                           {event.schedule || 'TBD'}
                         </span>
                       </div>
                    </div>
                  </td>
                  
                  <td className="p-6 text-center">
                    <span className="bg-black text-white px-2 py-1 text-xs font-mono brutal-border">
                      P: {event.sortOrder || 0}
                    </span>
                  </td>

                  <td className="p-6">
                    <div className="flex justify-end gap-3">
                      <BrutalButton 
                        size="sm" 
                        variant="primary"
                        onClick={() => handleEdit(event)}
                        className="bg-blue-400 hover:bg-blue-500 text-black border-2"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit Packet
                      </BrutalButton>
                      
                      <form action={deleteEvent} onSubmit={(e) => {
                        if (!confirm('CRITICAL ACTION: This will purge all registration data for this event. Proceed?')) {
                          e.preventDefault();
                        }
                      }}>
                        <input type="hidden" name="id" value={event.id} />
                        <BrutalButton 
                          type="submit" 
                          variant="secondary" 
                          size="sm" 
                          className="bg-red-400 hover:bg-red-500 text-black border-2"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Purge
                        </BrutalButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrutalCard>

      {selectedEvent && (
        <EventEditModal 
          event={selectedEvent} 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }} 
        />
      )}
    </>
  );
}
