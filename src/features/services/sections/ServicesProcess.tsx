'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SERVICES_CONTENT } from '@/features/services/services.content';

/**
 * Section 6: How We Work (`src/features/services/sections/ServicesProcess.tsx`)
 * - Section label `04 / PROCESS`
 * - Headline: A clear process, so you always know what happens next.
 * - Seven steps connected by the thick FlowingLine (Occurrence 2 of 3 on `/services`), which draws on scroll
 * - Followed by the "How we communicate" block
 */
export function ServicesProcess() {
  const { process } = SERVICES_CONTENT;

  return (
    <section
      id="process"
      data-testid="services-process-section"
      className="relative overflow-hidden border-b border-line py-[var(--section-pad-y)]"
    >
      <Container className="relative z-10 space-y-16 md:space-y-20">
        <div className="max-w-[20ch] space-y-4">
          <Label>{process.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {process.headline}
          </SplitReveal>
        </div>

        {/* Thick FlowingLine Occurrence 2 of 3 connecting the 7 process steps */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2">
            <FlowingLine
              weight="section"
              amplitude={20}
              frequency={0.004}
              speed={0.02}
              drawOnScroll
              className="h-28 md:h-40"
            />
          </div>

          <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((step) => (
              <li
                key={step.number}
                className="flex flex-col justify-between gap-6 rounded-card border border-line bg-bg p-6"
              >
                <span className="text-label-mono text-line-accent">{step.number}</span>
                <div className="space-y-2">
                  <h3 className="font-sans text-xl font-medium text-ink">{step.title}</h3>
                  <p className="text-body text-ink-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* How we communicate block */}
        <div className="space-y-8 rounded-card border border-line bg-surface p-6 md:p-10">
          <div className="space-y-2">
            <Label>{process.communication.label}</Label>
            <h3 className="text-heading-m text-ink">{process.communication.headline}</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {process.communication.items.map((item) => (
              <div
                key={item.id}
                className="space-y-2 border-t border-line pt-4"
              >
                <h4 className="font-sans text-base font-medium text-ink">{item.title}</h4>
                <p className="text-body text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
