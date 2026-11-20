'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ScrollText } from '@/components/motion/ScrollText';
import { useLenis } from '@/components/motion/SmoothScroll';
import {
  SERVICES_CONTENT,
  type StickyNavSectionItem,
} from '@/features/services/services.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Section 2: Sticky Service Navigation and Intro (`src/features/services/sections/ServicesStickyNav.tsx`)
 * - Slim sticky bar beneath the header: `BRANDING · WEB · MARKETING · PROCESS · PACKAGES · FAQ`
 * - Active item underlined in `--line-accent` via IntersectionObserver scroll-spy
 * - Smoothly scrolls via Lenis on click; keyboard accessible; horizontally scrollable strip on mobile
 * - Followed by the large `ScrollText` statement
 */
export function ServicesStickyNav() {
  const { stickyNav } = SERVICES_CONTENT;
  const lenis = useLenis();
  const { shouldSimplifyMotion } = useMotionPreference();

  const [activeId, setActiveId] = useState<StickyNavSectionItem['id']>('branding');

  useEffect(() => {
    const targets = stickyNav.items
      .map((item) => ({
        id: item.id,
        el: document.getElementById(item.targetId),
      }))
      .filter((entry): entry is { id: StickyNavSectionItem['id']; el: HTMLElement } =>
        Boolean(entry.el),
      );

    if (targets.length === 0) return;

    const updateActiveFromScroll = () => {
      const probeY = window.innerHeight * 0.32;
      let matched: StickyNavSectionItem['id'] | null = null;
      for (const target of targets) {
        const rect = target.el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > 100) {
          matched = target.id;
        }
      }
      if (matched) {
        setActiveId(matched);
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const found = targets.find((t) => t.el === entry.target);
              if (found) {
                setActiveId(found.id);
              }
            }
          }
        },
        {
          rootMargin: '-22% 0px -58% 0px',
          threshold: 0,
        },
      );
      targets.forEach((t) => observer?.observe(t.el));
    }

    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    updateActiveFromScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updateActiveFromScroll);
    };
  }, [stickyNav.items]);

  const handleNavClick = (item: StickyNavSectionItem) => {
    setActiveId(item.id);
    track('services_nav_clicked', { section: item.id });

    const targetEl = document.getElementById(item.targetId);
    if (!targetEl) return;

    if (lenis && !shouldSimplifyMotion) {
      lenis.scrollTo(targetEl, { offset: -112, duration: 0.85 });
    } else {
      targetEl.scrollIntoView({ behavior: shouldSimplifyMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky service navigation bar */}
      <div
        data-testid="services-sticky-nav"
        className="sticky top-20 z-30 border-y border-line bg-bg"
      >
        <Container>
          <nav
            aria-label={stickyNav.ariaLabel}
            className="flex items-center gap-6 overflow-x-auto py-3.5 md:gap-8"
          >
            {stickyNav.items.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <div key={item.id} className="flex shrink-0 items-center gap-6 md:gap-8">
                  <button
                    type="button"
                    data-testid={`services-nav-item-${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      'text-label-mono border-b-2 pb-1 transition-colors duration-200',
                      isActive
                        ? 'border-line-accent text-ink'
                        : 'border-transparent text-ink-muted hover:text-ink',
                    )}
                  >
                    {item.label}
                  </button>
                  {idx < stickyNav.items.length - 1 && (
                    <span aria-hidden="true" className="text-label-mono text-ink-muted/50">
                      ·
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </Container>
      </div>

      {/* Intro statement section */}
      <section
        id="services-intro"
        className="border-b border-line py-[var(--section-pad-y)]"
      >
        <Container>
          <div className="max-w-[44ch]">
            <ScrollText
              text={stickyNav.introStatement}
              className="text-display-m text-ink"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
