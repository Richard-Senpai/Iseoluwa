'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';

/**
 * Section 9: The Standard — Slogan (About Prompt Section B3.9)
 * - Full-width statement in Display L with the full slogan, revealed line by line:
 *   "We dot every i and cross every t. We iron out every rough edge and leave nothing untouched. We treat every project as work done unto the Lord."
 */
export function TheStandard() {
  const { theStandard } = ABOUT_CONTENT;

  return (
    <section
      id="the-standard"
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-10 md:space-y-14">
        <Label>{theStandard.sectionLabel}</Label>

        <blockquote className="max-w-[26ch]">
          <SplitReveal as="p" className="text-display-l text-ink">
            {theStandard.slogan}
          </SplitReveal>
        </blockquote>
      </Container>
    </section>
  );
}
