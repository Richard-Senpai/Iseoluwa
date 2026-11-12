import type { SVGProps } from 'react';
import { ICON_REGISTRY, type IconName } from '@/assets/icons/registry';
import { cn } from '@/lib/utils';

export type { IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: 20 | 24;
  label?: string;
}

/**
 * Renders Google Material Symbols (Outlined, weight 300, optical size 24)
 * and monochrome brand marks in `currentColor`.
 */
export function Icon({ name, size = 20, label, className, ...props }: IconProps) {
  const icon = ICON_REGISTRY[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={cn('inline-block shrink-0 select-none', className)}
      {...props}
    >
      <path d={icon.path} />
    </svg>
  );
}
