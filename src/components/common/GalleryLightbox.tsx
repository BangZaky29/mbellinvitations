import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePhoneDock } from '../../context/PhoneDockContext';

export interface GalleryLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  isPreview?: boolean;
}

/**
 * GalleryLightbox:
 * Komponen modal foto pop-up universal untuk seluruh template undangan digital.
 * - Mengatasi masalah foto pop-up tertinggal di atas/dekat beranda saat di-scroll.
 * - Mode Preview (Mockup HP di PC): Di-portal ke `phone-dock-target` sehingga selalu
 *   berada persis di tengah layar frame HP yang terlihat (viewport frame), bukan di puncak dokumen 5000px.
 * - Mode Live (Web PC / HP Asli): Di-portal ke `document.body` dengan `fixed inset-0 z-[9999]`
 *   sehingga selalu terkunci persis di tengah layar monitor/ponsel tanpa terpengaruh posisi scroll.
 */
export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  isOpen,
  imageUrl,
  onClose,
  isPreview = false,
}) => {
  const dockContext = usePhoneDock();
  const [fallbackDockNode, setFallbackDockNode] = useState<HTMLElement | null>(null);

  // Cari fallback container jika dockContext belum terikat
  useEffect(() => {
    if (isPreview && !dockContext && typeof document !== 'undefined') {
      const el = document.getElementById('phone-dock-target');
      if (el) {
        setFallbackDockNode(el);
      }
    }
  }, [isPreview, dockContext]);

  // Handle tombol Escape untuk menutup
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tampilan foto galeri diperbesar"
      className={`${
        isPreview
          ? 'absolute inset-0 z-50 rounded-[38px] p-3'
          : 'fixed inset-0 z-[9999] p-4'
      } bg-black/92 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-zoom-out animate-in fade-in duration-200`}
      onClick={onClose}
    >
      <div
        className="relative max-w-xs sm:max-w-md md:max-w-xl w-full max-h-[85%] flex flex-col items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Pratinjau Foto"
          className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
          title="Tutup Foto"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        <img
          src={imageUrl}
          alt="Foto Galeri Prewedding Diperbesar"
          className="max-h-[70vh] sm:max-h-[78vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
        />
      </div>
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
