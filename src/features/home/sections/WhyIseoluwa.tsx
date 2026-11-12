import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { HOME_CONTENT } from '@/features/home/home.content';

/**
 * Section 6: Why Iséoluwa (Home Prompt Section 4.6)
 * - Section label: 04 / WHY ISÉOLUWA. Headline: Why work with us.
 * - Sticky headline on the left while the 5 hairline-separated items scroll on the right.
 * - Large mono numerals (01–05). No icons.
 */
export function WhyIseoluwa() {
  const { whyIseoluwa } = HOME_CONTENT;

  return (
    <section
      id="why-iseoluwa"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left sticky column */}
          <div className="space-y-4 lg:sticky lg:top-32 lg:col-span-5">
            <Label>{whyIseoluwa.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {whyIseoluwa.headline}
            </SplitReveal>
          </div>

          {/* Right scrolling hairline list */}
          <div className="lg:col-span-7">
            <ol className="divide-y divide-line border-y border-line">
              {whyIseoluwa.reasons.map((reason) => (
                <li key={reason.number} className="py-8 md:py-12">
                  <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
                    <span className="font-mono text-2xl font-medium text-line-accent md:text-3xl">
                      {reason.number}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-heading-m text-ink">{reason.title}</h3>
                      <p className="text-body-l max-w-[52ch] text-ink-muted">
                        {reason.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
