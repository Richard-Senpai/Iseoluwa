'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface LoopVideoProps {
  src: string;
  poster: string;
  alt: string;
  aspectRatio?: '16/9' | '4/5' | '1/1';
  className?: string;
}

const ASPECT_CLASSES: Record<'16/9' | '4/5' | '1/1', string> = {
  '16/9': 'aspect-video',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
};

/**
 * Reusable silent loop video component (Tech Stack Section 5.2).
 * Autoplays only when near the viewport via IntersectionObserver and falls back
 * to the poster image on reduced motion or low-power/data-saver devices.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  aspectRatio = '16/9',
  className,
}: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldSimplifyMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            // Autoplay blocked by browser policy; poster remains visible
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldSimplifyMotion]);

  if (shouldSimplifyMotion) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-card bg-surface',
          ASPECT_CLASSES[aspectRatio],
          className,
        )}
      >
        <Image src={poster} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-card bg-surface',
        ASPECT_CLASSES[aspectRatio],
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
