'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionPreference } from '@/hooks/useMotionPreference';

export interface FooterRevealProps {
  children: ReactNode;
}

/**
 * Reusable `FooterReveal` curtain component (Home Prompt Section 4.12):
 * Reveals the footer fixed beneath the closing section as it slides up and away.
 * Automatically falls back to normal document flow if the footer is taller than
 * the viewport on small screens or when reduced motion is enabled.
 */
export function FooterReveal({ children }: FooterRevealProps) {
  const footerMeasureRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [canUseCurtain, setCanUseCurtain] = useState<boolean>(false);
  const { shouldSimplifyMotion } = useMotionPreference();

  useEffect(() => {
    const el = footerMeasureRef.current;
    if (!el || shouldSimplifyMotion) {
      setCanUseCurtain(false);
      return;
    }

    const updateMeasurements = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const fitsViewport = rect.height > 0 && rect.height <= viewportHeight * 0.92;
      setFooterHeight(rect.height);
      setCanUseCurtain(fitsViewport && window.innerWidth >= 1024);
    };

    updateMeasurements();
    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateMeasurements);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [shouldSimplifyMotion]);

  if (!canUseCurtain) {
    return <div ref={footerMeasureRef}>{children}</div>;
  }

  return (
    <div style={{ height: footerHeight }} className="relative">
      <div
        ref={footerMeasureRef}
        className="fixed right-0 bottom-0 left-0 z-0"
      >
        {children}
      </div>
    </div>
  );
}
