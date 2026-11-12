'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { ScrollText } from '@/components/motion/ScrollText';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ABOUT_CONTENT } from '@/features/about/about.content';

/**
 * Section 2: The Name (About Prompt Section B3.2)
 * - Section label: 01 / THE NAME
 * - Huge "iséoluwa" that splits into two parts on scroll:
 *   - "isé" means work.
 *   - "oluwa" means the Lord.
 * - Then the two join back together and reveal the statement word by word (`ScrollText`)
 * - Mono pronunciation line: `[Pronunciation: ee-sheh-oh-loo-wah]`
 */
export function TheName() {
  const { theName } = ABOUT_CONTENT;
  const sectionRef = useRef<HTMLElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null);
  const rightPartRef = useRef<HTMLDivElement>(null);
  const leftMeaningRef = useRef<HTMLDivElement>(null);
  const rightMeaningRef = useRef<HTMLDivElement>(null);
  const { shouldSimplifyMotion } = useMotionPreference();

  useGSAP(
    () => {
      if (shouldSimplifyMotion || !sectionRef.current) return;

      const leftEl = leftPartRef.current;
      const rightEl = rightPartRef.current;
      const leftMeaning = leftMeaningRef.current;
      const rightMeaning = rightMeaningRef.current;

      if (!leftEl || !rightEl || !leftMeaning || !rightMeaning) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 0.7,
        },
      });

      // Phase 1: Split apart and reveal meanings
      tl.fromTo(
        leftEl,
        { xPercent: 0 },
        { xPercent: -14, duration: 0.45, ease: 'power2.out' },
        0,
      )
        .fromTo(
          rightEl,
          { xPercent: 0 },
          { xPercent: 14, duration: 0.45, ease: 'power2.out' },
          0,
        )
        .fromTo(
          [leftMeaning, rightMeaning],
          { opacity: 0.25, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          0.08,
        )
        // Phase 2: Rejoin smoothly as scroll continues toward the statement
        .to(
          [leftEl, rightEl],
          { xPercent: 0, duration: 0.45, ease: 'power2.inOut' },
          0.6,
        );
    },
    { scope: sectionRef, dependencies: [shouldSimplifyMotion] },
  );

  const [firstPart, secondPart] = theName.parts;

  return (
    <section
      id="the-name"
      ref={sectionRef}
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-16 md:space-y-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Label>{theName.sectionLabel}</Label>
          <p className="text-label-mono text-ink-muted">{theName.pronunciation}</p>
        </div>

        {/* Typographic split & rejoin centerpiece */}
        <div className="py-4 md:py-10">
          <div
            aria-label={theName.fullWordmark}
            className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-baseline md:gap-4"
          >
            {/* Part 1: isé */}
            <div
              ref={leftPartRef}
              className="flex flex-col items-center text-center md:items-end md:text-right"
            >
              <span className="font-sans text-[clamp(3.75rem,11vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink">
                {firstPart.part}
              </span>
              <div
                ref={leftMeaningRef}
                className="mt-4 flex items-center gap-2 border-t border-line pt-3"
              >
                <span className="text-label-mono text-ink-muted">{firstPart.meaningPrefix}</span>
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
              <span className="font-sans text-[clamp(3.75rem,11vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink">
                {secondPart.part}
              </span>
              <div
                ref={rightMeaningRef}
                className="mt-4 flex items-center gap-2 border-t border-line pt-3"
              >
                <span className="text-label-mono text-ink-muted">{secondPart.meaningPrefix}</span>
                <span className="font-sans text-lg font-medium text-ink md:text-xl">
                  {secondPart.meaning}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Joined statement lit up word by word */}
        <div className="border-t border-line pt-12 md:pt-16">
          <div className="max-w-[44ch]">
            <ScrollText text={theName.statement} className="text-display-m text-ink" />
          </div>
        </div>
      </Container>
    </section>
  );
}
