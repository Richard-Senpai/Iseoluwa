'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface ParallaxProps {
  children: ReactNode;
  amount?: number;
  className?: string;
}

/**
 * Inner-parallax wrapper for media frames (Tech Stack Section 4.1).
 * Translates the inner media slightly against scroll inside an overflow-hidden frame.
 */
export function Parallax({
  children,
  amount = MOTION.projectStack.innerParallaxPercent,
  className,
}: ParallaxProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner || shouldSimplifyMotion || isTouch) return;

      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: MOTION.ease.linear,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    { scope: wrapperRef, dependencies: [shouldSimplifyMotion, isTouch, amount] },
  );

  return (
    <div ref={wrapperRef} className={cn('relative overflow-hidden rounded-card', className)}>
      <div
        ref={innerRef}
        className={cn(!shouldSimplifyMotion && !isTouch && 'scale-[1.08] will-change-transform')}
      >
        {children}
      </div>
    </div>
  );
}
