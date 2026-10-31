import React, { useEffect, useState, useCallback, useRef } from 'react';
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
 *   - Tombol floating panah kiri & kanan
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

  // Internal index state if controlledIndex is not passed
  const safePhotos = Array.isArray(photos) && photos.length > 0 ? photos.filter(Boolean) : imageUrl ? [imageUrl] : [];
  const initialIdx = controlledIndex !== undefined ? controlledIndex : imageUrl ? safePhotos.indexOf(imageUrl) : 0;
  const [internalIndex, setInternalIndex] = useState(Math.max(0, initialIdx));

  useEffect(() => {
    if (controlledIndex !== undefined) {
      setInternalIndex(controlledIndex);
    } else if (imageUrl) {
      const idx = safePhotos.indexOf(imageUrl);
      if (idx !== -1) setInternalIndex(idx);
    }
  }, [controlledIndex, imageUrl, safePhotos]);

  const total = safePhotos.length;
  const activePhoto = safePhotos[internalIndex] || imageUrl;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = internalIndex > 0 ? internalIndex - 1 : total - 1;
    setInternalIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  }, [internalIndex, total, onIndexChange]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = internalIndex < total - 1 ? internalIndex + 1 : 0;
    setInternalIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  }, [internalIndex, total, onIndexChange]);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (deltaX > 45) {
      handleNext();
    } else if (deltaX < -45) {
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
            Foto {internalIndex + 1} dari {total}
          </span>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Pratinjau Foto"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
          title="Tutup Foto (Esc)"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      {/* Center Image Container with Floating Chevron Arrows */}
      <div
        className="relative max-w-xs sm:max-w-md md:max-w-xl w-full max-h-[82%] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md border border-white/20 z-20"
            title="Foto Sebelumnya (Panah Kiri)"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
        )}

        <img
          key={activePhoto}
          src={activePhoto}
          alt={`Foto Galeri ${internalIndex + 1} Diperbesar`}
          className="max-h-[68vh] sm:max-h-[76vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200"
        />

        {/* Next Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md border border-white/20 z-20"
            title="Foto Selanjutnya (Panah Kanan)"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        )}
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
