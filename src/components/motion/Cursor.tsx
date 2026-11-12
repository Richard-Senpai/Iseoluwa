'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animation/gsap';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

/**
 * Custom desktop cursor (Design System Section 6.6 & Tech Stack Section 4.5):
 * - Small dot that follows pointer with smooth `gsap.quickTo` lag (no React re-renders on move).
 * - Grows into a ring with a mono label (`View`, `Talk`, `Play`, `Drag`) over interactive targets.
 * - Uses `--green-signal` on dark surfaces and `--ink` on light surfaces.
 * - Disabled on touch devices and when reduced motion is enabled.
 */
export function Cursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const cursorVariant = useUIStore((s) => s.cursorVariant);
  const cursorLabel = useUIStore((s) => s.cursorLabel);

  const isExpanded = cursorVariant !== 'default';

  useEffect(() => {
    const el = cursorRef.current;
    if (!el || shouldSimplifyMotion || isTouch) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3.out' });

    const handleMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [shouldSimplifyMotion, isTouch]);

  if (shouldSimplifyMotion || isTouch) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isExpanded
            ? 'h-20 w-20 border border-line-accent bg-bg/90 text-ink backdrop-blur-sm dark:border-green-signal dark:bg-[#0a0a0a]/90 dark:text-green-signal'
            : 'h-3 w-3 bg-ink dark:bg-green-signal',
        )}
      >
        {isExpanded && (
          <span className="text-label-mono text-[11px] tracking-[0.06em]">
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
}
