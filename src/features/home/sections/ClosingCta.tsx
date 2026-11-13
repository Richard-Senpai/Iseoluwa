'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { HOME_CONTENT } from '@/features/home/home.content';
import { SITE_CONTENT } from '@/content/site';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';

/**
 * Section 11: Closing call to action & Rising Tide (Home Prompt Section 4.11 & 4.12 + Fixes Part 3)
 * - Section label: 08 / LET'S TALK
 * - Headline (Display XL) in first 10 columns (`lg:col-span-10`), left-aligned with section label
 * - Large email link (`hello@iseoluwa.com`) that copies to clipboard on click with "Copied" confirmation
 * - Buttons: "Start a project" and "Book a free 20-minute call", plus "Message us on WhatsApp"
 * - Final appearance of the FlowingLine (Occurrence 4 of 4) inside the bottom tide zone
 */
export function ClosingCta() {
  const { closingCta } = HOME_CONTENT;
  const [copied, setCopied] = useState(false);
  const { isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONTENT.contact.email);
      setCopied(true);
      track('email_copied', { email: SITE_CONTENT.contact.email });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${SITE_CONTENT.contact.email}`;
    }
  };

  return (
    <SurfaceTransition className="relative z-10 border-t border-line">
      <section
        id="lets-talk"
        className="relative isolate overflow-hidden pt-[clamp(96px,16vh,200px)] pb-[clamp(128px,24vh,280px)]"
      >
        <Container className="relative z-10 space-y-12 md:space-y-16">
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

          {/* Copyable large email link */}
          <div className="border-y border-line py-8 md:py-10">
            <button
              id="closing-copy-email"
              type="button"
              onClick={handleCopyEmail}
              className="group flex flex-wrap items-center gap-4 text-left"
            >
              <span className="text-heading-m link-underline font-mono text-ink">
                {SITE_CONTENT.contact.email}
              </span>
              <span className="text-label-mono inline-flex items-center gap-1.5 rounded-pill border border-line px-3.5 py-1.5 text-ink-muted transition-colors group-hover:border-line-accent group-hover:text-ink">
                <Icon name={copied ? 'check' : 'content_copy'} size={20} />
                <span aria-live="polite">
                  {copied
                    ? SITE_CONTENT.contact.copiedLabel
                    : SITE_CONTENT.contact.copyPromptLabel}
                </span>
              </span>
            </button>
          </div>

          {/* Action buttons & WhatsApp link */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                href={closingCta.primaryCta.href}
                variant="primary"
                onClick={() => track('start_project_click', { location: 'closing_cta' })}
              >
                {closingCta.primaryCta.label}
              </Button>

              <Button
                href={closingCta.secondaryCta.href}
                variant="secondary"
                icon="arrow_outward"
                onClick={() => track('book_call_click', { location: 'closing_cta' })}
              >
                {closingCta.secondaryCta.label}
              </Button>

              <a
                href={SITE_CONTENT.contact.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { location: 'closing_cta' })}
                className="link-underline text-btn ml-2 py-2 text-ink"
              >
                <Icon name="whatsapp" size={20} />
                <span>{closingCta.whatsappCta.label}</span>
              </a>
            </div>

            <p className="text-label-mono text-ink-muted">{closingCta.reassurance}</p>
          </div>
        </Container>

        {/* Final appearance of the FlowingLine (Occurrence 4 of 4), inside the bottom tide zone */}
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
