'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface BrutalQRCodeProps {
  data: string;
  size?: number;
  className?: string;
}

const BrutalQRCode = ({ data, size = 200, className }: BrutalQRCodeProps) => {
  return (
    <div
      className={cn(
        'brutal-border p-3 bg-white hard-shadow-gold inline-block',
        className,
      )}
    >
      <QRCodeSVG
        value={data}
        size={size}
        bgColor="#F9F9F9"
        fgColor="#1A1C1C"
        includeMargin
      />
      <div className="mt-2 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Auth Token</p>
        <p className="text-[8px] font-mono truncate max-w-[150px] mx-auto opacity-40">{data}</p>
      </div>
    </div>
  );
};

export default BrutalQRCode;
