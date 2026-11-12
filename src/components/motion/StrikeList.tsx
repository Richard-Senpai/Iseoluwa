'use client';

import { useRef } from 'react';
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
 * Reusable `StrikeList` motion component (Home Prompt Section 4.3):
 * As each problem line scrolls to the center, an accent SVG flowing line draws
 * across it like a strike-through (`DrawSVG`) and the text dims to muted.
 * After the last line, the closing statement reveals at full size.
 * With reduced motion, lines render already struck through and the closing statement is visible.
 */
export function StrikeList({ items, closingStatement, className }: StrikeListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || shouldSimplifyMotion) return;

      const rows = container.querySelectorAll<HTMLElement>('.strike-row');
      rows.forEach((row) => {
        const path = row.querySelector<SVGPathElement>('.strike-line-path');
        const text = row.querySelector<HTMLElement>('.strike-row-text');

        if (path) {
          gsap.set(path, { drawSVG: '0%' });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 65%',
            end: 'bottom 45%',
            scrub: true,
          },
        });

        if (path) {
          tl.to(path, {
            drawSVG: '100%',
            ease: MOTION.ease.linear,
            duration: 1,
          });
        }

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
                <svg
                  aria-hidden="true"
                  viewBox="0 0 1000 28"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute top-1/2 left-0 h-5 w-full -translate-y-1/2 overflow-visible"
                >
                  <path
                    className="strike-line-path"
                    d="M 0 14 Q 250 4, 500 15 T 1000 12"
                    fill="none"
                    stroke="var(--line-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
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
