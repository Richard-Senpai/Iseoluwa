'use client';

import { useEffect, useState } from 'react';

export interface MotionPreference {
  reducedMotion: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  shouldSimplifyMotion: boolean;
}

/**
 * Detects reduced motion preference, touch devices, and low-power/data-saver hints
 * so motion components can gracefully downgrade per Design System Section 6.9.
 */
export function useMotionPreference(): MotionPreference {
  const [state, setState] = useState<MotionPreference>({
    reducedMotion: false,
    isTouch: false,
    isLowPower: false,
    shouldSimplifyMotion: false,
  });

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');

    const computeState = () => {
      const reducedMotion = reducedQuery.matches;
      const isTouch = coarseQuery.matches || navigator.maxTouchPoints > 0;
      const cores = navigator.hardwareConcurrency ?? 8;
      const navWithConnection = navigator as Navigator & {
        connection?: { saveData?: boolean };
      };
      const saveData = Boolean(navWithConnection.connection?.saveData);
      const isLowPower = cores <= 1 || saveData;

      setState({
        reducedMotion,
        isTouch,
        isLowPower,
        shouldSimplifyMotion: reducedMotion || isLowPower,
      });
    };

    computeState();
    reducedQuery.addEventListener('change', computeState);
    coarseQuery.addEventListener('change', computeState);

    return () => {
      reducedQuery.removeEventListener('change', computeState);
      coarseQuery.removeEventListener('change', computeState);
    };
  }, []);

  return state;
}
