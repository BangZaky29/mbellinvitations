import { useEffect, useState } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Hook untuk menghitung countdown real-time menuju tanggal pernikahan.
 * @param targetDateISO - ISO date string, e.g. "2026-10-24T08:00:00+07:00"
 */
export function useCountdown(targetDateISO: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() =>
    calculateTimeLeft(targetDateISO)
  );

  useEffect(() => {
    // Segera hitung ulang secara instan saat targetDateISO berubah tanpa menunggu interval 1 detik
    setTimeLeft(calculateTimeLeft(targetDateISO));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateISO));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO]);

  return timeLeft;
}

function calculateTimeLeft(targetDateISO: string): CountdownResult {
  if (!targetDateISO || typeof targetDateISO !== 'string') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const target = new Date(targetDateISO).getTime();
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}
