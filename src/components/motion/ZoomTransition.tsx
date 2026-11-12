'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, Flip } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useZoomStore } from '@/store/zoom';

/**
 * Persistent `ZoomTransition` overlay mounted in `app/(marketing)/work/layout.tsx`
 * (Work Prompt Section 5 & Tech Stack Section 4.1):
 * - Zoom in (Stage 1 -> Stage 2 and Stage 2 -> Stage 3): creates a fixed clone over the
 *   origin preview frame and uses GSAP Flip / transform scale to expand it to fill the
 *   entire viewport (`power4.inOut`, ~0.95s) with inner counter-scaling before handing off
 *   to the destination route.
 * - Zoom out (Back control or browser Back): shrinks from the viewport back to the stored
 *   origin rect, or falls back to a clean crossfade if no origin rect was stored (deep link / refresh)
 *   or if reduced motion is enabled.
 */
export function ZoomTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cloneRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const activeTweenRef = useRef<gsap.core.Timeline | null>(null);

  const { shouldSimplifyMotion } = useMotionPreference();
  const activeRequest = useZoomStore((s) => s.activeRequest);
  const clearZoom = useZoomStore((s) => s.clearZoom);

  // Trigger zoom animation when `activeRequest` is set
  useEffect(() => {
    if (!activeRequest) return;

    const overlay = overlayRef.current;
    const clone = cloneRef.current;
    const inner = innerRef.current;

    // Kill any in-flight tween if user clicked rapidly
    activeTweenRef.current?.kill();

    if (shouldSimplifyMotion || !overlay || !clone || !inner) {
      router.push(activeRequest.targetHref);
      clearZoom();
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = activeRequest.fromRect;

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(activeRequest.targetHref);
      },
    });
    activeTweenRef.current = tl;

    gsap.set(overlay, { autoAlpha: 1 });

    if (activeRequest.direction === 'in' && rect && rect.width > 0 && rect.height > 0) {
      // Position clone over source frame, then Flip to full-viewport state
      gsap.set(clone, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: '6px',
        opacity: 1,
      });
      gsap.set(inner, { scale: 1.12 });

      const state = Flip.getState(clone);
      gsap.set(clone, {
        left: 0,
        top: 0,
        width: vw,
        height: vh,
        borderRadius: '0px',
      });

      tl.add(
        Flip.from(state, {
          duration: MOTION.duration.zoomTransition * 0.55,
          ease: MOTION.ease.transition,
        }),
        0,
      );

      tl.to(
        inner,
        {
          scale: 1,
          duration: MOTION.duration.zoomTransition * 0.55,
          ease: MOTION.ease.transition,
        },
        0,
      );
    } else if (activeRequest.direction === 'out' && rect && rect.width > 0 && rect.height > 0) {
      // Shrink from full viewport toward the stored origin rect as route changes
      gsap.set(clone, {
        left: 0,
        top: 0,
        width: vw,
        height: vh,
        borderRadius: '0px',
        opacity: 1,
      });
      gsap.set(inner, { scale: 1 });

      const state = Flip.getState(clone);
      gsap.set(clone, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: '6px',
      });

      tl.add(
        Flip.from(state, {
          duration: MOTION.duration.zoomTransition * 0.5,
          ease: MOTION.ease.transition,
        }),
        0,
      );
    } else {
      // Fallback crossfade when no origin rect is available (deep link or refresh)
      gsap.set(clone, {
        left: 0,
        top: 0,
        width: vw,
        height: vh,
        borderRadius: '0px',
        opacity: 0,
      });
      tl.to(clone, {
        opacity: 1,
        duration: 0.28,
        ease: MOTION.ease.smoothOut,
      });
    }
  }, [activeRequest, shouldSimplifyMotion, router, clearZoom]);

  // Dissolve the clone smoothly once the new route renders and move focus to the page h1
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !activeRequest) return;

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.32,
      ease: MOTION.ease.smoothOut,
      delay: 0.04,
      onComplete: () => {
        clearZoom();
      },
    });
  }, [pathname, activeRequest, clearZoom]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[65] opacity-0"
    >
      <div
        ref={cloneRef}
        className="fixed overflow-hidden border border-line bg-surface"
      >
        <div
          ref={innerRef}
          className="flex h-full w-full flex-col items-center justify-center gap-4 bg-surface p-8 will-change-transform"
        >
          {activeRequest?.title && (
            <span className="text-display-l text-center text-ink">
              {activeRequest.title}
            </span>
          )}
          <span className="text-label-mono border border-line bg-bg/85 px-3.5 py-1.5 text-ink-muted">
            {activeRequest?.label ?? 'PROJECT MEDIA 16:9'}
          </span>
        </div>
      </div>
    </div>
  );
}
