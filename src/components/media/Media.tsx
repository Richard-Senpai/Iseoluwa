import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface MediaProps {
  type?: 'placeholder' | 'image';
  src?: string;
  alt: string;
  label?: string;
  aspectRatio?: '16/9' | '4/5' | '1/1';
  priority?: boolean;
  sizes?: string;
  className?: string;
}

const ASPECT_CLASSES: Record<'16/9' | '4/5' | '1/1', string> = {
  '16/9': 'aspect-video',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
};

/**
 * Media component (Tech Stack Section 5.1 & Design System Section 8).
 * Renders `next/image` when `src` is provided, or a clean flat `--surface` block
 * with a mono label (`PROJECT MEDIA 16:9`) until real media is supplied.
 */
export function Media({
  type = 'placeholder',
  src,
  alt,
  label,
  aspectRatio = '16/9',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1600px) 90vw, 1600px',
  className,
}: MediaProps) {
  const aspectClass = ASPECT_CLASSES[aspectRatio];

  if (type === 'image' && src) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-card bg-surface', aspectClass, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden rounded-card border border-line bg-surface',
        aspectClass,
        className,
      )}
    >
      {/* Subtle architectural crosshair lines inside placeholder frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 border border-dashed border-line/60"
      />
      {label && (
        <span className="text-label-mono relative z-10 border border-line bg-bg/80 px-3 py-1.5 text-ink-muted backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
