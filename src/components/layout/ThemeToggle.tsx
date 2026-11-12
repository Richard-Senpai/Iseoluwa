'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { useTheme } from 'next-themes';
import { Icon } from '@/components/ui/Icon';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Switches between light and dark themes with a circular clip-path reveal
 * originating from the toggle button via the View Transitions API (Design System Section 6.7).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { shouldSimplifyMotion } = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? 'light' : 'dark';
    const doc = document as DocumentWithViewTransition;

    if (shouldSimplifyMotion || !doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    void transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: MOTION.duration.themeReveal * 1000,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // Fallback if view transition is interrupted
      });
  };

  return (
    <button
      id="theme-toggle-button"
      type="button"
      aria-label={NAVIGATION_CONTENT.header.themeToggleAriaLabel}
      onClick={handleToggle}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 text-current transition-colors duration-200 hover:border-line-accent',
        className,
      )}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={20} />
    </button>
  );
}
