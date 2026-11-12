import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type HeadingSize = 'xl' | 'l' | 'm';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  size?: HeadingSize;
  children: ReactNode;
}

const SIZE_CLASSES: Record<HeadingSize, string> = {
  xl: 'text-display-xl',
  l: 'text-display-l',
  m: 'text-heading-m',
};

/**
 * Editorial headline component (Aeonik Regular, sentence case, tightly tracked, left aligned).
 */
export function Heading({
  as: Component = 'h2',
  size = 'l',
  children,
  className,
  ...props
}: HeadingProps) {
  return (
    <Component className={cn(SIZE_CLASSES[size], 'text-ink', className)} {...props}>
      {children}
    </Component>
  );
}
