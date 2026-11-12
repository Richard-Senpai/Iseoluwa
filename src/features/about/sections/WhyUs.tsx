'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';

/**
 * Section 6: What Makes Us Different — Why Us (About Prompt Section B3.6)
 * - Section label: 05 / WHY US
 * - Two columns with a sticky title on the left and four short statements on the right
 */
export function WhyUs() {
  const { whyUs } = ABOUT_CONTENT;

  return (
    <section
      id="why-us"
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Title Column */}
          <div className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-32">
              <Label>{whyUs.sectionLabel}</Label>
              <SplitReveal as="h2" className="text-display-l max-w-[12ch] text-ink">
                {whyUs.headline}
              </SplitReveal>
            </div>
          </div>

          {/* Right Column: Four Short Statements */}
          <div className="divide-y divide-line border-y border-line lg:col-span-7">
            {whyUs.items.map((item, idx) => (
              <Reveal key={item.number} delay={idx * 0.06} className="py-8 md:py-10">
                <div className="grid grid-cols-1 items-baseline gap-4 sm:grid-cols-12">
                  <span className="text-label-mono text-accent sm:col-span-2">
                    {item.number}
                  </span>
                  <div className="space-y-2 sm:col-span-10">
                    <h3 className="text-heading-m text-ink">{item.headline}</h3>
                    <p className="text-body-l text-ink-muted">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
