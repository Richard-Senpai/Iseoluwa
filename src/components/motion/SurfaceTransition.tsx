'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

export interface SurfaceTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable `SurfaceTransition` ("Rising Tide") motion component
 * (Design System Section 14.3 & Fixes Prompt Section 3.3):
 * - Never interpolates text or background colours through mid-grey.
 * - Keeps the closing section's text in its constant theme colour (`--ink`) at all scroll positions.
 * - A dark panel (`#0A0A0A` in light mode, `#06150E` in dark mode) with a gentle wave top edge
 *   rises from the bottom padding zone (`clamp(128px, 24vh, 280px)`) scrubbed to scroll and
 *   reversible when scrolling up.
 * - No text sits inside the tide zone while it is rising.
 * - When the tide / footer top edge passes the fixed header, flips `isFooterDarkZone` cleanly.
 * - Under `prefers-reduced-motion: reduce`, skips the rising tide and renders a clean static boundary.
 */
export function SurfaceTransition({ children, className }: SurfaceTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tidePanelRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();
  const setFooterDarkZone = useUIStore((s) => s.setFooterDarkZone);

  useGSAP(
    () => {
      const wrapperEl = wrapperRef.current;
      const tideEl = tidePanelRef.current;
      if (!wrapperEl) return;

      // Header flip trigger when the tide / footer passes the fixed header (top <= 72px)
      const headerFlipTrigger = ScrollTrigger.create({
        trigger: wrapperEl,
        start: 'bottom 72px',
        end: 'bottom top',
        onEnter: () => setFooterDarkZone(true),
        onLeaveBack: () => setFooterDarkZone(false),
      });

      if (shouldSimplifyMotion || !tideEl) {
        return () => {
          headerFlipTrigger.kill();
          setFooterDarkZone(false);
        };
      }

      gsap.set(tideEl, { yPercent: 100 });

      const tween = gsap.to(tideEl, {
        yPercent: 0,
        ease: MOTION.ease.linear,
        scrollTrigger: {
          trigger: wrapperEl,
          start: 'top 60%',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: () => {
            const rect = tideEl.getBoundingClientRect();
            setFooterDarkZone(rect.top <= 72);
          },
          onLeaveBack: () => {
            setFooterDarkZone(false);
          },
        },
      });

      return () => {
        tween.kill();
        headerFlipTrigger.kill();
        setFooterDarkZone(false);
      };
    },
    { scope: wrapperRef, dependencies: [shouldSimplifyMotion, setFooterDarkZone] },
  );

  return (
    <div
      ref={wrapperRef}
      className={cn('relative isolate bg-bg text-ink', className)}
    >
      <div className="relative z-10">{children}</div>

      {!shouldSimplifyMotion && (
        <div
          data-testid="rising-tide-zone"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[clamp(128px,24vh,280px)] overflow-hidden"
        >
          <div
            ref={tidePanelRef}
            data-testid="rising-tide-panel"
            className="flex h-full w-full flex-col"
          >
            {/* Gentle wave top edge */}
            <svg
              viewBox="0 0 1440 48"
              preserveAspectRatio="none"
              className="block h-8 w-full shrink-0 fill-[#0a0a0a] dark:fill-[#06150e] md:h-12"
            >
              <path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" />
            </svg>
            <div className="w-full flex-1 bg-[#0a0a0a] dark:bg-[#06150e]" />
          </div>
        </div>
      )}
    </div>
  );
}
