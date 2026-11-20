'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { Accordion } from '@/components/ui/Accordion';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { SERVICES_CONTENT } from '@/features/services/services.content';

/**
 * Section 8: Services FAQ (`src/features/services/sections/ServicesFaq.tsx`)
 * - Section label `06 / QUESTIONS`
 * - Eight accordion items drawn from shared FAQ data (`SERVICES_FAQ_ITEMS`)
 * - Link: "See all questions" (to `/faq`)
 */
export function ServicesFaq() {
  const { faq } = SERVICES_CONTENT;

  return (
    <section
      id="services-faq"
      data-testid="services-faq-section"
      className="border-b border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[24ch] space-y-4">
            <Label>{faq.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {faq.headline}
            </SplitReveal>
          </div>

          <TransitionLink
            href={faq.seeAllHref}
            className="link-underline text-btn shrink-0 text-ink"
          >
            <span>{faq.seeAllLabel}</span>
            <Icon name="arrow_outward" size={20} />
          </TransitionLink>
        </div>

        <Accordion items={faq.items} idPrefix="services-faq" />
      </Container>
    </section>
  );
}
