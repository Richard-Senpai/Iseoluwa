'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { NAVIGATION_CONTENT } from '@/content/navigation';

export interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: ReactNode;
  transitionTitle?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Shared link component that triggers the 700ms PageTransition wipe on internal navigation.
 * Falls back to immediate navigation when reduced motion is enabled or when clicking hash/same-route links.
 */
export function TransitionLink({
  href,
  children,
  transitionTitle,
  onClick,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { shouldSimplifyMotion } = useMotionPreference();
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const setTransitionTargetTitle = useUIStore((s) => s.setTransitionTargetTitle);

  const hrefString = typeof href === 'string' ? href : (href.pathname ?? '/');

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Allow modified clicks (new tab / window) to behave natively
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    // Hash links on the current page scroll smoothly without route wipe
    if (hrefString.startsWith('#')) {
      event.preventDefault();
      setMenuOpen(false);
      const targetId = hrefString.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: shouldSimplifyMotion ? 'auto' : 'smooth' });
      }
      return;
    }

    const targetPath = hrefString.split('?')[0] ?? '/';
    if (targetPath === pathname && !hrefString.includes('?')) {
      setMenuOpen(false);
      return;
    }

    if (shouldSimplifyMotion) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();
    setMenuOpen(false);

    const matchedNav = NAVIGATION_CONTENT.mainLinks.find((item) => item.href === targetPath);
    const label = transitionTitle ?? matchedNav?.label ?? targetPath.replace('/', '').toUpperCase();
    setTransitionTargetTitle(label || 'HOME');

    window.dispatchEvent(
      new CustomEvent('iseoluwa:navigate', {
        detail: { href: hrefString, title: label || 'HOME' },
      }),
    );

    // Fallback safety if PageTransition is not listening
    if (!(window as Window & { __iseoluwaTransitionActive?: boolean }).__iseoluwaTransitionActive) {
      router.push(hrefString);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
