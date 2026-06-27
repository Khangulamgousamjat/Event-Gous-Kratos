import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import { db } from '@/db';
import Image from 'next/image';

export default async function Gallery() {
  const settingsDoc = await db.collection('systemSettings').doc('1').get();
  const isGalleryLocked = settingsDoc.exists ? (settingsDoc.data() as any).isGalleryLocked ?? true : true;

  const photosSnap = await db.collection('galleryPhotos').get();
  const rawPhotos = photosSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
  
  // Sort in-memory: createdAt desc
  rawPhotos.sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const uids = Array.from(new Set(rawPhotos.map((p: any) => p.userId).filter(Boolean)));
  const usersMap: Record<string, any> = {};
  if (uids.length > 0) {
    const userSnaps = await Promise.all(
      uids.map((uid: any) => db.collection('users').doc(uid).get())
    );
    userSnaps.forEach((snap: any) => {
      if (snap.exists) {
        usersMap[snap.id] = snap.data();
      }
    });
  }

  const photos = rawPhotos.map((photo: any) => {
    const user = usersMap[photo.userId] || {};
    return {
      id: photo.id,
      imageUrl: photo.imageUrl,
      uploaderName: user.name || 'Unknown User',
    };
  });

  return (
    <section id="gallery" className="py-24 bg-surface-container-low border-t-4 border-on-surface">
      <div className="px-6 max-w-[1440px] mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-5xl font-black uppercase italic mb-4 tracking-tighter">Memory Core</h2>
          <div className="h-2 w-32 bg-primary-container brutal-border"></div>
          <p className="font-display font-bold text-primary tracking-[0.3em] uppercase text-xs mt-6">Captured Participant Visuals // 2026</p>
        </div>

        {isGalleryLocked ? (
          <BrutalCard className="border-4 border-red-600 bg-red-50 relative overflow-hidden text-center py-24 shadow-[12px_12px_0px_0px_#dc2626] transform-gpu transition-transform hover:-translate-y-2 mx-auto max-w-5xl group">
            <span className="material-symbols-outlined text-[300px] md:text-[500px] text-red-600 opacity-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-[2s]">lock</span>
            <div className="relative z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-red-600 mb-6 animate-pulse">encrypted</span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-red-900 mb-6 leading-none">GALLERY LOCKED UNTIL END OF KRATOS</h3>
              <div className="h-1 w-24 bg-red-600 mb-8"></div>
              <p className="text-sm md:text-lg font-bold uppercase text-red-800 opacity-80 max-w-2xl mx-auto tracking-widest leading-relaxed">
                Optical archives are currently restricted. Full public access to all participant uploads will automatically launch immediately upon festival conclusion.
              </p>
            </div>
          </BrutalCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {photos.length === 0 ? (
               <div className="col-span-full text-center py-24 border-4 border-dashed border-on-surface/20 bg-surface">
                 <span className="material-symbols-outlined text-6xl opacity-30 block mb-4">image_not_supported</span>
                 <p className="font-display font-black uppercase text-xl opacity-40 tracking-widest">No Memories Extracted Yet</p>
                 <p className="font-bold opacity-30 uppercase text-xs mt-2 tracking-widest">Awaiting user transmissions...</p>
               </div>
            ) : (
              photos.map((photo: any) => (
                <BrutalCard key={photo.id} className="p-0 border-4 border-on-surface flex flex-col group overflow-hidden" shadowColor="black">
                  <div className="relative aspect-square w-full border-b-4 border-on-surface">
                    <Image 
                      src={photo.imageUrl} 
                      alt="Kratos Event Memory" 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700" 
                    />
                    {/* Retro Glitch Overlay on Hover */}
                    <div className="absolute inset-0 bg-primary/20 mix-blend-color-burn opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                  </div>
                  <div className="p-4 bg-surface text-on-surface flex justify-between items-center z-20 relative">
                    <div className="flex items-center gap-3 w-full">
                       <span className="material-symbols-outlined text-sm opacity-50 block">photo_camera</span>
                       <h3 className="font-display font-black uppercase text-xs tracking-[0.2em] truncate relative top-[1px]">{photo.uploaderName}</h3>
                    </div>
                  </div>
                </BrutalCard>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
