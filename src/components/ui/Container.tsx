import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  bleed?: boolean;
}

/**
 * Enforces the 1600px max content width and responsive outer margins
 * (20px mobile, 40px tablet, 56px desktop) per Design System Section 4.
 */
export function Container({
  as: Component = 'div',
  children,
  bleed = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full',
        !bleed && 'max-w-content px-[var(--page-margin)]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
