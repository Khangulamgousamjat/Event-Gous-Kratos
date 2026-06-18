'use client';

import React, { useEffect, useState } from 'react';

export default function LiveViewerCounter() {
  const [count, setCount] = useState<number>(1);
  const [viewerId, setViewerId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve a persistent viewer Session ID
    let currentId = localStorage.getItem('kratos_viewer_id');
    if (!currentId) {
      currentId = 'op_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('kratos_viewer_id', currentId);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewerId(currentId);
  }, []);

  useEffect(() => {
    if (!viewerId) return;

    let mounted = true;

    const pingPresence = async () => {
      try {
        await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewerId }),
        });
      } catch (error) {
        console.error('Failed to emit heartbeat.', error);
      }
    };

    const fetchCount = async () => {
      try {
        const res = await fetch('/api/presence');
        const data = await res.json();
        if (mounted && typeof data.count === 'number') {
          setCount(data.count);
        }
      } catch (error) {
        console.error('Failed to retrieve spectator count.', error);
      }
    };

    // Initial sequence
    pingPresence();
    fetchCount();

    // Loop asynchronous heartbeat every 10 seconds
    const interval = setInterval(() => {
      pingPresence();
      fetchCount();
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [viewerId]);

  return (
    <div className="flex items-center gap-3 bg-surface-container-low border-2 border-on-surface px-4 py-2 font-display uppercase tracking-widest text-sm w-fit brutal-border">
      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse border border-black shadow-[0_0_10px_#dc2626]"></div>
      <span className="font-black text-red-600">LIVE: <span className="text-xl mx-2 font-mono">{count}</span> OPERATIVES WATCHING</span>
    </div>
  );
}
