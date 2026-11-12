'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { ProjectStack } from '@/components/motion/ProjectStack';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ProjectIndexOverlay } from '@/features/work/components/ProjectIndexOverlay';
import { NextCategoryBanner } from '@/features/work/components/NextCategoryBanner';
import { WorkClosingCta } from '@/features/work/components/WorkClosingCta';
import {
  WORK_CATEGORIES,
  type ProjectItem,
  type WorkCategory,
} from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useZoomStore } from '@/store/zoom';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface CategoryViewProps {
  category: WorkCategory;
  projects: ProjectItem[];
  nextCategory: WorkCategory;
}

/**
 * Stage 2: Category Page View (`/work/[category]`, Work Prompt Section 6):
 * - Header area: mono `WORK / [CATEGORY]`, Display L title, tagline, project count (`04 PROJECTS`),
 *   `Back` control (`All work`) that zooms out to `/work?category=[slug]`, mini category switcher,
 *   and `Index` toggle button.
 * - Single `FlowingLine` between header and first project.
 * - Generalised `ProjectStack` with edge scroll-progress bar and zoom into case studies.
 * - End of page: `NextCategoryBanner` and `WorkClosingCta`.
 */
export function CategoryView({
  category,
  projects,
  nextCategory,
}: CategoryViewProps) {
  const router = useRouter();
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const { shouldSimplifyMotion } = useMotionPreference();
  const savedOrigins = useZoomStore((s) => s.savedOrigins);
  const startZoom = useZoomStore((s) => s.startZoom);

  const { stage2 } = WORK_CONTENT;
  const projectCountLabel = `${String(projects.length).padStart(2, '0')} ${stage2.projectsCountSuffix}`;
  const backHref = `/work?category=${category.slug}`;

  const handleBackToSelector = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();

    const originKey = `category:${category.slug}`;
    const saved = savedOrigins[originKey];

    if (shouldSimplifyMotion) {
      router.push(backHref);
      return;
    }

    startZoom({
      direction: 'out',
      targetHref: backHref,
      originKey,
      fromRect: saved?.rect ?? null,
      label: saved?.label ?? `${category.title.toUpperCase()} · PROJECT MEDIA 16:9`,
      title: category.title,
    });
  };

  const handleOpenIndex = () => {
    setIsIndexOpen(true);
    track('work_index_opened', { category: category.slug });
  };

  return (
    <>
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <Container className="space-y-10">
          {/* Top navigation controls: Back to All Work + Mini Category Switcher + Index Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <a
              href={backHref}
              data-testid="back-to-all-work"
              onClick={handleBackToSelector}
              className="text-label-mono inline-flex items-center gap-2 text-ink transition-colors hover:text-line-accent"
            >
              <Icon name="arrow_back" size={20} />
              <span>{stage2.backToAllWorkLabel}</span>
            </a>

            {/* Mini category switcher (BRANDING · WEBSITES · MARKETING) */}
            <nav
              aria-label="Switch work category"
              className="flex flex-wrap items-center gap-4 md:gap-6"
            >
              {WORK_CATEGORIES.map((item) => {
                const isCurrent = item.slug === category.slug;
                return (
                  <TransitionLink
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    transitionTitle={item.title.toUpperCase()}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'text-label-mono relative pb-1 transition-colors',
                      isCurrent
                        ? 'text-ink after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:bg-line-accent'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {item.title.toUpperCase()}
                  </TransitionLink>
                );
              })}
            </nav>

            {/* Mono Index Toggle */}
            <button
              id="work-index-open-button"
              type="button"
              aria-expanded={isIndexOpen}
              aria-controls="work-project-index-overlay"
              onClick={handleOpenIndex}
              className="text-label-mono inline-flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-ink transition-colors hover:border-line-accent"
            >
              <Icon name="list" size={20} />
              <span>{stage2.indexOpenLabel}</span>
            </button>
          </div>

          {/* Category Title, Tagline, and Project Count */}
          <div className="grid grid-cols-1 gap-8 pt-2 lg:grid-cols-12 lg:items-end">
            <div className="space-y-4 lg:col-span-8">
              <Label>
                {stage2.breadcrumbPrefix} {category.title.toUpperCase()}
              </Label>
              <SplitReveal as="h1" triggerOnLoad className="text-display-l text-ink">
                {category.title}
              </SplitReveal>
            </div>
            <div className="space-y-3 lg:col-span-4">
              <p className="text-body-l text-ink-muted">{category.tagline}</p>
              <p className="text-label-mono text-ink">{projectCountLabel}</p>
            </div>
          </div>
        </Container>

        {/* Single FlowingLine between header area and first project */}
        <div className="pointer-events-none my-8 w-full md:my-12">
          <FlowingLine
            amplitude={20}
            frequency={0.0045}
            speed={0.022}
            drawOnScroll
            className="h-28 md:h-36"
          />
        </div>

        {/* Project Scroll Experience */}
        <Container>
          <ProjectStack
            projects={projects}
            cursorLabel={stage2.cursorViewLabel}
            showScrollProgress
            enableZoomTransition
          />
        </Container>
      </section>

      {/* Index Modal Overlay */}
      <ProjectIndexOverlay
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        projects={projects}
        categoryTitle={category.title}
      />

      {/* Next Category Zoom Banner */}
      <NextCategoryBanner
        currentCategorySlug={category.slug}
        nextCategory={nextCategory}
      />

      {/* Closing CTA with SurfaceTransition into Footer */}
      <WorkClosingCta contextLocation={`category_${category.slug}`} />
    </>
  );
}
