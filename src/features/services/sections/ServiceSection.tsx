'use client';

import { useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { TagList } from '@/components/ui/Tag';
import { Accordion } from '@/components/ui/Accordion';
import { Media } from '@/components/media/Media';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ALL_PROJECTS } from '@/content/projects';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { ServiceItem } from '@/types/services';

export interface ServiceSectionProps {
  service: ServiceItem;
}

/**
 * Sections 3–5: Reusable `ServiceSection` (`src/features/services/sections/ServiceSection.tsx`)
 * - Renders `01 / BRANDING` (light), `02 / WEB` (`.surface-inverse`), and `03 / MARKETING` (light)
 * - Sticky left column: number & label, Display L title, tagline, intro, and "For whom"
 * - Right column:
 *   1. Offering index with hairline rows; hovering (desktop) or clicking/keyboard expands to show
 *      description + deliverables in mono, with a desktop cursor-following preview frame from concept projects
 *   2. "What you can expect" outcome statements
 *   3. Three related project cards from `content/projects.ts` + "See all [category] projects"
 *   4. Two service-specific mini FAQs
 *   5. "Start a [service] project" (`/contact?package=<slug>&source=services-<slug>`) and "Book a free call"
 */
export function ServiceSection({ service }: ServiceSectionProps) {
  const { isTouch, shouldSimplifyMotion } = useMotionPreference();
  const [openOfferingId, setOpenOfferingId] = useState<string | null>(
    service.offerings[0]?.id ?? null,
  );
  const [hoveredOfferingIdx, setHoveredOfferingIdx] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const offeringListRef = useRef<HTMLDivElement>(null);

  const relatedProjects = ALL_PROJECTS.filter(
    (project) => project.category === service.relatedCategory,
  ).slice(0, 3);

  const handleToggleOffering = (offeringId: string) => {
    const nextId = openOfferingId === offeringId ? null : offeringId;
    setOpenOfferingId(nextId);
    if (nextId) {
      track('services_offering_opened', {
        service: service.slug,
        offering: offeringId,
      });
    }
  };

  const handleOfferingMouseEnter = (offeringId: string, idx: number) => {
    setHoveredOfferingIdx(idx);
    if (!isTouch && openOfferingId !== offeringId) {
      setOpenOfferingId(offeringId);
      track('services_offering_opened', {
        service: service.slug,
        offering: offeringId,
      });
    }
  };

  const handleListMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isTouch || shouldSimplifyMotion || !previewRef.current || !offeringListRef.current) return;
    const rect = offeringListRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left + 20;
    const y = event.clientY - rect.top - 72;

    gsap.to(previewRef.current, {
      x,
      y,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const activePreviewOffering =
    hoveredOfferingIdx !== null ? service.offerings[hoveredOfferingIdx] : null;

  return (
    <section
      id={`service-${service.slug}`}
      data-testid={`service-section-${service.slug}`}
      className={cn(
        'relative border-b border-line py-[var(--section-pad-y)]',
        service.isInverse && 'surface-inverse bg-bg text-ink',
      )}
    >
      <Container className="space-y-20 md:space-y-24">
        {/* Top 2-column layout: Sticky Left Column + Right Offering Index & Outcomes */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Sticky Left Column */}
          <div className="space-y-6 lg:sticky lg:top-36 lg:col-span-5">
            <Label>{service.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {service.title}
            </SplitReveal>
            <p className="text-heading-m text-ink">{service.tagline}</p>
            <p className="text-body-l text-ink-muted">{service.intro}</p>

            <div className="rounded-card border border-line bg-surface p-5">
              <p className="text-label-mono text-line-accent">{service.forWhoLabel}</p>
              <p className="text-body mt-2 text-ink">{service.forWho}</p>
            </div>
          </div>

          {/* Right Column: Offering Index + Outcomes */}
          <div className="space-y-14 lg:col-span-7">
            {/* Offering Index */}
            <div
              ref={offeringListRef}
              onMouseMove={handleListMouseMove}
              onMouseLeave={() => setHoveredOfferingIdx(null)}
              className="relative space-y-4"
            >
              <p className="text-label-mono text-ink-muted">{service.offeringsHeading}</p>

              {/* Desktop cursor-following preview frame */}
              {!isTouch && !shouldSimplifyMotion && (
                <div
                  ref={previewRef}
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute top-0 left-0 z-30 hidden aspect-video w-64 overflow-hidden rounded-card border border-line bg-surface shadow-lg transition-opacity duration-200 lg:block',
                    activePreviewOffering ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {activePreviewOffering && (
                    <Image
                      src={activePreviewOffering.previewImage}
                      alt={activePreviewOffering.previewAlt}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  )}
                </div>
              )}

              <div className="divide-y divide-line border-y border-line">
                {service.offerings.map((offering, idx) => {
                  const isOpen = openOfferingId === offering.id;
                  const triggerId = `offering-trigger-${offering.id}`;
                  const panelId = `offering-panel-${offering.id}`;
                  const numStr = String(idx + 1).padStart(2, '0');

                  return (
                    <div
                      key={offering.id}
                      onMouseEnter={() => handleOfferingMouseEnter(offering.id, idx)}
                      className="py-5 md:py-6"
                    >
                      <h3>
                        <button
                          id={triggerId}
                          type="button"
                          data-testid={`offering-trigger-${offering.id}`}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => handleToggleOffering(offering.id)}
                          className="group flex w-full items-start justify-between gap-4 text-left"
                        >
                          <span className="flex items-baseline gap-4 md:gap-6">
                            <span className="text-label-mono text-ink-muted">{numStr}</span>
                            <span className="text-heading-m text-ink transition-colors group-hover:text-line-accent">
                              {offering.title}
                            </span>
                          </span>
                          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-hover:border-line-accent">
                            <Icon name={isOpen ? 'remove' : 'add'} size={20} />
                          </span>
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        aria-hidden={!isOpen}
                        className={cn(
                          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="space-y-4 pt-4 pl-8 md:pl-12">
                            <p className="text-body max-w-[60ch] text-ink-muted">
                              {offering.description}
                            </p>
                            <div className="space-y-2">
                              <p className="text-label-mono text-line-accent">
                                {service.deliverablesHeading}
                              </p>
                              <ul className="flex flex-wrap gap-2">
                                {offering.deliverables.map((item) => (
                                  <li
                                    key={item}
                                    className="rounded-pill border border-line bg-surface px-3 py-1 font-mono text-xs text-ink"
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What you can expect (Outcomes) */}
            <div className="space-y-4 rounded-card border border-line bg-surface p-6 md:p-8">
              <p className="text-label-mono text-ink-muted">{service.outcomesHeading}</p>
              <ul className="space-y-3">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3">
                    <Icon
                      name="check"
                      size={20}
                      className="mt-0.5 shrink-0 text-line-accent"
                    />
                    <span className="text-body text-ink">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Work (3 project cards from the related category) */}
        <div className="space-y-8 border-t border-line pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-label-mono text-ink-muted">{service.relatedWorkHeading}</p>
            <TransitionLink
              href={service.seeAllProjectsHref}
              className="link-underline text-btn text-ink"
            >
              <span>{service.seeAllProjectsLabel}</span>
              <Icon name="arrow_outward" size={20} />
            </TransitionLink>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedProjects.map((project) => (
              <TransitionLink
                key={project.slug}
                href={project.href}
                onClick={() =>
                  track('services_related_project_clicked', {
                    service: service.slug,
                    project: project.slug,
                  })
                }
                className="group block space-y-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-accent"
              >
                <Media
                  type={project.media.src ? 'image' : 'placeholder'}
                  src={project.media.src}
                  alt={project.media.alt}
                  label={project.media.label}
                  aspectRatio="16/9"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-sans text-lg font-medium text-ink group-hover:text-line-accent">
                      {project.title}
                    </h3>
                    {project.kind === 'real' ? (
                      <span
                        data-testid="live-site-badge"
                        className="text-label-mono inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-2 py-0.5 text-ink"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>LIVE SITE</span>
                      </span>
                    ) : (
                      project.year && (
                        <span className="text-label-mono text-ink-muted">{project.year}</span>
                      )
                    )}
                  </div>
                  <p className="text-body text-ink-muted">{project.summary}</p>
                  <div className="pt-1">
                    <TagList items={project.services.slice(0, 3)} />
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        </div>

        {/* Mini FAQs + Conversion Buttons */}
        <div className="grid grid-cols-1 gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:items-end">
          <div className="space-y-4 lg:col-span-7">
            <p className="text-label-mono text-ink-muted">{service.faqHeading}</p>
            <Accordion
              items={service.faq}
              idPrefix={`service-${service.slug}-faq`}
            />
          </div>

          <div className="space-y-4 lg:col-span-5 lg:pl-6">
            <div className="flex flex-wrap items-center gap-4">
              <TransitionLink
                href={service.ctaHref}
                onClick={() => {
                  track('services_cta_clicked', { service: service.slug });
                  track('package_cta_clicked', {
                    package: service.bestMatchingPackageSlug,
                    source: `services-${service.slug}`,
                  });
                }}
                className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-ink bg-ink px-6 py-3.5 text-bg transition-transform duration-200 hover:scale-[1.02]"
              >
                <span>{service.ctaLabel}</span>
                <Icon name="arrow_outward" size={20} />
              </TransitionLink>

              <TransitionLink
                href={service.bookCallHref}
                onClick={() =>
                  track('book_call_click', { location: `services_${service.slug}` })
                }
                className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-line bg-transparent px-6 py-3.5 text-ink transition-colors hover:border-ink"
              >
                <span>{service.bookCallLabel}</span>
                <Icon name="arrow_outward" size={20} />
              </TransitionLink>
            </div>
            <p className="text-label-mono text-ink-muted">{service.reassurance}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
