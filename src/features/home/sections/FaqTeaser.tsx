import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Accordion } from '@/components/ui/Accordion';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { HOME_CONTENT } from '@/features/home/home.content';

/**
 * Section 9: Questions people ask (FAQ teaser — Home Prompt Section 4.9)
 * - Section label: 07 / QUESTIONS. Headline: Questions we often hear.
 * - Four accordion items with smooth height animation, plus "See all questions" link to `/faq`.
 */
export function FaqTeaser() {
  const { faq } = HOME_CONTENT;

  return (
    <section
      id="faq"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Label>{faq.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {faq.headline}
            </SplitReveal>
          </div>

          <TransitionLink
            href={faq.seeAllLink.href}
            className="link-underline text-btn text-ink"
          >
            <span>{faq.seeAllLink.label}</span>
            <Icon name="arrow_outward" size={20} />
          </TransitionLink>
        </div>

        <Accordion items={faq.items} />
      </Container>
    </section>
  );
}
