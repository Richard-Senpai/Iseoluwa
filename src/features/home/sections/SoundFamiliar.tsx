import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { StrikeList } from '@/components/motion/StrikeList';
import { HOME_CONTENT } from '@/features/home/home.content';

/**
 * Section 3: "Sound familiar?" (Home Prompt Section 4.3)
 * - Section label: 01 / THE PROBLEM
 * - Headline: Sound familiar?
 * - Four problem lines crossed out by the flowing line (`StrikeList`, Occurrence 2 of 4)
 * - Closing statement revealed at full size
 */
export function SoundFamiliar() {
  const { soundFamiliar } = HOME_CONTENT;

  return (
    <section
      id="problem"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="space-y-4">
          <Label>{soundFamiliar.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {soundFamiliar.headline}
          </SplitReveal>
        </div>

        <StrikeList
          items={soundFamiliar.problems}
          closingStatement={soundFamiliar.closingStatement}
        />
      </Container>
    </section>
  );
}
