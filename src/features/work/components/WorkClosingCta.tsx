'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';

export interface WorkClosingCtaProps {
  contextLocation: string;
}

/**
 * Closing call-to-action for `/work/[category]` and `/work/[category]/[slug]`
 * (Work Prompt Sections 6 & 7):
 * - Headline: "Have a project like this? Let's build something excellent."
 * - Buttons: "Start a project" and "Book a free 20-minute call"
 * - Wrapped in `SurfaceTransition` so the page smoothly transitions to dark into the Footer.
 */
export function WorkClosingCta({ contextLocation }: WorkClosingCtaProps) {
  const { closingCta } = WORK_CONTENT;
  const { isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  return (
    <SurfaceTransition className="relative z-10 border-t border-line">
      <section className="py-[var(--section-pad-y)] pb-28 md:pb-40">
        <Container className="space-y-10 md:space-y-14">
          <div className="space-y-6">
            <Label>{closingCta.sectionLabel}</Label>
            <div
              data-cursor="talk"
              onMouseEnter={() => !isTouch && setCursor('talk', closingCta.cursorLabel)}
              onMouseLeave={() => !isTouch && resetCursor()}
              className="inline-block"
            >
              <SplitReveal as="h2" className="text-display-xl max-w-[16ch] text-ink">
                {closingCta.headline}
              </SplitReveal>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                href={closingCta.primaryCta.href}
                variant="primary"
                onClick={() =>
                  track('work_cta_clicked', {
                    location: contextLocation,
                    action: 'start_project',
                  })
                }
              >
                {closingCta.primaryCta.label}
              </Button>
              <Button
                href={closingCta.secondaryCta.href}
                variant="secondary"
                icon="arrow_outward"
                onClick={() =>
                  track('work_cta_clicked', {
                    location: contextLocation,
                    action: 'book_call',
                  })
                }
              >
                {closingCta.secondaryCta.label}
              </Button>
            </div>
            <p className="text-label-mono text-ink-muted">{closingCta.reassurance}</p>
          </div>
        </Container>
      </section>
    </SurfaceTransition>
  );
}
