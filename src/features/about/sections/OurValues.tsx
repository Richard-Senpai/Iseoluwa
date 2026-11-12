'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { cn } from '@/lib/utils';

/**
 * Section 5: Our Values (About Prompt Section B3.5)
 * - Section label: 04 / OUR VALUES
 * - Headline: How we work.
 * - Five large rows with hairlines and a mono number each
 * - Hovering or focusing a row draws a short thick line under the value word and reveals its description (touch: tap to expand)
 */
export function OurValues() {
  const { values } = ABOUT_CONTENT;
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <section
      id="our-values"
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="space-y-4">
          <Label>{values.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {values.headline}
          </SplitReveal>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {values.items.map((item, idx) => {
            const isExpanded = activeIdx === idx;
            return (
              <div
                key={item.number}
                onMouseEnter={() => setActiveIdx(idx)}
                className="group transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onFocus={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx((prev) => (prev === idx ? null : idx))}
                  className="grid w-full grid-cols-1 items-baseline gap-4 py-8 text-left md:grid-cols-12 md:gap-8 md:py-10"
                >
                  {/* Mono number */}
                  <span className="text-label-mono text-ink-muted md:col-span-2">
                    {item.number}
                  </span>

                  {/* Value word + short thick accent line drawn underneath */}
                  <div className="md:col-span-5">
                    <span className="relative inline-block pb-3 font-sans text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.025em] text-ink">
                      {item.word}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute bottom-0 left-0 h-[6px] w-20 origin-left rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          isExpanded ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </span>
                  </div>

                  {/* Description revealed on hover / focus / tap (and always in DOM for SEO + screen readers) */}
                  <div className="md:col-span-5">
                    <p
                      className={cn(
                        'text-body-l text-ink-muted transition-all duration-300',
                        isExpanded
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-1 opacity-70 md:opacity-45 group-hover:translate-y-0 group-hover:opacity-100',
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
