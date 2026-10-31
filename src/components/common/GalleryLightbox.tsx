import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePhoneDock } from '../../context/PhoneDockContext';

export interface GalleryLightboxProps {
  isOpen: boolean;
  imageUrl?: string | null;
  photos?: string[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onClose: () => void;
  isPreview?: boolean;
}

/**
 * GalleryLightbox:
 * Komponen modal foto pop-up universal untuk seluruh template undangan digital Mbell.
 * - Mengatasi masalah foto pop-up tertinggal di atas/dekat beranda saat di-scroll.
 * - Mendukung navigasi Next / Previous langsung di dalam modal (tanpa harus menutup modal):
 *   - Tombol floating panah kiri & kanan (dengan touch & click propagation terisolasi)
 *   - Pintasan keyboard (ArrowLeft & ArrowRight)
 *   - Gestur sentuh usap jari (touch swipe) di mobile
 *   - Counter badge indikator "Foto X dari Y"
 * - Mode Preview (Mockup HP di PC): Di-portal ke `phone-dock-target` sehingga selalu
 *   berada persis di tengah layar frame HP yang terlihat (viewport frame).
 * - Mode Live (Web PC / HP Asli): Di-portal ke `document.body` dengan `fixed inset-0 z-[9999]`.
 * - 100% Backwards-compatible jika hanya `imageUrl` yang dikirimkan.
 */
export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  isOpen,
  imageUrl,
  photos = [],
  currentIndex: controlledIndex,
  onIndexChange,
  onClose,
  isPreview = false,
}) => {
  const dockContext = usePhoneDock();
  const [fallbackDockNode, setFallbackDockNode] = useState<HTMLElement | null>(null);

  // Memoize safePhotos agar referensi array stabil dan tidak memicu render ulang berlebih
  const safePhotos = useMemo(() => {
    if (Array.isArray(photos) && photos.length > 0) {
      return photos.filter(Boolean);
    }
    if (imageUrl) return [imageUrl];
    return [];
  }, [photos, imageUrl]);

  const total = safePhotos.length;

  // State index foto yang aktif di dalam modal
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const wasOpenRef = useRef<boolean>(false);
  const lastSyncedIndexRef = useRef<number | null>(null);
  const lastSyncedImageRef = useRef<string | null>(null);

  // Sinkronisasi index saat modal baru dibuka atau saat imageUrl/controlledIndex berubah dari parent
  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    const justOpened = !wasOpenRef.current;
    wasOpenRef.current = true;

    // Saat modal baru dibuka pertama kali
    if (justOpened) {
      let initialIdx = 0;
      if (controlledIndex !== undefined && controlledIndex >= 0 && controlledIndex < safePhotos.length) {
        initialIdx = controlledIndex;
      } else if (imageUrl) {
        const found = safePhotos.indexOf(imageUrl);
        initialIdx = found !== -1 ? found : 0;
      }
      setActiveIndex(initialIdx);
      lastSyncedIndexRef.current = initialIdx;
      lastSyncedImageRef.current = safePhotos[initialIdx] || imageUrl || null;
      return;
    }

    // Jika parent mengubah controlledIndex secara eksternal (berbeda dari sinkronisasi terakhir kita)
    if (
      controlledIndex !== undefined &&
      controlledIndex >= 0 &&
      controlledIndex < safePhotos.length &&
      controlledIndex !== lastSyncedIndexRef.current
    ) {
      setActiveIndex(controlledIndex);
      lastSyncedIndexRef.current = controlledIndex;
      lastSyncedImageRef.current = safePhotos[controlledIndex] || null;
      return;
    }

    // Jika parent mengubah imageUrl secara eksternal (berbeda dari sinkronisasi terakhir kita)
    if (imageUrl && imageUrl !== lastSyncedImageRef.current) {
      const idx = safePhotos.indexOf(imageUrl);
      if (idx !== -1 && idx !== lastSyncedIndexRef.current) {
        setActiveIndex(idx);
        lastSyncedIndexRef.current = idx;
      }
      lastSyncedImageRef.current = imageUrl;
    }
  }, [isOpen, imageUrl, controlledIndex, safePhotos]);

  // Foto yang aktif saat ini
  const activePhoto = safePhotos[activeIndex] || imageUrl || '';

  // Handler Navigasi Foto Sebelumnya (Prev)
  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (safePhotos.length <= 1) return;

      const nextIdx = (activeIndex - 1 + safePhotos.length) % safePhotos.length;
      const nextUrl = safePhotos[nextIdx];
      lastSyncedIndexRef.current = nextIdx;
      lastSyncedImageRef.current = nextUrl;
      setActiveIndex(nextIdx);

      if (onIndexChange) {
        onIndexChange(nextIdx);
      }
    },
    [safePhotos, activeIndex, onIndexChange]
  );

  // Handler Navigasi Foto Selanjutnya (Next)
  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (safePhotos.length <= 1) return;

      const nextIdx = (activeIndex + 1) % safePhotos.length;
      const nextUrl = safePhotos[nextIdx];
      lastSyncedIndexRef.current = nextIdx;
      lastSyncedImageRef.current = nextUrl;
      setActiveIndex(nextIdx);

      if (onIndexChange) {
        onIndexChange(nextIdx);
      }
    },
    [safePhotos, activeIndex, onIndexChange]
  );

  // Touch Swipe tracking untuk geser swipe foto di layar sentuh
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (deltaX > 40) {
      handleNext();
    } else if (deltaX < -40) {
      handlePrev();
    }
  };

  // Fallback dock target resolution
  useEffect(() => {
    if (isPreview && !dockContext && typeof document !== 'undefined') {
      const el = document.getElementById('phone-dock-target');
      if (el) {
        setFallbackDockNode(el);
      }
    }
  }, [isPreview, dockContext]);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !activePhoto) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tampilan foto galeri diperbesar"
      className={`${
        isPreview
          ? 'absolute inset-0 z-50 rounded-[38px] p-2 sm:p-3'
          : 'fixed inset-0 z-[9999] p-3 sm:p-4'
      } bg-black/92 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto select-none animate-in fade-in duration-200`}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar: Counter & Close Button */}
      <div
        className="w-full max-w-xl flex items-center justify-between mb-2 px-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 ? (
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-sans font-semibold backdrop-blur-md border border-white/10 shadow-xs">
            Foto {activeIndex + 1} dari {total}
          </span>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Tutup Pratinjau Foto"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
          title="Tutup Foto (Esc)"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      {/* Center Image Container with Bottom Floating Chevron Dock */}
      <div
        className="relative max-w-xs sm:max-w-md md:max-w-xl w-full max-h-[82%] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative inline-flex items-center justify-center max-w-full max-h-[68vh] sm:max-h-[76vh] rounded-2xl overflow-hidden shadow-2xl border border-white/15">
          <img
            key={activePhoto}
            src={activePhoto}
            alt={`Foto Galeri ${activeIndex + 1} Diperbesar`}
            className="max-h-[68vh] sm:max-h-[76vh] w-auto max-w-full object-contain animate-in zoom-in-95 duration-200 select-none"
          />

          {/* Floating Navigation Pill inside the bottom of the photo (Berdekatan Berdampingan) */}
          {total > 1 && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 shadow-xl z-30 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrev}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="Foto Sebelumnya"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Foto Sebelumnya (Panah Kiri)"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>

              <div className="w-px h-3.5 bg-white/25" />

              <button
                type="button"
                onClick={handleNext}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="Foto Selanjutnya"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Foto Selanjutnya (Panah Kanan)"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Swipe Hint on Mobile */}
      {total > 1 && (
        <span className="text-[10px] text-white/50 font-sans tracking-wider uppercase mt-2.5">
          Usap layar atau tekan tombol panah untuk ganti foto
        </span>
      )}
    </div>
  );

  // 1. Jika mode preview dalam mockup frame HP: portal ke container dock HP
  if (isPreview) {
    const targetNode = dockContext || fallbackDockNode;
    if (targetNode) {
      return createPortal(content, targetNode);
    }
  }

  // 2. Jika mode live atau fallback web: portal ke document.body
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
};

export default GalleryLightbox;
