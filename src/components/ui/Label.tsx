import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  withStatusDot?: boolean;
  muted?: boolean;
}

/**
 * Mono uppercase label used for section headers (`01 / SERVICES`), counters, and status indicators.
 */
export function Label({
  children,
  withStatusDot = false,
  muted = true,
  className,
  ...props
}: LabelProps) {
  return (
    <span
      className={cn(
        'text-label-mono inline-flex items-center gap-2.5',
        muted ? 'text-ink-muted' : 'text-ink',
        className,
      )}
      {...props}
    >
      {withStatusDot && (
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-green-signal shadow-[0_0_0_3px_rgba(25,227,122,0.18)]"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
