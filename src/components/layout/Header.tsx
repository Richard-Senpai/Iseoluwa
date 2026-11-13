'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Wordmark } from '@/components/layout/Wordmark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Global Header (Design System Sections 7 & 13, Fixes Prompt Parts 1 & 3):
 * - Left: Wordmark (`iséoluwa`).
 * - Right: mono `Menu` button, `ThemeToggle`, and always-visible `Let's talk` primary button.
 * - Transparent over the hero; gains a blurred background (`backdrop-blur-md`) only after scrolling past the hero (`scrollY > 240`).
 * - Flips its ink and background state in a crisp 150ms tween at the moment the Rising Tide's top edge passes the header (`isFooterDarkZone`).
 */
export function Header() {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const isMenuOpen = useUIStore((s) => s.isMenuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const isFooterDarkZone = useUIStore((s) => s.isFooterDarkZone);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolledPastHero(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-colors duration-150',
        isFooterDarkZone || isMenuOpen
          ? 'border-b border-[#242424] bg-[#0a0a0a]/95 text-[#ffffff] backdrop-blur-md'
          : isScrolledPastHero
            ? 'border-b border-line bg-bg/95 text-ink backdrop-blur-md'
            : 'border-b border-transparent bg-bg/90 text-ink',
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <Wordmark />

        <div className="flex items-center gap-3 md:gap-5">
          <button
            id="header-menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="global-menu-overlay"
            onClick={toggleMenu}
            className="text-label-mono inline-flex h-10 items-center gap-2 rounded-pill border border-current/20 px-4 text-current transition-colors duration-150 hover:border-line-accent"
          >
            <span
              aria-hidden="true"
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-colors duration-150',
                isMenuOpen ? 'bg-green-signal' : 'bg-current',
              )}
            />
            <span>
              {isMenuOpen
                ? NAVIGATION_CONTENT.header.menuCloseLabel
                : NAVIGATION_CONTENT.header.menuOpenLabel}
            </span>
          </button>

          <ThemeToggle />

          <Button
            href={NAVIGATION_CONTENT.header.ctaHref}
            variant="primary"
            onClick={() => track('start_project_click', { location: 'header' })}
            className={cn(
              'h-10 px-4 text-xs md:h-11 md:px-5 md:text-sm',
              (isFooterDarkZone || isMenuOpen) &&
                'bg-[#ffffff] text-[#0a0a0a] hover:bg-green-signal hover:text-[#0a0a0a]',
            )}
          >
            {NAVIGATION_CONTENT.header.ctaLabel}
          </Button>
        </div>
      </Container>
    </header>
  );
}
