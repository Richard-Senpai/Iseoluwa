'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { NameScene } from '@/features/about/sections/NameScene';

/**
 * Section 2: The Name (`src/features/about/sections/TheName.tsx`)
 * - Section label: 01 / THE NAME + plain pronunciation line (`Pronounced ee-sheh-oh-loo-wah`)
 * - Part A (normal scroll):
 *   - Huge "iséoluwa" that splits into two parts on scroll ("isé" means work. / "oluwa" means the Lord.)
 * - Part B (pinned stage via `NameScene`):
 *   - Scroll-scrubbed animation large and centered on top, with the statement directly beneath it,
 *     pinned together and driven by a single ScrollTrigger timeline until the last frame and last word complete.
 */
export function TheName() {
  const { theName } = ABOUT_CONTENT;
  const splitTriggerRef = useRef<HTMLDivElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null);
  const rightPartRef = useRef<HTMLDivElement>(null);
  const leftMeaningRef = useRef<HTMLDivElement>(null);
  const rightMeaningRef = useRef<HTMLDivElement>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useGSAP(
    () => {
      if (shouldSimplifyMotion || !splitTriggerRef.current) return;

      const leftEl = leftPartRef.current;
      const rightEl = rightPartRef.current;
      const leftMeaning = leftMeaningRef.current;
      const rightMeaning = rightMeaningRef.current;

      if (!leftEl || !rightEl || !leftMeaning || !rightMeaning) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTriggerRef.current,
          start: 'top 70%',
          end: 'bottom 35%',
          scrub: 0.6,
        },
      });

      // Phase 1: Split apart and reveal meanings
      tl.fromTo(
        leftEl,
        { xPercent: 0 },
        { xPercent: -12, duration: 0.45, ease: 'power2.out' },
        0,
      )
        .fromTo(
          rightEl,
          { xPercent: 0 },
          { xPercent: 12, duration: 0.45, ease: 'power2.out' },
          0,
        )
        .fromTo(
          [leftMeaning, rightMeaning],
          { y: 10 },
          { y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          0.05,
        )
        // Phase 2: Rejoin smoothly before entering the pinned NameScene
        .to(
          [leftEl, rightEl],
          { xPercent: 0, duration: 0.45, ease: 'power2.inOut' },
          0.6,
        );
    },
    { scope: splitTriggerRef, dependencies: [shouldSimplifyMotion] },
  );

  const [firstPart, secondPart] = theName.parts;

  return (
    <section
      id="the-name"
      className="relative overflow-x-clip border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Label>{theName.sectionLabel}</Label>
          <p className="text-label-mono text-ink-muted">{theName.pronunciation}</p>
        </div>

        {/* Part A: "isé means work. oluwa means the Lord." in normal scrolling */}
        <div
          ref={splitTriggerRef}
          data-testid="name-meaning-intro"
          className="border-b border-line py-8 md:py-14"
        >
          <div
            aria-label={theName.fullWordmark}
            className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-baseline md:justify-center md:gap-6"
          >
            {/* Part 1: isé */}
            <div
              ref={leftPartRef}
              className="flex flex-col items-center text-center md:items-end md:text-right"
            >
              <span className="font-sans text-[clamp(3.75rem,9.5vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink">
                {firstPart.part}
              </span>
              <div
                ref={leftMeaningRef}
                className="mt-4 flex items-center gap-2 border-t border-line pt-3"
              >
                <span className="text-label-mono text-ink-muted">
                  {firstPart.meaningPrefix}
                </span>
                <span className="font-sans text-lg font-medium text-ink md:text-xl">
                  {firstPart.meaning}
                </span>
              </div>
            </div>

            {/* Subtle accent separator dot */}
            <span
              aria-hidden="true"
              className="hidden h-3 w-3 shrink-0 rounded-full bg-accent md:inline-block"
            />

            {/* Part 2: oluwa */}
            <div
              ref={rightPartRef}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <span className="font-sans text-[clamp(3.75rem,9.5vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink">
                {secondPart.part}
              </span>
              <div
                ref={rightMeaningRef}
                className="mt-4 flex items-center gap-2 border-t border-line pt-3"
              >
                <span className="text-label-mono text-ink-muted">
                  {secondPart.meaningPrefix}
                </span>
                <span className="font-sans text-lg font-medium text-ink md:text-xl">
                  {secondPart.meaning}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Part B: Single pinned stage with centered animation on top and statement beneath */}
        <NameScene />
      </Container>
    </section>
  );
}
