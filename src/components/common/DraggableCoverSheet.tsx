import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface DraggableCoverSheetProps {
  isOpen: boolean;
  isOpening: boolean;
  onOpenInvitation: () => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * DraggableCoverSheet
 * 
 * Overlay fisik selembar kertas undangan yang interaktif dan berkinerja tinggi:
 * - Real-time vertical dragging (Hold & Drag) mengikuti sentuhan jari (Touch) & kursor (Mouse)
 * - Spring Physics Engine (Damped Harmonic Oscillator):
 *   - Mengikuti kecepatan awal (initial velocity) saat pengguna melempar/melepas kursor
 *   - Threshold & Snap:
 *     - Bila dilepas sebelum ambang batas (threshold ~30% atau flick up), cover membal memantul kembali ke Y: 0
 *     - Bila melewati ambang batas, cover meluncur penuh ke atas (Y: -100%) menyingkap konten utama
 * - Cross-platform: Mulus di iOS Safari, Android Chrome, dan Desktop Browser
 * - Terintegrasi dengan tombol "Buka Undangan" (memakai animasi spring slide-up yang identik)
 * - Sinkronisasi otomatis saat tombol "Sampul" ditekan di toolbar preview
 */
export const DraggableCoverSheet: React.FC<DraggableCoverSheetProps> = ({
  isOpen,
  isOpening,
  onOpenInvitation,
  children,
  className = '',
  id = 'draggable-cover-sheet',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(isOpen);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // State koordinat dan fisika internal
  const currentYRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartYRef = useRef<number>(0);
  const initialYOnPointerDownRef = useRef<number>(0);
  const lastPointerYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Utility untuk menerapkan transformasi GPU secara langsung (tanpa re-render berat)
  const applyTransform = useCallback((y: number) => {
    currentYRef.current = y;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  }, []);

  // Pembatalan loop animasi berjalan
  const stopAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Ref untuk melacak perubahan status isOpen sebelumnya (mencegah pembatalan animasi yang tidak disengaja)
  const prevIsOpenRef = useRef<boolean>(isOpen);

  // Simulator Fisika Pegas (Spring Physics Solver)
  const runSpringAnimation = useCallback(
    (
      targetY: number,
      initialVelocity: number,
      onComplete?: () => void
    ) => {
      stopAnimation();

      let currentY = currentYRef.current;
      let currentVelocity = initialVelocity;
      let lastTime = performance.now();

      // Parameter pegas: Natural, tactile, dan responsif
      const stiffness = 230; // Gaya tarik pegas
      const damping = 26;    // Hambatan peredam
      const mass = 1.0;

      const containerHeight =
        sheetRef.current?.getBoundingClientRect().height ||
        (typeof window !== 'undefined' ? window.innerHeight : 800);

      const step = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.032); // Max delta time 32ms untuk stabilitas
        lastTime = now;

        const displacement = currentY - targetY;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * currentVelocity;
        const acceleration = (springForce + dampingForce) / mass;

        currentVelocity += acceleration * dt;
        currentY += currentVelocity * dt;

        applyTransform(currentY);

        // Jika cover meluncur ke atas dan sudah melewati batas atas layar (-containerHeight - 80px),
        // langsung selesaikan dan dismiss agar tidak meninggalkan bayangan/garis batas sama sekali
        if (targetY < 0 && currentY <= -containerHeight - 80) {
          applyTransform(targetY);
          animFrameRef.current = null;
          setIsDismissed(true);
          if (onComplete) onComplete();
          return;
        }

        // Kriteria konvergensi (selesai saat posisi & kecepatan mendekati 0)
        const isSettled =
          Math.abs(currentY - targetY) < 1.0 && Math.abs(currentVelocity) < 12;

        if (isSettled) {
          applyTransform(targetY);
          animFrameRef.current = null;
          if (targetY < 0) {
            setIsDismissed(true);
          }
          if (onComplete) onComplete();
        } else {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [applyTransform, stopAnimation]
  );

  // Fungsi memicu slide-up penuh ke atas
  const triggerSlideUp = useCallback(
    (customVelocity?: number) => {
      const containerHeight =
        sheetRef.current?.getBoundingClientRect().height ||
        (typeof window !== 'undefined' ? window.innerHeight : 800);

      // Pastikan target Y cukup jauh di atas layar (-containerHeight - 200px)
      // agar tidak ada teks, tombol, maupun bayangan (box-shadow) yang tertinggal
      const targetY = -Math.max(containerHeight + 200, 1000);
      const v = customVelocity !== undefined ? customVelocity : -600;

      if (!isOpen && !isOpening) {
        onOpenInvitation();
      }

      runSpringAnimation(targetY, v, () => {
        setIsDismissed(true);
      });
    },
    [isOpen, isOpening, onOpenInvitation, runSpringAnimation]
  );

  // Hanya reset posisi jika sebelumnya terbuka (isOpen === true) lalu ditutup kembali (isOpen === false)
  // Ini mencegah pembatalan loop animasi saat isOpening berubah menjadi true
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      stopAnimation();
      setIsDismissed(false);
      applyTransform(0);
    } else if (isOpen && !isOpening) {
      setIsDismissed(true);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isOpening, stopAnimation, applyTransform]);

  // Listener bila dibuka via tombol "Buka Undangan"
  useEffect(() => {
    if (isOpening && !isDismissed) {
      triggerSlideUp(-600);
    }
  }, [isOpening, isDismissed, triggerSlideUp]);

  // Cleanup loop saat unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  // =========================================================================
  // Pointer Event Handlers (Cross-Platform Touch & Mouse)
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Abaikan jika klik berasal dari tombol interaktif
    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('button, a, input, textarea, select')) {
      return;
    }

    stopAnimation();
    isPointerDownRef.current = true;
    setIsDragging(true);

    pointerStartYRef.current = e.clientY;
    initialYOnPointerDownRef.current = currentYRef.current;
    lastPointerYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback aman jika pointer capture tidak didukung
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaY = e.clientY - pointerStartYRef.current;
    let nextY = initialYOnPointerDownRef.current + deltaY;

    // Batasi geser ke bawah: berikan efek hambatan karet (rubber-band)
    if (nextY > 0) {
      nextY = nextY * 0.12;
    }

    // Hitung kecepatan real-time (velocity)
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 8) {
      velocityRef.current = ((e.clientY - lastPointerYRef.current) / dt) * 1000;
      lastPointerYRef.current = e.clientY;
      lastTimeRef.current = now;
    }

    applyTransform(nextY);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Fallback aman
    }

    const containerHeight =
      sheetRef.current?.getBoundingClientRect().height ||
      (typeof window !== 'undefined' ? window.innerHeight : 700);

    const currentY = currentYRef.current;
    const dragDistanceUp = -currentY; // Positif bila ditarik ke atas
    const velocityUp = -velocityRef.current; // Positif bila dilempar ke atas

    // Batas ambang tengah layar (threshold): 30% tinggi kontainer atau maks 220px
    const thresholdDistance = Math.min(containerHeight * 0.3, 220);
    // Flick cepat ke atas (kecepatan > 300px/s dengan jarak minimal 30px)
    const isFlickUp = velocityUp > 300 && dragDistanceUp > 30;
    const shouldOpen = dragDistanceUp > thresholdDistance || isFlickUp;

    if (shouldOpen) {
      // Melewati ambang batas: Luncurkan penuh ke atas dengan sisa kecepatan
      triggerSlideUp(velocityRef.current);
    } else {
      // Belum mencapai batas: Kembalikan secara halus ke posisi semula di bawah (snap back)
      runSpringAnimation(0, velocityRef.current);
    }
  };

  // Jangan render di DOM setelah cover selesai dibuka dan dismissed
  if (isDismissed) {
    return null;
  }

  return (
    <div
      ref={sheetRef}
      id={id}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className={`absolute inset-0 w-full h-full z-30 select-none overflow-hidden will-change-transform ${
        isDragging
          ? 'cursor-grabbing shadow-[0_30px_60px_-15px_rgba(0,0,0,0.65)] ring-1 ring-black/10'
          : 'cursor-grab shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4)]'
      } ${className}`}
      style={{
        touchAction: 'pan-x',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableCoverSheet;
