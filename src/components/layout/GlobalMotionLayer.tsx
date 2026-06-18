import React from 'react';

const accentBlocks = [
  'top-[12%] left-[4%] h-16 w-16',
  'top-[22%] right-[8%] h-24 w-24',
  'bottom-[18%] left-[10%] h-12 w-12',
  'bottom-[10%] right-[14%] h-20 w-20',
];

export default function GlobalMotionLayer() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(24,24,24,0.08),transparent_30%)]" />
      {accentBlocks.map((block) => (
        <div
          key={block}
          className={`absolute ${block} rotate-12 border border-on-surface/15 bg-primary-container/20`}
        />
      ))}
    </div>
  );
}
