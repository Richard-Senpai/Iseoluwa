'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';

/**
 * Section 11: Closing Call to Action & Surface Colour Transition (About Prompt Section B3.11 & B4)
 * - Headline: Ready to build something excellent?
 * - Text: Tell us about your project. We reply within one business day.
 * - Buttons: "Start a project" and "Book a free 20-minute call"
 * - Thick FlowingLine (`weight="hero"`, `drawOnScroll`) — Occurrence 3 of 3 on `/about`
 * - Wrapped in `SurfaceTransition` so the page smoothly transitions into the dark footer
 */
export function AboutClosingCta() {
  const { closingCta } = ABOUT_CONTENT;
  const { isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  return (
    <SurfaceTransition className="relative z-10 border-t border-line">
      <section
        id="about-closing-cta"
        className="relative overflow-hidden py-[var(--section-pad-y)] pb-28 md:pb-40"
      >
        <Container className="relative z-10 space-y-12">
          <div className="space-y-6">
            <Label>{closingCta.sectionLabel}</Label>

            <div
              data-cursor="talk"
              onMouseEnter={() => !isTouch && setCursor('talk', closingCta.cursorLabel)}
              onMouseLeave={() => !isTouch && resetCursor()}
              className="inline-block"
            >
              <SplitReveal as="h2" className="text-display-xl max-w-[14ch] text-ink">
                {closingCta.headline}
              </SplitReveal>
            </div>

            <p className="text-body-l max-w-[48ch] text-ink-muted">{closingCta.body}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href={closingCta.primaryCta.href}
              variant="primary"
              onClick={() => track('about_cta_clicked', { action: 'start_project' })}
            >
              {closingCta.primaryCta.label}
            </Button>

            <Button
              href={closingCta.secondaryCta.href}
              variant="secondary"
              icon="arrow_outward"
              onClick={() => track('about_cta_clicked', { action: 'book_call' })}
            >
              {closingCta.secondaryCta.label}
            </Button>
          </div>
        </Container>

        {/* Final occurrence of the thick FlowingLine on /about (3 of 3), ending at the footer */}
        <div className="pointer-events-none mt-12 w-full">
          <FlowingLine
            weight="hero"
            amplitude={24}
            frequency={0.0042}
            speed={0.024}
            drawOnScroll
            className="h-32 md:h-44"
          />
        </div>
      </section>
    </SurfaceTransition>
  );
}
