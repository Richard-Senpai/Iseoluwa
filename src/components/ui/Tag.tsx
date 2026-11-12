import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TagListProps extends HTMLAttributes<HTMLDivElement> {
  items: string[];
}

/**
 * Mono uppercase tags separated by bullets (`BRAND • WEB • MARKETING`).
 * No pill backgrounds per Design System Section 7.
 */
export function TagList({ items, className, ...props }: TagListProps) {
  return (
    <div
      className={cn('text-label-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted', className)}
      {...props}
    >
      {items.map((item, idx) => (
        <span key={item} className="inline-flex items-center gap-2">
          <span>{item}</span>
          {idx < items.length - 1 && <span aria-hidden="true">•</span>}
        </span>
      ))}
    </div>
  );
}
