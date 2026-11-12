import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { HOME_CONTENT } from '@/features/home/home.content';

/**
 * Section 10: Testimonials (Home Prompt Section 4.10)
 * Renders nothing (not even the section label) while `HOME_CONTENT.testimonials.items` is empty.
 * Automatically renders quotes in Display L with mono attribution once real quotes are added.
 */
export function Testimonials() {
  const { testimonials } = HOME_CONTENT;

  if (testimonials.items.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="space-y-4">
          <Label>{testimonials.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {testimonials.headline}
          </SplitReveal>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {testimonials.items.map((item) => (
            <blockquote key={item.id} className="space-y-6 py-12">
              <p className="text-display-l text-ink">“{item.quote}”</p>
              <footer className="text-label-mono text-ink-muted">
                {item.name} · {item.company} · {item.country}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
