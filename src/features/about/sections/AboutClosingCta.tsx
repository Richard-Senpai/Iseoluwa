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
 * Section 11: Closing Call to Action & Rising Tide (About Prompt Section B3.11 & Fixes Part 3)
 * - Headline in first 10 columns (`lg:col-span-10`) aligned with mono label: Ready to build something excellent?
 * - Text: Tell us about your project. We reply within one business day.
 * - Buttons: "Start a project" and "Book a free 20-minute call"
 * - Thick FlowingLine (`weight="hero"`, `drawOnScroll`) — Occurrence 3 of 3 on `/about`
 * - Wrapped in `SurfaceTransition` (Rising Tide) into the dark footer
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
        className="relative isolate overflow-hidden pt-[clamp(96px,16vh,200px)] pb-[clamp(128px,24vh,280px)]"
      >
        <Container className="relative z-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-10">
              <Label>{closingCta.sectionLabel}</Label>

              <div
                data-cursor="talk"
                onMouseEnter={() => !isTouch && setCursor('talk', closingCta.cursorLabel)}
                onMouseLeave={() => !isTouch && resetCursor()}
                className="block"
              >
                <SplitReveal as="h2" className="text-display-xl text-left text-balance text-ink">
                  {closingCta.headline}
                </SplitReveal>
              </div>

              <p className="text-body-l max-w-[48ch] text-ink-muted">{closingCta.body}</p>
            </div>
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

        {/* Final occurrence of the thick FlowingLine on /about (3 of 3), inside the bottom tide zone */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 w-full">
          <FlowingLine
            weight="hero"
            amplitude={24}
            frequency={0.0042}
            speed={0.024}
            drawOnScroll
            className="h-24 md:h-36"
          />
        </div>
      </section>
    </SurfaceTransition>
  );
}
