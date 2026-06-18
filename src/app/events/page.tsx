import React from 'react';
import EventsGrid from '@/components/marketing/EventsGrid';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">
          Kratos 2026 / <span className="text-primary-container">All Events</span>
        </h1>
        <div className="brutal-border bg-surface-container-low p-1 mb-16">
          <EventsGrid />
        </div>
      </div>
    </main>
  );
}
