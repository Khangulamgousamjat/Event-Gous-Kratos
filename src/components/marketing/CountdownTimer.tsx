'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';

function getTimeLeft(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const distance = target - now;

  if (Number.isNaN(target) || distance <= 0) {
    return null;
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

const TimerUnit = ({ value, label }: { label: string; value: number }) => (
  <div className="flex flex-col items-center p-3 md:p-4 brutal-border bg-surface hard-shadow min-w-[70px] md:min-w-[100px]">
    <span className="text-3xl md:text-6xl font-black font-display leading-none">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest mt-2">{label}</span>
  </div>
);

export default function CountdownTimer({
  targetDate = '2026-04-27T05:00:00Z',
  enableRefreshOnZero = false,
}: {
  enableRefreshOnZero?: boolean;
  targetDate?: string;
}) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const updateCountdown = () => {
      const nextTimeLeft = getTimeLeft(targetDate);
      setTimeLeft(nextTimeLeft);

      if (!nextTimeLeft && enableRefreshOnZero) {
        window.location.reload();
      }
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [enableRefreshOnZero, mounted, targetDate]);

  if (!mounted || !timeLeft) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-4 md:py-8">
      <TimerUnit value={timeLeft.days} label="Days" />
      <TimerUnit value={timeLeft.hours} label="Hours" />
      <TimerUnit value={timeLeft.minutes} label="Mins" />
      <TimerUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
