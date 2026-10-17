import React, { useEffect, useRef } from 'react';
import type { AnimationConfig } from '../types/invitation';

/**
 * ============================================================
 * UNIVERSAL SCROLL ANIMATION ENGINE
 * Single Source of Truth for Wedding Invitation Scroll Animations
 * ============================================================
 * Menghadirkan animasi scroll yang santai, lembut, puitis & mewah
 * (duration 0.95s - 1.2s, cubic-bezier out-quint), hemat baterai,
 * 100% GPU-accelerated (transform & opacity), dan mendukung
 * dual-context: Window Scroll & PhoneFrame Preview Scroll.
 */

export type AnimationPreset =
  | 'fade-up'
  | 'soft-scale'
  | 'title'
  | 'quote'
  | 'card'
  | 'fade-left'
  | 'fade-right';

export interface UniversalScrollOptions {
  /** Root container opsional (jika di-wrap di div tertentu) */
  rootElement?: HTMLElement | null;
  /** Nonaktifkan auto-scan jika ingin kontrol 100% manual */
  disableAutoScan?: boolean;
  /** Offset threshold toleransi margin pandang */
  marginOffset?: number;
  /** Konfigurasi animasi kustom dari themeConfig (Step 6) */
  config?: AnimationConfig;
}

/**
 * Utility Helper: Mengembalikan class CSS siap pakai untuk JSX template.
 * Contoh pemakaian:
 *   <h2 className={`font-serif text-2xl ${anim('title')}`}>Rangkaian Acara</h2>
 *   <div className={`p-6 rounded-3xl ${anim('card', 150)}`}>...</div>
 */
export function anim(preset: AnimationPreset = 'fade-up', delayMs?: number): string {
  const base = `anim-target anim-${preset}`;
  if (!delayMs) return base;
  if (delayMs <= 100) return `${base} delay-100`;
  if (delayMs <= 150) return `${base} delay-150`;
  if (delayMs <= 200) return `${base} delay-200`;
  if (delayMs <= 250) return `${base} delay-250`;
  if (delayMs <= 300) return `${base} delay-300`;
  if (delayMs <= 400) return `${base} delay-400`;
  if (delayMs <= 500) return `${base} delay-500`;
  return `${base} delay-600`;
}

/**
 * Mencari scroll container terdekat (Window atau div PhoneFrame dengan data-phone-preview="true")
 */
function findScrollContainer(element: Element | null): HTMLElement | Window {
  if (typeof window === 'undefined') return (null as any);
  if (!element) return window;

  const phonePreview = element.closest('[data-phone-preview="true"]') as HTMLElement | null;
  if (phonePreview) return phonePreview;

  let current = element.parentElement;
  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return current;
    }
    current = current.parentElement;
  }

  return window;
}

/**
 * Menandai elemen sebagai revealed (muncul)
 */
function markRevealed(el: Element) {
  el.classList.add('is-revealed');
  el.classList.add('is-visible'); // Kompatibilitas dengan class .reveal lama
}

/**
 * Injeksi variabel CSS dan atribut data-anim-preset secara dinamis
 * ke Document root dan Phone Preview container.
 */
export function applyAnimationConfigStyles(
  config?: AnimationConfig,
  rootElement?: HTMLElement | null
) {
  if (typeof window === 'undefined') return;

  const rawSmoothness = config?.smoothness ?? 75;
  // Pastikan rentang skala 1 - 100 (jika ada nilai lama > 100, konversi)
  const normalizedVal = rawSmoothness > 100 ? Math.round(rawSmoothness / 10) : rawSmoothness;
  const smoothness = Math.max(1, Math.min(100, normalizedVal));
  const norm = smoothness / 100;
  const isReduced = config?.reduced_motion ?? false;
  const stylePreset = config?.preset || 'romantic';

  // Durasi: 0.40s s/d 5.00s (pada angka 100 durasi tepat 5 detik)
  const durationSec = isReduced ? 0.15 : (0.40 + norm * 4.60).toFixed(2);
  // Jarak: 36px (snappy) s/d 14px (ultra-smooth cushioned)
  const distancePx = isReduced || stylePreset === 'minimalist' ? 0 : Math.round(36 - norm * 22);
  const easing = smoothness >= 60
    ? 'cubic-bezier(0.16, 1, 0.3, 1)'
    : 'cubic-bezier(0.25, 1, 0.5, 1)';

  const staggerSpeed = config?.stagger_speed || 'normal';
  const staggerMs = staggerSpeed === 'fast' ? 80 : staggerSpeed === 'relaxed' ? 260 : 160;
  const blurPx = config?.lens_focus_blur === false ? '0px' : '4px';

  const phoneContainers = Array.from(document.querySelectorAll('[data-phone-preview="true"]')) as HTMLElement[];
  const isDashboardMode = phoneContainers.length > 0;

  if (isDashboardMode) {
    // MODE DASHBOARD: ISOLASI KETAT
    // HANYA terapkan CSS variables ke container preview phone
    const targets: HTMLElement[] = [...phoneContainers];
    if (rootElement && rootElement.closest('[data-phone-preview="true"]')) {
      targets.push(rootElement);
    }

    targets.forEach((target) => {
      target.style.setProperty('--anim-duration', `${durationSec}s`);
      target.style.setProperty('--anim-distance', `${distancePx}px`);
      target.style.setProperty('--anim-ease', easing);
      target.style.setProperty('--anim-stagger', `${staggerMs}ms`);
      target.style.setProperty('--anim-blur', blurPx);
      target.setAttribute('data-anim-preset', stylePreset);

      if (config?.floating_petals === false) {
        target.setAttribute('data-hide-floating-petals', 'true');
      } else {
        target.removeAttribute('data-hide-floating-petals');
      }
    });

    // PENTING: Bersihkan document.documentElement dan body agar Dashboard 100% instan tanpa efek smooth
    document.documentElement.style.removeProperty('--anim-duration');
    document.documentElement.style.removeProperty('--anim-distance');
    document.documentElement.style.removeProperty('--anim-ease');
    document.documentElement.style.removeProperty('--anim-stagger');
    document.documentElement.style.removeProperty('--anim-blur');
    document.documentElement.removeAttribute('data-anim-preset');
    document.documentElement.removeAttribute('data-hide-floating-petals');

    document.body.style.removeProperty('--anim-duration');
    document.body.style.removeProperty('--anim-distance');
    document.body.style.removeProperty('--anim-ease');
    document.body.style.removeProperty('--anim-stagger');
    document.body.style.removeProperty('--anim-blur');
    document.body.removeAttribute('data-anim-preset');
  } else {
    // MODE STANDALONE PUBLIC INVITATION:
    // Terapkan ke rootElement atau document.documentElement
    const targets: HTMLElement[] = [document.documentElement];
    if (rootElement) targets.push(rootElement);

    targets.forEach((target) => {
      target.style.setProperty('--anim-duration', `${durationSec}s`);
      target.style.setProperty('--anim-distance', `${distancePx}px`);
      target.style.setProperty('--anim-ease', easing);
      target.style.setProperty('--anim-stagger', `${staggerMs}ms`);
      target.style.setProperty('--anim-blur', blurPx);
      target.setAttribute('data-anim-preset', stylePreset);

      if (config?.floating_petals === false) {
        target.setAttribute('data-hide-floating-petals', 'true');
      } else {
        target.removeAttribute('data-hide-floating-petals');
      }
    });
  }
}

export interface ReplayOptions {
  targetContainer?: HTMLElement | null;
  resetToCover?: boolean;
}

/**
 * Memutar ulang animasi scroll pada elemen-elemen pratinjau.
 * Jika resetToCover = true, tampilan frame HP otomatis kembali ke Sampul (Cover Gate)
 * sehingga pengguna dapat mengklik tombol "Buka Undangan" dan menikmati animasi dari awal.
 */
export function replayUniversalScrollAnimation(
  param?: HTMLElement | null | ReplayOptions
) {
  if (typeof window === 'undefined') return;

  const options: ReplayOptions =
    param && typeof param === 'object' && !('nodeType' in param)
      ? (param as ReplayOptions)
      : { targetContainer: param as HTMLElement | null, resetToCover: true };

  const { targetContainer = null, resetToCover = true } = options;

  if (resetToCover) {
    // Kirim event untuk mereset tampilan HP preview kembali ke Cover
    window.dispatchEvent(
      new CustomEvent('mbell_replay_preview', {
        detail: { resetToCover: true },
      })
    );
  }

  const phoneContainers = document.querySelectorAll('[data-phone-preview="true"]');
  const isDashboardMode = phoneContainers.length > 0;

  const phoneScroll = document.querySelector('[data-phone-preview="true"] .overflow-y-auto') as HTMLElement | null;
  const phonePreview = document.querySelector('[data-phone-preview="true"]') as HTMLElement | null;

  // Jika di Dashboard, container HANYA boleh phone preview, jangan pernah jatuh ke document.body!
  const container = targetContainer || phoneScroll || phonePreview || (!isDashboardMode ? document.body : null);

  if (!container) return;

  const elements = container.querySelectorAll(
    '.anim-target, .reveal, .reveal-scale, .reveal-left, .reveal-right, [data-anim]'
  );

  if (elements.length === 0) return;

  const visibleElements: HTMLElement[] = [];
  const cRect = container !== document.body ? container.getBoundingClientRect() : null;

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    // Jangan sentuh elemen di luar phone preview jika di dashboard
    if (isDashboardMode && !htmlEl.closest('[data-phone-preview="true"]')) return;
    if (htmlEl.closest('#cover')) return;

    const rect = htmlEl.getBoundingClientRect();
    let isVisibleNow = false;

    if (cRect) {
      isVisibleNow = rect.top <= cRect.bottom + 60 && rect.bottom >= cRect.top - 60;
    } else {
      isVisibleNow = rect.top <= window.innerHeight + 60 && rect.bottom >= -60;
    }

    if (isVisibleNow) {
      visibleElements.push(htmlEl);
    }
  });

  const targetsToReplay =
    visibleElements.length > 0 ? visibleElements : (Array.from(elements).slice(0, 4) as HTMLElement[]);

  // 1. Matikan transisi sementara dan hapus status revealed
  targetsToReplay.forEach((el) => {
    el.style.transition = 'none';
    el.classList.remove('is-revealed', 'is-visible');
  });

  // 2. Reflow
  void container.offsetHeight;

  // 3. Hidupkan kembali transisi dan re-reveal secara bertahap (stagger)
  requestAnimationFrame(() => {
    targetsToReplay.forEach((el, index) => {
      el.style.transition = '';
      setTimeout(() => {
        el.classList.add('is-revealed', 'is-visible');
      }, index * 80);
    });
  });
}

/**
 * Hook Universal: Dipanggil sekali di useTemplateState atau langsung di template.
 * Otomatis mengorkestrasi seluruh elemen semantik dan custom anim targets.
 */
export function useUniversalScrollAnimation(
  dependencies: any[] = [],
  options: UniversalScrollOptions = {}
) {
  const { rootElement = null, disableAutoScan = false, marginOffset = 40, config } = options;
  const isMountedRef = useRef(true);
  const prevConfigJsonRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    isMountedRef.current = true;

    // --- 1. DYNAMIC CSS VARIABLES & PRESET ATTR INJECTION ---
    applyAnimationConfigStyles(config, rootElement);

    const currentConfigJson = JSON.stringify(config || {});
    if (prevConfigJsonRef.current && prevConfigJsonRef.current !== currentConfigJson) {
      // Otomatis putar ulang efek pratinjau saat settingan berubah agar perbedaannya langsung terlihat
      replayUniversalScrollAnimation(rootElement);
    }
    prevConfigJsonRef.current = currentConfigJson;

    // Selector elemen yang diamati
    const TARGET_SELECTORS = [
      '.anim-target',
      '.reveal',
      '.reveal-scale',
      '.reveal-left',
      '.reveal-right',
      '[data-anim]',
    ];

    if (!disableAutoScan) {
      // Auto-scan elemen semantik pada template undangan
      TARGET_SELECTORS.push(
        'section:not(#cover):not(#sampul):not(#hero):not(.no-anim)',
        'section:not(#cover):not(#sampul):not(#hero) > div.max-w-sm:not(.no-anim)',
        'section:not(#cover):not(#sampul):not(#hero) h2:not(.no-anim)',
        'section:not(#cover):not(#sampul):not(#hero) blockquote:not(.no-anim)',
        'section:not(#cover):not(#sampul):not(#hero) .rounded-2xl:not(.no-anim)',
        'section:not(#cover):not(#sampul):not(#hero) .rounded-3xl:not(.no-anim)'
      );
    }

    const COMBINED_SELECTOR = TARGET_SELECTORS.join(', ');

    // Kumpulan observer berdasarkan scroll container
    const observersMap = new Map<HTMLElement | Window, IntersectionObserver>();

    const getOrCreateObserver = (container: HTMLElement | Window): IntersectionObserver => {
      if (observersMap.has(container)) {
        return observersMap.get(container)!;
      }

      const isWin = container === window;
      const root = isWin ? null : (container as HTMLElement);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              markRevealed(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root,
          rootMargin: `${marginOffset}px 0px ${marginOffset}px 0px`,
          threshold: [0, 0.05, 0.1],
        }
      );

      observersMap.set(container, observer);
      return observer;
    };

    // Fungsi pemindaian dan pelabelan otomatis
    const scanAndObserve = () => {
      if (!isMountedRef.current) return;

      const phoneContainers = Array.from(document.querySelectorAll('[data-phone-preview="true"]')) as HTMLElement[];
      const isDashboardMode = phoneContainers.length > 0;

      // 1. PEMBERSIHAN OTOMATIS: Bersihkan class animasi yang bocor ke dashboard editor UI
      if (isDashboardMode) {
        const leakedInDashboard = document.querySelectorAll(
          '[data-dashboard-editor="true"] .anim-target, #dashboard-editor-main .anim-target, nav .anim-target, header .anim-target, aside:not(:has([data-phone-preview])) .anim-target, #dashboard-layout .anim-target'
        );
        leakedInDashboard.forEach((el) => {
          if (!el.closest('[data-phone-preview="true"]')) {
            el.classList.remove(
              'anim-target',
              'anim-fade-up',
              'anim-soft-scale',
              'anim-title',
              'anim-quote',
              'anim-card',
              'anim-fade-left',
              'anim-fade-right',
              'is-revealed',
              'is-visible'
            );
            (el as HTMLElement).style.transition = '';
            (el as HTMLElement).style.transform = '';
            (el as HTMLElement).style.opacity = '';
          }
        });
      }

      // 2. TENTUKAN TARGET CANDIDATES SECARA KETAT
      let candidates: Element[] = [];

      if (rootElement && (!isDashboardMode || rootElement.closest('[data-phone-preview="true"]'))) {
        candidates = Array.from(rootElement.querySelectorAll(COMBINED_SELECTOR));
      } else if (isDashboardMode) {
        // HANYA ambil elemen di dalam Phone Preview
        phoneContainers.forEach((pc) => {
          const scrollable = pc.querySelector('.overflow-y-auto') || pc;
          candidates.push(...Array.from(scrollable.querySelectorAll(COMBINED_SELECTOR)));
        });
      } else {
        // Public Standalone Invitation: Ambil seluruh elemen template publik
        const scope = rootElement || document.querySelector('#invitation-root') || document;
        candidates = Array.from(scope.querySelectorAll(COMBINED_SELECTOR));
      }

      candidates.forEach((el) => {
        // PROTEKSI MUTLAK: Jangan sentuh elemen apapun di luar Phone Preview jika di dashboard
        if (isDashboardMode) {
          const inDashboardEditor =
            el.closest('[data-dashboard-editor="true"]') ||
            el.closest('#dashboard-editor-main') ||
            el.closest('#dashboard-layout') ||
            el.closest('.dashboard-content') ||
            el.closest('.dashboard-sidebar') ||
            el.closest('header') ||
            el.closest('nav');

          if (inDashboardEditor && !el.closest('[data-phone-preview="true"]')) {
            return;
          }
        }

        // Abaikan elemen cover pembuka di atas
        if (
          el.closest('#cover') ||
          el.closest('#sampul') ||
          el.closest('[data-cover="true"]') ||
          el.classList.contains('no-anim')
        ) {
          markRevealed(el);
          return;
        }

        // Terapkan class preset default jika belum memiliki kelas animasi
        if (
          !el.classList.contains('anim-target') &&
          !el.classList.contains('reveal') &&
          !el.classList.contains('reveal-scale') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right')
        ) {
          el.classList.add('anim-target');
          const tagName = el.tagName.toLowerCase();
          const dataAnim = el.getAttribute('data-anim');

          if (dataAnim) {
            el.classList.add(`anim-${dataAnim}`);
          } else if (tagName === 'h2' || tagName === 'h3') {
            el.classList.add('anim-title');
          } else if (tagName === 'blockquote') {
            el.classList.add('anim-quote');
          } else if (
            el.classList.contains('rounded-3xl') ||
            el.classList.contains('rounded-2xl') ||
            el.classList.contains('shadow-md') ||
            el.classList.contains('shadow-xl')
          ) {
            el.classList.add('anim-card');
          } else {
            el.classList.add('anim-fade-up');
          }
        }

        // Jika sudah revealed, lewatkan
        if (el.classList.contains('is-revealed') || el.classList.contains('is-visible')) {
          return;
        }

        const container = findScrollContainer(el);
        const isWin = container === window;
        const rect = el.getBoundingClientRect();

        let inViewport = false;
        if (isWin) {
          const vh = window.innerHeight || document.documentElement.clientHeight;
          inViewport = rect.top <= vh + marginOffset && rect.bottom >= -marginOffset;
        } else {
          const cRect = (container as HTMLElement).getBoundingClientRect();
          inViewport = rect.top <= cRect.bottom + marginOffset && rect.bottom >= cRect.top - marginOffset;
        }

        // Jika elemen sudah masuk viewport atau berada di posisi atas, tampilkan langsung
        if (inViewport) {
          markRevealed(el);
        } else if ('IntersectionObserver' in window) {
          const obs = getOrCreateObserver(container);
          obs.observe(el);
        } else {
          markRevealed(el);
        }
      });
    };

    // Eksekusi scan awal bertahap untuk sinkronisasi layout React DOM
    scanAndObserve();
    const timer1 = setTimeout(scanAndObserve, 50);
    const timer2 = setTimeout(scanAndObserve, 200);
    const timer3 = setTimeout(scanAndObserve, 500);
    const timer4 = setTimeout(scanAndObserve, 1000);

    const phoneContainers = Array.from(document.querySelectorAll('[data-phone-preview="true"]')) as HTMLElement[];
    const isDashboard = phoneContainers.length > 0;

    // MutationObserver untuk mendeteksi perubahan dinamis
    let mutationObserver: MutationObserver | null = null;
    if ('MutationObserver' in window) {
      mutationObserver = new MutationObserver(() => {
        scanAndObserve();
      });

      // Jika di dashboard, amati HANYA Phone Preview container, bukan document.body!
      const observeTarget = isDashboard
        ? (phoneContainers[0].querySelector('.overflow-y-auto') || phoneContainers[0])
        : (document.querySelector('#invitation-root') || rootElement || document.body);

      mutationObserver.observe(observeTarget, { childList: true, subtree: true });
    }

    // Passive scroll listener pada window dan PhonePreview sebagai fallback terpercaya
    const handlePassiveScroll = () => {
      scanAndObserve();
    };

    if (!isDashboard) {
      window.addEventListener('scroll', handlePassiveScroll, { passive: true });
    }
    window.addEventListener('resize', handlePassiveScroll, { passive: true });

    // Dengarkan scroll container di dalam phone preview jika ada
    phoneContainers.forEach((c) => {
      const scrollable = c.querySelector('.overflow-y-auto') || c;
      scrollable.addEventListener('scroll', handlePassiveScroll, { passive: true });
    });

    // Dengarkan event pembukaan cover undangan
    const handleCoverOpened = () => {
      setTimeout(scanAndObserve, 50);
      setTimeout(scanAndObserve, 200);
      setTimeout(scanAndObserve, 500);
    };
    window.addEventListener('mbell_cover_opened', handleCoverOpened);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      observersMap.forEach((obs) => obs.disconnect());
      observersMap.clear();

      if (mutationObserver) {
        mutationObserver.disconnect();
      }

      window.removeEventListener('scroll', handlePassiveScroll);
      window.removeEventListener('resize', handlePassiveScroll);
      window.removeEventListener('mbell_cover_opened', handleCoverOpened);
      phoneContainers.forEach((c) => {
        const scrollable = c.querySelector('.overflow-y-auto') || c;
        scrollable.removeEventListener('scroll', handlePassiveScroll);
      });
    };
  }, dependencies);
}

/**
 * Komponen Deklaratif Opsional: <ScrollReveal preset="fade-up" delay={150}>...</ScrollReveal>
 */
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  className?: string;
  as?: any;
}> = ({ children, preset = 'fade-up', delay, className = '', as: Component = 'div' }) => {
  const animClasses = anim(preset, delay);
  return React.createElement(Component, { className: `${animClasses} ${className}` }, children);
};

export default useUniversalScrollAnimation;
