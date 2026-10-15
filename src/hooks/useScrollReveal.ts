import { useEffect } from 'react';

/**
 * Custom hook to trigger GPU-accelerated smooth animations on scroll.
 * Observes elements with .reveal, .reveal-scale, .reveal-left, .reveal-right.
 * Uses both IntersectionObserver and MutationObserver to ensure elements
 * are always revealed properly even during rapid Live/Preview toggling or dynamic DOM mounts.
 */
export function useScrollReveal(dependencies: any[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SELECTOR = '.reveal, .reveal-scale, .reveal-left, .reveal-right';

    const revealElement = (el: Element) => {
      el.classList.add('is-visible');
    };

    // If IntersectionObserver is not supported, reveal all immediately
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach(revealElement);
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '40px 0px 40px 0px',
      threshold: [0, 0.05, 0.1],
    });

    // Scan and reveal elements currently in viewport, observe the rest
    const scanElements = () => {
      const elements = document.querySelectorAll(SELECTOR);
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
        // If already visible, skip
        if (el.classList.contains('is-visible')) return;

        const rect = el.getBoundingClientRect();
        // If element is already within or above the viewport, show immediately
        if (rect.top <= viewportHeight + 40 && rect.bottom >= -40) {
          revealElement(el);
        } else {
          observer.observe(el);
        }
      });
    };

    // Run scans at multiple safe intervals to accommodate React DOM mounting & layout passes
    scanElements();
    const t1 = setTimeout(scanElements, 40);
    const t2 = setTimeout(scanElements, 150);
    const t3 = setTimeout(scanElements, 400);

    // Watch for DOM mutations (e.g. when Live/Preview or templates toggle)
    let mutationObserver: MutationObserver | null = null;
    if ('MutationObserver' in window) {
      mutationObserver = new MutationObserver(() => {
        scanElements();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Scroll & resize fallback listener (passive)
    const handleScrollOrResize = () => {
      scanElements();
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, dependencies);
}

export default useScrollReveal;
