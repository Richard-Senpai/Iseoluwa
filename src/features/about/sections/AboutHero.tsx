'use client';

import { useState, type MouseEvent } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { ABOUT_CONTENT } from '@/features/about/about.content';

/**
 * Section 1: About Hero (About Prompt Section B3.1)
 * - Mono label: ABOUT
 * - Headline (Display XL): Work done with care, from start to finish.
 * - Intro (Body L): Iseoluwa is a brand, web, and marketing studio...
 * - Thick hero flowing line (`weight="hero"`) weaving across the screen behind the headline (Occurrence 1 of 3 on About)
 * - Mono scroll cue: Scroll to explore
 */
export function AboutHero() {
  const { hero } = ABOUT_CONTENT;
  const [rippleCount, setRippleCount] = useState(0);

  const handleHeroClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;
    setRippleCount((prev) => prev + 1);
  };

  return (
    <section
      id="about-hero"
      onClick={handleHeroClick}
      className="relative flex min-h-[88vh] flex-col justify-between overflow-hidden pt-28 pb-12 md:min-h-[92vh] md:pt-36 md:pb-16"
    >
      {/* Thick hero FlowingLine (Occurrence 1 of 3 on /about) */}
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 -z-0 -translate-y-1/2">
        <FlowingLine
          weight="hero"
          amplitude={28}
          frequency={0.0042}
          speed={0.026}
          reactToPointer
          rippleCount={rippleCount}
          className="h-44 md:h-64"
        />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-between gap-12">
        <div className="border-b border-line pb-5">
          <Label muted={false}>{hero.label}</Label>
        </div>

        <div className="my-auto py-8 md:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-10">
              <SplitReveal
                as="h1"
                triggerOnLoad
                className="text-display-xl max-w-[15ch] text-ink"
              >
                {hero.headline}
              </SplitReveal>
            </div>

            <div className="lg:col-span-8 lg:col-start-1">
              <Reveal delay={0.14}>
                <p className="text-body-l max-w-[56ch] text-ink-muted">{hero.intro}</p>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-6">
          <a
            href="#the-name"
            className="text-label-mono inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
          >
            <span>{hero.scrollCue}</span>
            <Icon name="arrow_downward" size={20} className="motion-safe:animate-bounce" />
          </a>
        </div>
      </Container>
    </section>
  );
}
