'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { HOME_CONTENT } from '@/features/home/home.content';
import { track } from '@/lib/analytics';

/**
 * Section 7: How it works (Home Prompt Section 4.7)
 * - Section label: 05 / HOW IT WORKS
 * - Headline: A clear process, so you always know what happens next.
 * - Four steps connected by the FlowingLine (Occurrence 3 of 4), drawn as the visitor scrolls.
 * - Button under the steps: "Book a free call" + reassurance line.
 */
export function HowItWorks() {
  const { howItWorks } = HOME_CONTENT;

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="relative z-10 space-y-12 md:space-y-20">
        <div className="max-w-[38ch] space-y-4">
          <Label>{howItWorks.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {howItWorks.headline}
          </SplitReveal>
        </div>

        <div className="relative">
          {/* Flowing Line connecting the four process steps (Occurrence 3 of 4) */}
          <div className="pointer-events-none absolute top-1/2 right-0 left-0 -z-10 -translate-y-1/2">
            <FlowingLine
              amplitude={20}
              frequency={0.005}
              speed={0.02}
              drawOnScroll
              className="h-36 md:h-48"
            />
          </div>

          <ol className="grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {howItWorks.steps.map((step, idx) => (
              <li key={step.number} className="bg-bg/85 p-6 backdrop-blur-[2px] md:p-8">
                <Reveal delay={idx * 0.06} className="flex h-full flex-col justify-between gap-8">
                  <span className="font-mono text-2xl font-medium text-line-accent">
                    {step.number}
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-heading-m text-ink">{step.title}</h3>
                    <p className="text-body text-ink-muted">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            href={howItWorks.cta.href}
            variant="primary"
            onClick={() => track('book_call_click', { location: 'how_it_works' })}
          >
            {howItWorks.cta.label}
          </Button>
          <p className="text-label-mono text-ink-muted">{howItWorks.reassurance}</p>
        </div>
      </Container>
    </section>
  );
}
