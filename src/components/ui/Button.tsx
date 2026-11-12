'use client';

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  icon?: IconName | null;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

/**
 * Design System Section 7 Button:
 * - Pill shaped, 48px tall (`h-12`), Aeonik Medium (`text-btn`).
 * - Primary: black fill with white text (inverted in dark mode), with `arrow_outward` icon.
 * - Hover: fill wipes upward to `--green-deep` (light mode) or `--green-signal` with black text (dark mode).
 * - Secondary: 1px `--line` border, same upward hover wipe.
 */
export function Button({
  variant = 'primary',
  href,
  icon = variant === 'primary' ? 'arrow_outward' : null,
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'group relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-pill px-6 text-btn transition-colors duration-300 select-none',
    variant === 'primary'
      ? 'bg-inverse-bg text-inverse-ink hover:text-[#ffffff] dark:hover:text-[#0a0a0a]'
      : 'border border-line bg-transparent text-ink hover:border-transparent hover:text-[#ffffff] dark:hover:text-[#0a0a0a]',
    className,
  );

  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 translate-y-full rounded-pill bg-green-deep transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 dark:bg-green-signal"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        <span>{children}</span>
        {icon && (
          <Icon
            name={icon}
            size={20}
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <TransitionLink
        href={href}
        className={baseClasses}
        onClick={(e) => onClick?.(e)}
      >
        {innerContent}
      </TransitionLink>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={baseClasses}
      onClick={(e) => onClick?.(e)}
      {...props}
    >
      {innerContent}
    </button>
  );
}
