'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Fades and lifts content in on scroll (`transform` and `opacity` only).
 * Applies `will-change` only during active animation and clears `opacity,transform,filter,willChange`
 * on completion so resting elements remain 100% crisp (Design System Section 13 & Tech Stack 12.1).
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || shouldSimplifyMotion) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: Math.round(y) },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.reveal,
          delay,
          ease: MOTION.ease.smoothOut,
          onStart: () => {
            gsap.set(el, { willChange: 'transform, opacity' });
          },
          onComplete: () => {
            gsap.set(el, { clearProps: 'opacity,transform,filter,willChange' });
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
    { scope: containerRef, dependencies: [shouldSimplifyMotion, delay, y] },
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
