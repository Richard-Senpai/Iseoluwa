import { TransitionLink } from '@/components/motion/TransitionLink';
import { SITE_CONTENT } from '@/content/site';
import { cn } from '@/lib/utils';

export interface WordmarkProps {
  className?: string;
}

/**
 * Single Wordmark component (Design System Section 1 & Home Prompt Section 2).
 * Renders lowercase `iséoluwa` in Aeonik Medium (`font-medium`) so a future SVG logo
 * can replace it in one place.
 */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <TransitionLink
      href="/"
      aria-label={SITE_CONTENT.displayName}
      className={cn(
        'inline-flex items-center font-sans text-xl font-medium tracking-[-0.03em] text-current md:text-2xl',
        className,
      )}
    >
      {SITE_CONTENT.wordmark}
    </TransitionLink>
  );
}
