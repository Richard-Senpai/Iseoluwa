'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { CONTACT_CONTENT } from '../contact.content';
import { ContactInfoColumn } from './ContactInfoColumn';
import { ProjectRequestForm } from './ProjectRequestForm';

export interface ContactViewProps {
  initialPackageSlug?: string | null;
  initialSource?: string | null;
}

/**
 * Contact Page View (Fixes Prompt Part 1 & Part 3):
 * - Header area with mono label `CONTACT`, Display XL `h1` aligned to the first 10 columns
 *   with its left edge matching the mono label, Body L intro, mono reassurance, and a single thick `FlowingLine`.
 * - Main 2-column form section is completely exempt from scroll-linked or entrance effects so
 *   every ancestor from each form field up to `body` has `filter: none`, `backdrop-filter: none`,
 *   `opacity: 1`, `transform: none`, and `will-change: auto` at all scroll positions.
 */
export function ContactView({ initialPackageSlug, initialSource }: ContactViewProps) {
  const { header } = CONTACT_CONTENT;

  return (
    <div className="bg-bg text-ink">
      {/* Header Section with single thick FlowingLine */}
      <section className="relative isolate overflow-hidden border-b border-line pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 md:h-60">
          <FlowingLine path="loop" weight="hero" reactToPointer />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-10">
              <Label>{header.label}</Label>
              <SplitReveal
                as="h1"
                triggerOnLoad
                className="text-display-xl text-balance text-ink"
              >
                {header.headline}
              </SplitReveal>
              <p className="text-body-l max-w-[54ch] text-ink-muted">{header.body}</p>
              <p className="text-label-mono text-ink-muted">{header.reassurance}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main 2-column content: completely exempt from scroll-linked or entrance effects (Part 1) */}
      <section id="contact-main-section" className="relative bg-bg py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <ContactInfoColumn />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-7">
              <ProjectRequestForm
                initialPackageSlug={initialPackageSlug}
                initialSource={initialSource}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
