'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';

export interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Single Lenis instance connected to GSAP ScrollTrigger and driven by `gsap.ticker`
 * (Tech Stack Section 4 Rule 2). Disabled when `prefers-reduced-motion` is active.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const { reducedMotion } = useMotionPreference();
  const setScrollVelocity = useUIStore((s) => s.setScrollVelocity);

  useEffect(() => {
    if (reducedMotion) {
      setScrollVelocity(0);
      return;
    }

    const lenis = new Lenis({
      lerp: MOTION.lenis.lerp,
      wheelMultiplier: MOTION.lenis.wheelMultiplier,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: { velocity: number }) => {
      ScrollTrigger.update();
      setScrollVelocity(e.velocity);
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setScrollVelocity(0);
    };
  }, [reducedMotion, setScrollVelocity]);

  return <>{children}</>;
}
