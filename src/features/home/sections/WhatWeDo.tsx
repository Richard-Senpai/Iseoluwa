'use client';

import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { TagList } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/media/Media';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { HOME_CONTENT } from '@/features/home/home.content';
import { gsap } from '@/lib/animation/gsap';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

/**
 * Section 4: What we do (Home Prompt Section 4.4 — Black inverse section)
 * - Section label: 02 / WHAT WE DO. Headline: Three services. One team.
 * - Three numbered rows (01 Brand, 02 Build, 03 Grow) separated by hairlines.
 * - Desktop: hovering a row expands it to show the description and tags, and a small
 *   preview frame follows the cursor.
 * - Touch: rows work as an accordion.
 */
export function WhatWeDo() {
  const { whatWeDo } = HOME_CONTENT;
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();

  useEffect(() => {
    const previewEl = previewRef.current;
    const sectionEl = sectionRef.current;
    if (!previewEl || !sectionEl || shouldSimplifyMotion || isTouch) return;

    const xTo = gsap.quickTo(previewEl, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(previewEl, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMove = (event: MouseEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      xTo(event.clientX - rect.left + 28);
      yTo(event.clientY - rect.top - 90);
    };

    sectionEl.addEventListener('mousemove', handleMove, { passive: true });
    return () => sectionEl.removeEventListener('mousemove', handleMove);
  }, [shouldSimplifyMotion, isTouch]);

  const activePreviewService =
    hoveredIndex !== null ? whatWeDo.services[hoveredIndex] : null;

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="surface-inverse relative overflow-hidden py-[var(--section-pad-y)]"
    >
      {/* Desktop cursor-following preview frame */}
      {!isTouch && !shouldSimplifyMotion && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-0 left-0 z-30 hidden w-64 transition-opacity duration-200 lg:block',
            activePreviewService ? 'opacity-100' : 'opacity-0',
          )}
        >
          {activePreviewService && (
            <Media
              type="placeholder"
              alt={activePreviewService.title}
              label={activePreviewService.previewLabel}
              aspectRatio="4/5"
              className="border-[#242424] bg-[#121212] shadow-none"
            />
          )}
        </div>
      )}

      <Container className="relative z-10 space-y-12 md:space-y-16">
        <div className="space-y-4">
          <Label className="text-[#8f8f8a]">{whatWeDo.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-[#f5f5f3]">
            {whatWeDo.headline}
          </SplitReveal>
        </div>

        <div className="divide-y divide-[#242424] border-y border-[#242424]">
          {whatWeDo.services.map((service, index) => {
            const isExpanded = isTouch
              ? activeIndex === index
              : hoveredIndex === index || activeIndex === index;

            return (
              <div
                key={service.number}
                onMouseEnter={() => {
                  if (!isTouch) {
                    setHoveredIndex(index);
                    setActiveIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  if (!isTouch) {
                    setHoveredIndex(null);
                  }
                }}
                className="py-8 md:py-12"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="group flex w-full flex-col gap-4 text-left md:flex-row md:items-baseline md:justify-between"
                >
                  <div className="flex items-baseline gap-6 md:gap-12">
                    <span className="text-label-mono text-green-signal">{service.number}</span>
                    <span className="text-display-l text-[#f5f5f3] transition-colors duration-200 group-hover:text-green-signal">
                      {service.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-6 md:justify-end">
                    <span className="text-heading-m text-[#8f8f8a] group-hover:text-[#f5f5f3]">
                      {service.headline}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#242424] text-[#f5f5f3] lg:hidden">
                      <Icon name={isExpanded ? 'remove' : 'add'} size={20} />
                    </span>
                  </div>
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col justify-between gap-6 pt-6 pl-0 md:flex-row md:items-end md:pl-20">
                      <p className="text-body-l max-w-[52ch] text-[#8f8f8a]">
                        {service.description}
                      </p>
                      <TagList items={service.tags} className="text-green-signal" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <TransitionLink
            href={whatWeDo.exploreLink.href}
            className="link-underline text-btn text-[#f5f5f3] hover:text-green-signal"
          >
            <span>{whatWeDo.exploreLink.label}</span>
            <Icon name="arrow_outward" size={20} />
          </TransitionLink>
        </div>
      </Container>
    </section>
  );
}
