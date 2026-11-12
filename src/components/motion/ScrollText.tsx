'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface ScrollTextProps {
  text: string;
  className?: string;
}

/**
 * Reusable `ScrollText` motion component (Home Prompt Section 4.2):
 * Words start at ~20% opacity and light up to full `--ink` as the visitor scrolls.
 * Reversible when scrolling up; renders at full opacity with reduced motion.
 */
export function ScrollText({ text, className }: ScrollTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  const words = text.split(' ');

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || shouldSimplifyMotion) return;

      const wordEls = el.querySelectorAll<HTMLElement>('.scroll-word');
      if (wordEls.length === 0) return;

      gsap.fromTo(
        wordEls,
        { opacity: 0.2 },
        {
          opacity: 1,
          ease: MOTION.ease.linear,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 42%',
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [shouldSimplifyMotion, text] },
  );

  return (
    <p ref={containerRef} className={cn('text-display-l text-ink', className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="scroll-word inline-block">
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  );
}
