import { useUniversalScrollAnimation } from '../utils/scrollAnimationEngine';

/**
 * Universal Scroll Reveal Bridge
 * Delegated to the central Universal Scroll Animation Engine.
 */
export function useScrollReveal(dependencies: any[] = []) {
  useUniversalScrollAnimation(dependencies);
}

export default useScrollReveal;
