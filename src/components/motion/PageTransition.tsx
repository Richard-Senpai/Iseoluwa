'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';

export interface PageTransitionProps {
  children: ReactNode;
}

interface NavigateEventDetail {
  href: string;
  title: string;
}

/**
 * Global PageTransition provider (Design System Section 6.5 & Tech Stack Section 4.4):
 * A black panel slides across, displays the destination page title in mono, changes the route,
 * and exits (~700ms total). Resets scroll to top and moves focus to the new page `h1`.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const isAnimatingRef = useRef(false);

  const { shouldSimplifyMotion } = useMotionPreference();
  const transitionTargetTitle = useUIStore((s) => s.transitionTargetTitle);
  const setTransitionTargetTitle = useUIStore((s) => s.setTransitionTargetTitle);

  // Mark global transition listener active for TransitionLink
  useEffect(() => {
    const win = window as Window & { __iseoluwaTransitionActive?: boolean };
    win.__iseoluwaTransitionActive = true;
    return () => {
      win.__iseoluwaTransitionActive = false;
    };
  }, []);

  // Listen for custom navigation events dispatched by TransitionLink
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<NavigateEventDetail>;
      const { href, title } = customEvent.detail;

      if (shouldSimplifyMotion || !panelRef.current) {
        router.push(href);
        return;
      }

      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setTransitionTargetTitle(title);

      const panel = panelRef.current;
      const label = labelRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href);
        },
      });

      tl.set(panel, { yPercent: 100, autoAlpha: 1 });
      if (label) {
        tl.set(label, { opacity: 0, y: 12 });
      }

      tl.to(panel, {
        yPercent: 0,
        duration: MOTION.duration.pageTransition * 0.5,
        ease: MOTION.ease.transition,
      });

      if (label) {
        tl.to(
          label,
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: MOTION.ease.smoothOut,
          },
          '-=0.15',
        );
      }
    };

    window.addEventListener('iseoluwa:navigate', handleNavigate);
    return () => window.removeEventListener('iseoluwa:navigate', handleNavigate);
  }, [router, shouldSimplifyMotion, setTransitionTargetTitle]);

  // Complete the exit wipe when pathname updates
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    ScrollTrigger.refresh();

    // Move focus to the new page heading for accessibility
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }

    const panel = panelRef.current;
    if (!panel || !isAnimatingRef.current) return;

    gsap.to(panel, {
      yPercent: -100,
      duration: MOTION.duration.pageTransition * 0.5,
      ease: MOTION.ease.transition,
      delay: 0.05,
      onComplete: () => {
        gsap.set(panel, { autoAlpha: 0, yPercent: 100 });
        isAnimatingRef.current = false;
        setTransitionTargetTitle(null);
      },
    });
  }, [pathname, setTransitionTargetTitle]);

  return (
    <>
      <div
        ref={panelRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[70] flex items-center justify-center bg-[#0a0a0a] text-[#f5f5f3] opacity-0"
      >
        <span ref={labelRef} className="text-label-mono text-green-signal">
          {transitionTargetTitle}
        </span>
      </div>
      {children}
    </>
  );
}
