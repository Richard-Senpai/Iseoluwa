'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface SplitRevealProps {
  as?: ElementType;
  children: ReactNode;
  triggerOnLoad?: boolean;
  delay?: number;
  className?: string;
}

/**
 * Line-by-line masked headline reveal using GSAP `SplitText` (Design System Section 6.4).
 * Falls back to a simple fade or visible text when reduced motion is enabled.
 */
export function SplitReveal({
  as: Component = 'div',
  children,
  triggerOnLoad = false,
  delay = 0,
  className,
}: SplitRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || shouldSimplifyMotion) return;

      let split: SplitText | null = null;
      try {
        split = new SplitText(el, {
          type: 'lines',
          linesClass: 'overflow-hidden block',
        });

        const innerSplit = new SplitText(split.lines, {
          type: 'lines',
          linesClass: 'block will-change-transform',
        });

        gsap.fromTo(
          innerSplit.lines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION.duration.reveal,
            stagger: MOTION.stagger.lines,
            delay,
            ease: MOTION.ease.reveal,
            scrollTrigger: triggerOnLoad
              ? undefined
              : {
                  trigger: el,
                  start: 'top 86%',
                  toggleActions: 'play none none reverse',
                },
          },
        );
      } catch {
        // Fallback if SplitText cannot measure lines in a headless/non-layout environment
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.duration.reveal,
            delay,
            ease: MOTION.ease.reveal,
          },
        );
      }

      return () => {
        split?.revert();
      };
    },
    { scope: rootRef, dependencies: [shouldSimplifyMotion, triggerOnLoad, delay] },
  );

  return (
    <Component ref={rootRef} className={cn(className)}>
      {children}
    </Component>
  );
}
