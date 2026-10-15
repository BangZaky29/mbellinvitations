import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePhoneDock } from '../../context/PhoneDockContext';

interface FloatingDockProps {
  children: React.ReactNode;
  isPreview?: boolean;
}

/**
 * FloatingDock:
 * Portal cerdas untuk elemen mengambang (Bottom Navigation Bar & Audio Bubble).
 * - Saat mode Preview (di dalam Phone Mockup atau Modal Pratinjau):
 *   Mengarahkan elemen ke container dock statis di bingkai HP melalui PhoneDockContext,
 *   sehingga elemen 100% DIAM di dasar bingkai HP saat konten di-scroll,
 *   TIDAK AKAN PERNAH bergeser ke tengah layar atau keluar dari bingkai HP.
 * - Saat mode Live (dibuka langsung oleh tamu undangan di browser HP):
 *   Dirender normal secara fixed ke viewport layar smartphone.
 */
export const FloatingDock: React.FC<FloatingDockProps> = ({ children, isPreview }) => {
  const dockContext = usePhoneDock();
  const [fallbackDockNode, setFallbackDockNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isPreview && !dockContext && typeof document !== 'undefined') {
      const el = document.getElementById('phone-dock-target');
      if (el) {
        setFallbackDockNode(el);
      }
    }
  }, [isPreview, dockContext]);

  if (isPreview) {
    const targetNode = dockContext || fallbackDockNode;
    if (targetNode) {
      return createPortal(children, targetNode);
    }
  }

  return <>{children}</>;
};
