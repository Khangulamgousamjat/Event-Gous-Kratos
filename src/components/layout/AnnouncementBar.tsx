import React from 'react';
import { db } from '@/db';

const AnnouncementBar = async () => {
  let message = '🚀 Registrations Open — KRATOS 2026 on 27–28 April | Register before evening of 26 April';

  try {
    const snap = await db.collection('announcements')
      .where('isActive', '==', true)
      .get();
    const activeAnnouncements = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
    
    // Sort in-memory: updatedAt desc
    activeAnnouncements.sort((a: any, b: any) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

    if (activeAnnouncements.length > 0) {
      message = activeAnnouncements[0].content;
    }
  } catch (error) {
    console.warn('Failed to load announcements from Firestore during pre-render:', error);
  }

  return (
    <div className="bg-on-surface text-primary-container py-1 overflow-hidden border-b-2 border-primary-container relative z-40">
      <div className="flex whitespace-nowrap animate-marquee px-6">
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} • {message} • {message}
        </span>
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} • {message} • {message}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
