'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Reveal } from '@/components/motion/Reveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { cn } from '@/lib/utils';

/**
 * Section 8: Where We Work (About Prompt Section B3.8)
 * - Section label: 07 / REACH
 * - Simple typographic section, no map: three large words "Africa · Europe · the Americas"
 * - Each reveals a mono line with the working hours overlap placeholder (`[Overlap hours...]`)
 * - Explanatory text on worldwide collaboration
 */
export function WhereWeWork() {
  const { whereWeWork } = ABOUT_CONTENT;
  const [activeRegionId, setActiveRegionId] = useState<string>(
    whereWeWork.regions[0]?.id ?? 'africa',
  );

  return (
    <section
      id="where-we-work"
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <Label>{whereWeWork.sectionLabel}</Label>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-body-l max-w-[54ch] text-ink-muted">{whereWeWork.body}</p>
            </Reveal>
          </div>
        </div>

        {/* Typographic regions row: Africa · Europe · the Americas */}
        <div className="divide-y divide-line border-y border-line">
          {whereWeWork.regions.map((region) => {
            const isSelected = activeRegionId === region.id;
            return (
              <div
                key={region.id}
                onMouseEnter={() => setActiveRegionId(region.id)}
                className="group"
              >
                <button
                  type="button"
                  aria-expanded={isSelected}
                  onFocus={() => setActiveRegionId(region.id)}
                  onClick={() => setActiveRegionId(region.id)}
                  className="flex w-full flex-col justify-between gap-4 py-8 text-left md:flex-row md:items-baseline md:py-10"
                >
                  <span className="font-sans text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ink transition-colors group-hover:text-ink">
                    {region.name}
                  </span>

                  <span
                    className={cn(
                      'text-label-mono inline-flex items-center gap-2 transition-all duration-300',
                      isSelected
                        ? 'translate-y-0 text-accent opacity-100'
                        : 'translate-y-0.5 text-ink-muted opacity-75 group-hover:text-accent group-hover:opacity-100',
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>{region.overlapHours}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
