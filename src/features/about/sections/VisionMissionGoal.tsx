'use client';

import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { ScrollText } from '@/components/motion/ScrollText';
import { ABOUT_CONTENT, type DrivingPillar } from '@/features/about/about.content';
import { cn } from '@/lib/utils';

/**
 * Section 4: Vision, Mission, and Goal (About Prompt Section B3.4)
 * - Section label: 03 / WHAT DRIVES US
 * - Black (`surface-inverse`) section
 * - Sticky mono label rail on the left listing VISION · MISSION · GOAL with the active one underlined in the accent colour
 * - Right column: three large statements scrolling through, each lighting up word by word (`ScrollText`)
 */
export function VisionMissionGoal() {
  const { whatDrivesUs } = ABOUT_CONTENT;
  const sectionRef = useRef<HTMLElement>(null);
  const [activePillarId, setActivePillarId] = useState<DrivingPillar['id']>('vision');

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const blocks = sectionRef.current.querySelectorAll<HTMLElement>('[data-pillar-id]');
      blocks.forEach((block) => {
        const pillarId = block.getAttribute('data-pillar-id') as DrivingPillar['id'] | null;
        if (!pillarId) return;

        ScrollTrigger.create({
          trigger: block,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActivePillarId(pillarId),
          onEnterBack: () => setActivePillarId(pillarId),
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="what-drives-us"
      ref={sectionRef}
      className="surface-inverse relative border-t border-white/15 py-[var(--section-pad-y)]"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Rail: 03 / WHAT DRIVES US + VISION · MISSION · GOAL */}
          <div className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-32">
              <p className="text-label-mono text-white/65">{whatDrivesUs.sectionLabel}</p>

              <nav aria-label="What drives us navigation" className="flex flex-wrap items-center gap-3">
                {whatDrivesUs.pillars.map((pillar, idx) => {
                  const isActive = pillar.id === activePillarId;
                  return (
                    <div key={pillar.id} className="inline-flex items-center gap-3">
                      <a
                        href={`#pillar-${pillar.id}`}
                        onClick={() => setActivePillarId(pillar.id)}
                        className={cn(
                          'text-label-mono relative pb-2 transition-colors duration-200',
                          isActive ? 'text-white' : 'text-white/50 hover:text-white/85',
                        )}
                      >
                        <span>{pillar.railLabel}</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isActive ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </a>
                      {idx < whatDrivesUs.pillars.length - 1 && (
                        <span aria-hidden="true" className="font-mono text-xs text-white/35">
                          {whatDrivesUs.railSeparator}
                        </span>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Column: Three Large Statements lit up word by word */}
          <div className="divide-y divide-white/15 lg:col-span-8">
            {whatDrivesUs.pillars.map((pillar) => (
              <article
                key={pillar.id}
                id={`pillar-${pillar.id}`}
                data-pillar-id={pillar.id}
                className="py-12 first:pt-0 last:pb-0 md:py-20"
              >
                <h2 className="text-label-mono mb-6 text-accent">{pillar.title}</h2>
                <ScrollText
                  text={pillar.statement}
                  className="text-display-m text-white"
                />
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
