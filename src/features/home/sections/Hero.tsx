'use client';

import { useState, type MouseEvent } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { HOME_CONTENT } from '@/features/home/home.content';
import { track } from '@/lib/analytics';

/**
 * Section 1: Hero (Home Prompt Section 4.1)
 * - Top-left mono status: green dot and "Available for new projects"
 * - Mono eyebrow: BRAND • BUILD • GROW
 * - Display XL h1 with line-by-line mask reveal on load
 * - Interactive flowing line behind headline (reacts to pointer, scroll velocity, and click/tap ripples)
 * - Primary ("Start a project") & secondary ("See our work") buttons + reassurance mono line
 * - Bottom bar: tagline left, "Scroll to explore" right, and regions line at the very bottom
 */
export function Hero() {
  const { hero } = HOME_CONTENT;
  const [rippleCount, setRippleCount] = useState(0);

  const handleHeroClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;
    setRippleCount((prev) => prev + 1);
  };

  return (
    <section
      id="hero"
      onClick={handleHeroClick}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14"
    >
      {/* Signature Interactive Flowing Line (Occurrence 1 of 4) */}
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 -z-0 -translate-y-1/2">
        <FlowingLine
          amplitude={26}
          frequency={0.0045}
          speed={0.028}
          thickness={1.8}
          reactToPointer
          rippleCount={rippleCount}
          className="h-44 md:h-64"
        />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-between gap-12">
        {/* Top bar: Status dot + Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <Label withStatusDot muted={false}>
            {hero.status}
          </Label>
          <TagList items={hero.eyebrow} />
        </div>

        {/* Asymmetric editorial main block */}
        <div className="my-auto py-8 md:py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <SplitReveal
                as="h1"
                triggerOnLoad
                className="text-display-xl max-w-[14ch] text-ink"
              >
                {hero.headline}
              </SplitReveal>
            </div>

            <div className="lg:col-span-8 lg:col-start-1">
              <Reveal delay={0.15} className="space-y-8">
                <p className="text-body-l max-w-[54ch] text-ink-muted">{hero.subheadline}</p>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      href={hero.primaryCta.href}
                      variant="primary"
                      onClick={() => track('start_project_click', { location: 'hero' })}
                    >
                      {hero.primaryCta.label}
                    </Button>
                    <Button href={hero.secondaryCta.href} variant="secondary" icon="arrow_downward">
                      {hero.secondaryCta.label}
                    </Button>
                  </div>

                  <p className="text-label-mono text-ink-muted">{hero.reassurance}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Bottom bar: short tagline, scroll cue, and regions line */}
        <div className="space-y-4 border-t border-line pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-label-mono text-ink">{hero.bottomLeftTagline}</p>

            <a
              href="#statement"
              className="text-label-mono inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
            >
              <span>{hero.scrollCue}</span>
              <Icon
                name="arrow_downward"
                size={20}
                className=" motion-safe:animate-bounce"
              />
            </a>
          </div>

          <p className="text-label-mono text-ink-muted">{hero.regionsLine}</p>
        </div>
      </Container>
    </section>
  );
}
