'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { SITE_CONTENT } from '@/content/site';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';

export interface WorkClosingCtaProps {
  contextLocation: string;
}

/**
 * Closing call-to-action for `/work/[category]` and `/work/[category]/[slug]`
 * (Work Prompt Sections 6 & 7 + Fixes Prompt Parts 3 & 4):
 * - Headline: "Have a project like this? Let's build something excellent."
 * - Buttons: "Start a project", "Book a free 20-minute call", and "Message us on WhatsApp"
 * - Wrapped in `SurfaceTransition` so the page smoothly transitions to dark into the Footer.
 */
export function WorkClosingCta({ contextLocation }: WorkClosingCtaProps) {
  const { closingCta } = WORK_CONTENT;
  const { isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  return (
    <SurfaceTransition className="relative z-10 border-t border-line">
      <section className="relative isolate pt-[clamp(96px,16vh,200px)] pb-[clamp(128px,24vh,280px)]">
        <Container className="relative z-10 space-y-10 md:space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-10">
              <Label>{closingCta.sectionLabel}</Label>
              <div
                data-cursor="talk"
                onMouseEnter={() => !isTouch && setCursor('talk', closingCta.cursorLabel)}
                onMouseLeave={() => !isTouch && resetCursor()}
                className="block"
              >
                <SplitReveal as="h2" className="text-display-xl text-balance text-ink">
                  {closingCta.headline}
                </SplitReveal>
              </div>
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
              <a
                href={SITE_CONTENT.contact.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { location: contextLocation })}
                className="link-underline text-btn ml-2 py-2 text-ink"
              >
                <Icon name="whatsapp" size={20} />
                <span>{closingCta.whatsappCta.label}</span>
              </a>
            </div>
            <p className="text-label-mono text-ink-muted">{closingCta.reassurance}</p>
          </div>
        </Container>
      </section>
    </SurfaceTransition>
  );
}
