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
 * Line-by-line masked headline reveal using GSAP `SplitText` (Design System Sections 6.4 & 13, Prompt Part 3.2):
 * - Lines rise from below a mask with NO opacity animation (always 100% opaque).
 * - Mask wrappers include bottom padding (`pb-[0.14em] -mb-[0.14em]`) so descenders (`g`, `y`, `p`, `j`) are never clipped.
 * - `will-change` is set only during the active tween and removed on completion.
 * - On completion, masks switch to `overflow: visible` and `clearProps: "opacity,transform,filter,willChange"` is applied.
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

      let outerSplit: SplitText | null = null;
      try {
        outerSplit = new SplitText(el, {
          type: 'lines',
          linesClass: 'overflow-hidden block pb-[0.14em] -mb-[0.14em]',
        });

        const innerSplit = new SplitText(outerSplit.lines, {
          type: 'lines',
          linesClass: 'block',
        });

        gsap.fromTo(
          innerSplit.lines,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: MOTION.duration.reveal,
            stagger: MOTION.stagger.lines,
            delay,
            ease: MOTION.ease.reveal,
            onStart: () => {
              gsap.set(innerSplit.lines, { willChange: 'transform' });
            },
            onComplete: () => {
              gsap.set(innerSplit.lines, {
                clearProps: 'opacity,transform,filter,willChange',
              });
              if (outerSplit?.lines) {
                gsap.set(outerSplit.lines, { overflow: 'visible' });
              }
            },
            scrollTrigger: triggerOnLoad
              ? undefined
              : {
                  trigger: el,
                  start: 'top 88%',
                  toggleActions: 'play none none none',
                },
          },
        );
      } catch {
        // Fallback if SplitText cannot measure lines in a headless/non-layout environment
        gsap.fromTo(
          el,
          { y: 20 },
          {
            y: 0,
            duration: MOTION.duration.reveal,
            delay,
            ease: MOTION.ease.reveal,
            onStart: () => {
              gsap.set(el, { willChange: 'transform' });
            },
            onComplete: () => {
              gsap.set(el, { clearProps: 'opacity,transform,filter,willChange' });
            },
          },
        );
      }

      return () => {
        outerSplit?.revert();
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
