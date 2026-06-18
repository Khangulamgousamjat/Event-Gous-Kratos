import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-surface-container-low">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
