'use client';

import { useRef, type ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

export interface SurfaceTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable `SurfaceTransition` motion component (Home Prompt Section 4.12):
 * Over the final stretch of the closing section before the footer, smoothly transitions
 * `--bg`, `--surface`, `--ink`, `--ink-muted`, `--line`, and `--line-accent` scrubbed to scroll:
 * - Light mode: `#FFFFFF` -> `#0A0A0A`
 * - Dark mode: `#0A0A0A` -> `#06150E` (deep green tint)
 * Scrolling up reverses it cleanly, and `isFooterDarkZone` keeps the global Header legible.
 */
export function SurfaceTransition({ children, className }: SurfaceTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const { shouldSimplifyMotion } = useMotionPreference();
  const setFooterDarkZone = useUIStore((s) => s.setFooterDarkZone);

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      const isDark = resolvedTheme === 'dark';
      const palette = isDark
        ? MOTION.surfaceTransition.dark
        : MOTION.surfaceTransition.light;

      if (shouldSimplifyMotion) {
        gsap.set(el, palette.from);
        return;
      }

      gsap.fromTo(el, palette.from, {
        ...palette.to,
        ease: MOTION.ease.linear,
        scrollTrigger: {
          trigger: el,
          start: 'top 55%',
          end: 'bottom 85%',
          scrub: true,
          onUpdate: (self) => {
            setFooterDarkZone(self.progress > 0.45);
          },
          onLeaveBack: () => {
            setFooterDarkZone(false);
          },
        },
      });

      return () => {
        setFooterDarkZone(false);
      };
    },
    { scope: wrapperRef, dependencies: [resolvedTheme, shouldSimplifyMotion, setFooterDarkZone] },
  );

  return (
    <div
      ref={wrapperRef}
      className={cn('bg-bg text-ink transition-none', className)}
    >
      {children}
    </div>
  );
}
