'use client';

import { useRef, useState } from 'react';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface StrikeListProps {
  items: string[];
  closingStatement: string;
  className?: string;
}

/**
 * Reusable `StrikeList` motion component (Home Prompt Section 4.3 & About Prompt Part A):
 * Uses the thick tapered ribbon engine (`FlowingLine` with `variant="strike"` — shorter chain,
 * stroke ~0.1em of text size, hand-drawn wobble, tapered ends) to cross out each problem row
 * as it scrolls through the viewport center, dimming the text to muted.
 */
export function StrikeList({ items, closingStatement, className }: StrikeListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();
  const [rowProgress, setRowProgress] = useState<number[]>(() => items.map(() => 0));

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || shouldSimplifyMotion) return;

      const rows = container.querySelectorAll<HTMLElement>('.strike-row');
      rows.forEach((row, idx) => {
        const text = row.querySelector<HTMLElement>('.strike-row-text');
        const stateObj = { progress: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 68%',
            end: 'bottom 45%',
            scrub: true,
          },
        });

        tl.to(stateObj, {
          progress: 1,
          ease: MOTION.ease.linear,
          duration: 1,
          onUpdate: () => {
            setRowProgress((prev) => {
              const next = [...prev];
              next[idx] = stateObj.progress;
              return next;
            });
          },
        });

        if (text) {
          tl.to(
            text,
            {
              opacity: 0.38,
              ease: MOTION.ease.linear,
              duration: 1,
            },
            0.2,
          );
        }
      });

      const closingEl = container.querySelector<HTMLElement>('.strike-closing');
      if (closingEl) {
        gsap.fromTo(
          closingEl,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            ease: MOTION.ease.reveal,
            scrollTrigger: {
              trigger: closingEl,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    },
    { scope: containerRef, dependencies: [shouldSimplifyMotion, items.length] },
  );

  return (
    <div ref={containerRef} className={cn('space-y-16 md:space-y-24', className)}>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item, idx) => {
          const number = String(idx + 1).padStart(2, '0');
          const progressValue = shouldSimplifyMotion ? 1 : (rowProgress[idx] ?? 0);

          return (
            <li
              key={item}
              className="strike-row relative flex items-baseline gap-6 py-8 md:gap-12 md:py-12"
            >
              <span className="text-label-mono shrink-0 text-ink-muted">{number}</span>
              <div className="relative flex-1">
                <p
                  className={cn(
                    'strike-row-text text-heading-m text-ink transition-opacity',
                    shouldSimplifyMotion && 'opacity-45',
                  )}
                >
                  {item}
                </p>
                <div className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2">
                  <FlowingLine
                    variant="strike"
                    taper
                    physics={false}
                    progress={progressValue}
                    className="h-7 w-full"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="strike-closing pt-4 md:pt-8">
        <p className="text-display-l max-w-[26ch] text-ink">{closingStatement}</p>
      </div>
    </div>
  );
}
