'use client';

import React, { useState, useTransition } from 'react';

import BrutalCard from '@/components/ui/BrutalCard';
import { CldUploadWidget } from 'next-cloudinary';
import { uploadGalleryPhoto, deleteGalleryPhoto } from '@/lib/actions';
import Image from 'next/image';

type GalleryUploadClientProps = {
  isLocked: boolean;
  photos: { id: string; imageUrl: string }[];
};

export default function GalleryUploadClient({ isLocked, photos }: GalleryUploadClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (isLocked) {
    return (
      <BrutalCard className="border-4 border-red-600 bg-red-50 relative overflow-hidden text-center py-12 shadow-[6px_6px_0px_0px_#dc2626]">
        <span className="material-symbols-outlined text-[80px] text-red-600 opacity-20 absolute -top-4 -left-4">lock</span>
        <h3 className="text-2xl font-black uppercase text-red-900 mb-2 relative z-10">MEMORY GALLERY LOCKED</h3>
        <p className="text-sm font-bold uppercase text-red-800 opacity-80 relative z-10 max-w-sm mx-auto">
          THIS FUNCTION OPENS AFTER THE END OF KRATOS 2026. CHECK BACK LATER TO UPLOAD YOUR PHOTOS.
        </p>
      </BrutalCard>
    );
  }

  const handleUploadSuccess = async (url: string) => {
    setError(null);
    const result = await uploadGalleryPhoto(url);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      setError(null);
      const result = await deleteGalleryPhoto(id);
      if (result.error) setError(result.error);
    });
  };

  const maxUploads = 4;
  const canUpload = photos.length < maxUploads;

  return (
    <BrutalCard shadow={true}>
      <div className="flex justify-between items-center mb-6 border-b-2 border-on-surface pb-4">
        <h2 className="text-2xl font-black uppercase italic">Memory Gallery</h2>
        <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-primary-container text-on-primary-container brutal-border">
          {photos.length} / {maxUploads} Uploaded
        </span>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 font-bold border-2 border-on-surface mb-6 text-xs uppercase">
          ERROR: {error}
        </div>
      )}

      {/* Grid of uploaded photos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square brutal-border overflow-hidden group">
              <Image 
                src={photo.imageUrl} 
                alt="Event Memory" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button 
                onClick={() => handleDelete(photo.id)}
                disabled={isPending}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 brutal-border hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Handler */}
      {canUpload ? (
        !uploadPreset ? (
          <div className="w-full text-center p-6 border-2 border-dashed border-red-600 bg-red-50">
            <p className="font-black uppercase tracking-widest text-red-700">Cloudinary upload preset is missing</p>
          </div>
        ) : (
        <CldUploadWidget 
          uploadPreset={uploadPreset}
          options={{
            maxFiles: 1,
            multiple: false,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          }}
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
               handleUploadSuccess(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button 
              onClick={() => open()}
              disabled={isPending}
              className="w-full border-4 border-dashed border-on-surface/30 bg-surface-container-low hover:bg-primary-container/20 hover:border-primary-container transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
                add_photo_alternate
              </span>
              <p className="font-display font-black uppercase text-lg tracking-widest">Add Optical Memory</p>
              <p className="text-xs font-bold uppercase opacity-60 mt-1">Select JPEG/PNG Format</p>
            </button>
          )}
        </CldUploadWidget>
        )
      ) : (
        <div className="w-full text-center p-6 border-2 border-dashed border-primary bg-primary/10">
          <p className="font-black uppercase tracking-widest text-primary">MAXIMUM CAPACITY REACHED</p>
        </div>
      )}
    </BrutalCard>
  );
}
