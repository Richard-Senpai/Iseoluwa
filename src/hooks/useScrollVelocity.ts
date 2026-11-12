'use client';

import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/ui.store';

/**
 * Returns a mutable ref holding the latest scroll velocity (pushed by SmoothScroll / window scroll)
 * without triggering React re-renders inside animation loops.
 */
export function useScrollVelocity() {
  const velocityRef = useRef(0);

  useEffect(() => {
    const unsubscribe = useUIStore.subscribe((state) => {
      velocityRef.current = state.scrollVelocity;
    });
    return unsubscribe;
  }, []);

  return velocityRef;
}
