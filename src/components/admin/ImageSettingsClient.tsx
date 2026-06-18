'use client';

import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import { CldUploadWidget } from 'next-cloudinary';
import { updateSystemImage } from '@/lib/actions';
import Image from 'next/image';

type ImageField = 'heroImage' | 'aboutImage1' | 'aboutImage2' | 'aboutImage3';

type ImageSettingsClientProps = {
  images: {
    heroImage: string | null;
    aboutImage1: string | null;
    aboutImage2: string | null;
    aboutImage3: string | null;
  };
};

type ImageUploaderProps = {
  field: ImageField;
  label: string;
  description: string;
  currentUrl: string | null;
  isPending: boolean;
  uploadPreset?: string;
  onUploadSuccess: (field: ImageField, url: string) => void | Promise<void>;
};

function ImageUploader({
  field,
  label,
  description,
  currentUrl,
  isPending,
  uploadPreset,
  onUploadSuccess,
}: ImageUploaderProps) {
  return (
    <div className="brutal-border p-4 bg-surface-container-low flex flex-col gap-4">
      <div>
        <h3 className="font-black uppercase tracking-widest text-sm">{label}</h3>
        <p className="text-[10px] font-bold opacity-60 uppercase">{description}</p>
      </div>

      {currentUrl && (
        <div className="relative w-full aspect-video border-2 border-on-surface bg-on-surface flex items-center justify-center overflow-hidden">
          <Image
            src={currentUrl}
            alt={label}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {!uploadPreset ? (
        <div className="w-full text-center p-3 border-2 border-dashed border-red-600 bg-red-50 text-[10px] font-bold text-red-900 uppercase">
          Upload Preset Missing
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{ maxFiles: 1, multiple: false, clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'] }}
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
              void onUploadSuccess(field, result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              disabled={isPending}
              className={`w-full py-2 bg-on-surface text-surface font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-primary hover:text-on-primary border-2 border-transparent hover:border-on-surface ${isPending ? 'opacity-50' : 'hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_black]'}`}
            >
              <span className="material-symbols-outlined text-sm">upload</span>
              {currentUrl ? 'REPLACE IMAGE' : 'UPLOAD IMAGE'}
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}

export default function ImageSettingsClient({ images }: ImageSettingsClientProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleUploadSuccess = async (field: ImageField, url: string) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await updateSystemImage(field, url);
      if (result.error) {
        setError(result.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BrutalCard shadowColor="black" className="mt-8 bg-surface">
      <div className="mb-6 border-b-2 border-on-surface pb-4">
        <h2 className="text-2xl font-black uppercase italic">Landing Page Assets</h2>
        <p className="font-sans font-bold text-xs opacity-70">Manage dynamic images across the main website.</p>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 font-bold border-2 border-on-surface mb-6 text-xs uppercase">
          ERROR: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          field="heroImage"
          label="Hero Section Image"
          description="The tilted image on the right side of the main landing header."
          currentUrl={images.heroImage}
          isPending={isPending}
          uploadPreset={uploadPreset}
          onUploadSuccess={handleUploadSuccess}
        />
        <ImageUploader
          field="aboutImage1"
          label="About Section - Top Image"
          description="The large horizontal image at the top of the About section collage."
          currentUrl={images.aboutImage1}
          isPending={isPending}
          uploadPreset={uploadPreset}
          onUploadSuccess={handleUploadSuccess}
        />
        <ImageUploader
          field="aboutImage2"
          label="About Section - Bottom Left"
          description="The vertical image on the bottom-left of the About collage."
          currentUrl={images.aboutImage2}
          isPending={isPending}
          uploadPreset={uploadPreset}
          onUploadSuccess={handleUploadSuccess}
        />
        <ImageUploader
          field="aboutImage3"
          label="About Section - Bottom Right"
          description="The vertical image on the bottom-right of the About collage."
          currentUrl={images.aboutImage3}
          isPending={isPending}
          uploadPreset={uploadPreset}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </BrutalCard>
  );
}
