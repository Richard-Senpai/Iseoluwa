'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { SITE_CONTENT } from '@/content/site';
import { useUIStore } from '@/store/ui.store';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { cn } from '@/lib/utils';

/**
 * Full-screen Menu Overlay (Design System Section 7 & Home Prompt Section 4):
 * - Giant editorial links (Home, Services, Work, About, FAQ, Contact).
 * - Mono block with email and WhatsApp, plus green status dot with "Available for new projects".
 * - Smooth GSAP open/close animation, Escape key handling, and full keyboard focus trap.
 */
export function MenuOverlay() {
  const pathname = usePathname();
  const isMenuOpen = useUIStore((s) => s.isMenuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const { shouldSimplifyMotion } = useMotionPreference();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Close menu on Escape and trap Tab focus inside while open
  useEffect(() => {
    if (!isMenuOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const overlayEl = overlayRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = overlayEl
      ? Array.from(overlayEl.querySelectorAll<HTMLElement>(focusableSelector))
      : [];

    const firstFocusable = focusables[0];
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isMenuOpen, setMenuOpen]);

  useGSAP(
    () => {
      const el = overlayRef.current;
      if (!el) return;

      if (shouldSimplifyMotion) {
        gsap.set(el, {
          autoAlpha: isMenuOpen ? 1 : 0,
          yPercent: 0,
        });
        return;
      }

      if (isMenuOpen) {
        gsap.to(el, {
          autoAlpha: 1,
          yPercent: 0,
          duration: MOTION.duration.pageTransition,
          ease: MOTION.ease.reveal,
        });
        gsap.fromTo(
          '.menu-link-item',
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION.duration.reveal,
            stagger: MOTION.stagger.items,
            ease: MOTION.ease.reveal,
            delay: 0.1,
          },
        );
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          yPercent: -4,
          duration: 0.4,
          ease: MOTION.ease.smoothOut,
        });
      }
    },
    { scope: overlayRef, dependencies: [isMenuOpen, shouldSimplifyMotion] },
  );

  return (
    <div
      id="global-menu-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={NAVIGATION_CONTENT.header.menuOpenLabel}
      aria-hidden={!isMenuOpen}
      className={cn(
        'surface-inverse fixed inset-0 z-40 flex flex-col justify-between pt-28 pb-12',
        !isMenuOpen && 'pointer-events-none invisible opacity-0',
      )}
    >
      <Container className="flex flex-1 flex-col justify-between gap-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <nav
            aria-label={NAVIGATION_CONTENT.header.menuOpenLabel}
            className="lg:col-span-8"
          >
            <ul className="divide-y divide-[#242424] border-y border-[#242424]">
              {NAVIGATION_CONTENT.mainLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="menu-link-item overflow-hidden">
                    <TransitionLink
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'group flex items-baseline justify-between py-4 transition-colors duration-200 md:py-5',
                        isActive ? 'text-green-signal' : 'text-[#f5f5f3] hover:text-green-signal',
                      )}
                    >
                      <span className="flex items-baseline gap-5 md:gap-8">
                        <span className="text-label-mono text-[#8f8f8a] group-hover:text-green-signal">
                          {item.number}
                        </span>
                        <span className="text-display-l">{item.label}</span>
                      </span>
                      <Icon
                        name="arrow_outward"
                        size={24}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col justify-between gap-8 lg:col-span-4 lg:pl-8">
            <div className="space-y-6">
              <Label withStatusDot muted={false} className="text-[#f5f5f3]">
                {SITE_CONTENT.statusText}
              </Label>

              <div className="space-y-3 pt-4">
                <p className="text-label-mono text-ink-muted">
                  {NAVIGATION_CONTENT.footer.columnHeadings.contact}
                </p>
                <a
                  href={`mailto:${SITE_CONTENT.contact.email}`}
                  className="link-underline block font-mono text-sm text-ink"
                >
                  {SITE_CONTENT.contact.email}
                </a>
                <a
                  href={SITE_CONTENT.contact.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline block font-mono text-sm text-ink"
                >
                  WhatsApp: {SITE_CONTENT.contact.whatsapp.display}
                </a>
                <a
                  href={SITE_CONTENT.contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline block font-mono text-sm text-ink"
                >
                  Instagram: {SITE_CONTENT.contact.instagram.handle}
                </a>
              </div>
            </div>

            <div className="space-y-3 border-t border-line pt-6">
              <p className="text-label-mono text-ink-muted">{SITE_CONTENT.taglineShort}</p>
              <p className="text-label-mono text-ink-muted">{SITE_CONTENT.regionsLine}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
