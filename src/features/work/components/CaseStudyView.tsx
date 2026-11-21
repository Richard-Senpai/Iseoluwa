'use client';

import { useEffect, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { TagList } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/media/Media';
import { LoopVideo } from '@/components/media/LoopVideo';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ScrollText } from '@/components/motion/ScrollText';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { WorkClosingCta } from '@/features/work/components/WorkClosingCta';
import { SHOW_CONCEPT_BADGE, SHOW_PHOTO_CREDITS } from '@/config/site';
import type { ProjectItem, WorkCategory } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useZoomStore } from '@/store/zoom';
import { track } from '@/lib/analytics';

export interface CaseStudyViewProps {
  category: WorkCategory;
  project: ProjectItem;
  nextProject: ProjectItem;
}

/**
 * Stage 3: Case Study Template (`/work/[category]/[slug]`):
 * - Supports both studio concept case studies (`kind === 'concept'`) and
 *   website builds (`kind === 'real'` and `kind === 'sample'`).
 * - For `kind === 'real'`:
 *   - Displays `LIVE SITE` badge (green dot + mono `LIVE SITE`) and a prominent
 *     `Visit live site` external button (`target="_blank" rel="noopener noreferrer"`).
 *   - Renders **Overview**, **What the site does** (`highlights`), and **How it is built** (`builtWith`),
 *     omitting any section whose array is empty and hiding any empty meta fields.
 * - For `kind === 'sample'`:
 *   - Displays `SAMPLE LAYOUT` badge and plain description, never shows `Visit live site` or client name.
 */
export function CaseStudyView({
  category,
  project,
  nextProject,
}: CaseStudyViewProps) {
  const router = useRouter();
  const { shouldSimplifyMotion } = useMotionPreference();
  const savedOrigins = useZoomStore((s) => s.savedOrigins);
  const saveOrigin = useZoomStore((s) => s.saveOrigin);
  const startZoom = useZoomStore((s) => s.startZoom);

  const { stage3 } = WORK_CONTENT;
  const backCategoryHref = `/work/${category.slug}`;

  useEffect(() => {
    if (project.kind === 'sample') {
      track('work_sample_viewed', { slug: project.slug });
    }
  }, [project.kind, project.slug]);

  const handleBackToCategory = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();

    const originKey = `project:${category.slug}:${project.slug}`;
    const saved = savedOrigins[originKey];

    if (shouldSimplifyMotion) {
      router.push(backCategoryHref);
      return;
    }

    startZoom({
      direction: 'out',
      targetHref: backCategoryHref,
      originKey,
      fromRect: saved?.rect ?? null,
      label: saved?.label ?? project.media.hero.label,
      title: project.title,
    });
  };

  const handleNextProjectClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track('work_next_project_clicked', {
      category: category.slug,
      fromSlug: project.slug,
      toSlug: nextProject.slug,
    });

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();

    const previewEl = event.currentTarget.querySelector<HTMLElement>(
      '[data-next-project-preview="true"]',
    );
    const rect = previewEl?.getBoundingClientRect();
    const originKey = `project:${category.slug}:${nextProject.slug}`;
    const zoomRect = rect
      ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      : null;

    if (zoomRect) {
      saveOrigin(originKey, zoomRect, nextProject.media.hero.label);
    }

    if (shouldSimplifyMotion || !zoomRect) {
      router.push(nextProject.href);
      return;
    }

    startZoom({
      direction: 'in',
      targetHref: nextProject.href,
      originKey,
      fromRect: zoomRect,
      label: nextProject.media.hero.label,
      title: nextProject.title,
    });
  };

  const fullGallery = project.media.gallery.filter((item) => item.layout === 'full');
  const twoUpGallery = project.media.gallery.filter((item) => item.layout === 'two-up');
  const offsetGallery = project.media.gallery.filter(
    (item) => item.layout === 'offset-right' || item.layout === 'offset-left',
  );

  const hasHighlights = Boolean(project.highlights && project.highlights.length > 0);
  const hasBuiltWith = Boolean(project.builtWith && project.builtWith.length > 0);
  const hasChallengeApproach = Boolean(project.challenge && project.approach);

  const closingPrimaryHref =
    category.slug === 'websites'
      ? `/contact?package=build-only&source=case-study-${project.slug}`
      : undefined;

  return (
    <>
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <Container className="space-y-8 md:space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <a
              href={backCategoryHref}
              data-testid="back-to-category"
              onClick={handleBackToCategory}
              className="text-label-mono inline-flex items-center gap-2 text-ink transition-colors hover:text-line-accent"
            >
              <Icon name="arrow_back" size={20} />
              <span>{`${stage3.backToCategoryPrefix} ${category.title}`}</span>
            </a>

            <div className="flex flex-wrap items-center gap-3">
              {project.kind === 'real' && (
                <span
                  data-testid="live-site-badge"
                  className="text-label-mono inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-0.5 text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{stage3.liveBadgeLabel}</span>
                </span>
              )}
              {project.kind === 'sample' && (
                <span
                  data-testid="sample-layout-badge"
                  className="text-label-mono rounded-pill border border-line px-2.5 py-0.5 text-ink-muted"
                >
                  {stage3.sampleBadgeLabel}
                </span>
              )}
              {SHOW_CONCEPT_BADGE && (project.kind === 'concept' || project.isConcept) && (
                <span
                  data-testid="concept-project-badge"
                  className="text-label-mono rounded-pill border border-line px-2.5 py-0.5 text-ink-muted"
                >
                  {stage3.conceptBadgeLabel}
                </span>
              )}
              <Label>
                {project.year
                  ? `${category.title.toUpperCase()} / ${project.year}`
                  : category.title.toUpperCase()}
              </Label>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SplitReveal as="h1" triggerOnLoad className="text-display-xl text-ink">
              {project.title}
            </SplitReveal>

            {project.kind === 'real' && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="visit-live-site-button"
                onClick={() =>
                  track('work_live_site_clicked', {
                    slug: project.slug,
                    url: project.liveUrl!,
                  })
                }
                className="text-btn inline-flex h-12 shrink-0 items-center gap-2.5 rounded-pill bg-accent px-6 font-medium text-[#0a0a0a] transition-transform duration-200 hover:scale-[1.02]"
              >
                <span>{stage3.visitLiveSiteLabel}</span>
                <Icon name="arrow_outward" size={20} />
              </a>
            )}
          </div>

          {/* Viewport-filling Hero Media Frame (target of ZoomTransition) */}
          <div data-casestudy-hero="true" className="overflow-hidden rounded-card">
            <Parallax>
              {project.media.hero.type === 'video' &&
              project.media.hero.src &&
              project.media.hero.poster ? (
                <LoopVideo
                  src={project.media.hero.src}
                  poster={project.media.hero.poster}
                  alt={project.media.hero.alt}
                  aspectRatio={project.media.hero.aspectRatio}
                />
              ) : (
                <Media
                  type={project.media.hero.type === 'image' ? 'image' : 'placeholder'}
                  src={project.media.hero.src}
                  alt={project.media.hero.alt}
                  label={project.media.hero.label}
                  aspectRatio={project.media.hero.aspectRatio}
                  priority
                />
              )}
            </Parallax>
          </div>

          {/* 2. Meta Row (only renders non-empty fields; never shows client or year if omitted) */}
          <dl className="grid grid-cols-1 gap-6 border-y border-line py-8 sm:grid-cols-2 md:grid-cols-4">
            {project.client && project.kind !== 'sample' && (
              <div className="space-y-2">
                <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.client}</dt>
                <dd className="font-mono text-sm text-ink">{project.client}</dd>
              </div>
            )}
            {project.year && (
              <div className="space-y-2">
                <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.year}</dt>
                <dd className="flex flex-wrap items-center gap-2 font-mono text-sm text-ink">
                  <span>{project.year}</span>
                  {SHOW_CONCEPT_BADGE && (project.kind === 'concept' || project.isConcept) && (
                    <span className="text-label-mono text-ink-muted">
                      · {stage3.conceptBadgeLabel}
                    </span>
                  )}
                </dd>
              </div>
            )}
            {project.services.length > 0 && (
              <div className="space-y-2">
                <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.services}</dt>
                <dd>
                  <TagList items={project.services} className="text-ink" />
                </dd>
              </div>
            )}
            {project.role && (
              <div className="space-y-2">
                <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.role}</dt>
                <dd className="font-mono text-sm text-ink">{project.role}</dd>
              </div>
            )}
          </dl>
        </Container>
      </section>

      {/* 3. Overview (ScrollText word-by-word reveal) */}
      <section className="border-t border-line py-[var(--section-pad-y)]">
        <Container className="space-y-8">
          <Label>{stage3.sections.overview}</Label>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-10">
              <ScrollText text={project.summary} />
            </div>
          </div>
        </Container>
      </section>

      {/* 4A. Real Website Breakdown: What the site does & How it is built */}
      {(hasHighlights || hasBuiltWith) && (
        <section className="border-t border-line py-[var(--section-pad-y)]">
          <Container className="space-y-20 md:space-y-24">
            {hasHighlights && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <Label>{stage3.sections.whatTheSiteDoes}</Label>
                </div>
                <Reveal className="lg:col-span-8">
                  <ul className="space-y-5">
                    {project.highlights!.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 border-b border-line pb-5 last:border-b-0 last:pb-0"
                      >
                        <span className="text-label-mono mt-1 text-line-accent">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="text-body-l max-w-[60ch] text-ink">{item}</p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            )}

            {hasBuiltWith && (
              <div
                className={
                  hasHighlights
                    ? 'grid grid-cols-1 gap-6 border-t border-line pt-16 lg:grid-cols-12'
                    : 'grid grid-cols-1 gap-6 lg:grid-cols-12'
                }
              >
                <div className="lg:col-span-4">
                  <Label>{stage3.sections.howItIsBuilt}</Label>
                </div>
                <Reveal className="lg:col-span-8">
                  <div className="flex flex-wrap gap-3">
                    {project.builtWith!.map((tech) => (
                      <span
                        key={tech}
                        className="text-label-mono rounded-pill border border-line px-4 py-2 text-ink"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* 4B. Concept Case Study Editorial Breakdown: The Challenge / What We Did / The Result */}
      {hasChallengeApproach && (
        <section className="border-t border-line py-[var(--section-pad-y)]">
          <Container className="space-y-20 md:space-y-28">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Label>{stage3.sections.challenge}</Label>
              </div>
              <Reveal className="lg:col-span-8">
                <p className="text-body-l max-w-[60ch] text-ink">{project.challenge}</p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-line pt-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Label>{stage3.sections.approach}</Label>
              </div>
              <Reveal className="lg:col-span-8">
                <p className="text-body-l max-w-[60ch] text-ink">{project.approach}</p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-line pt-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Label>{stage3.sections.result}</Label>
              </div>
              <Reveal className="space-y-4 lg:col-span-8">
                <p className="text-display-l font-medium text-ink">{project.result}</p>
                {project.outcome && (
                  <p className="text-body-l max-w-[60ch] text-ink-muted">{project.outcome}</p>
                )}
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Gallery (Full bleed, Two-up, Offset blocks with inner Parallax and Reveal) */}
      <section className="border-t border-line py-[var(--section-pad-y)]">
        <Container className="space-y-12 md:space-y-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Label>{stage3.sections.gallery}</Label>
            {project.kind === 'real' && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track('work_live_site_clicked', {
                    slug: project.slug,
                    url: project.liveUrl!,
                  })
                }
                className="text-label-mono inline-flex items-center gap-2 text-ink transition-colors hover:text-line-accent"
              >
                <span>{stage3.visitLiveSiteLabel}</span>
                <Icon name="arrow_outward" size={20} />
              </a>
            )}
          </div>

          {/* Offset editorial frame (e.g. gallery-1 4:5 mobile screens) */}
          {offsetGallery.map((slot, idx) => (
            <div key={`offset-${idx}`} className="grid grid-cols-1 lg:grid-cols-12">
              <Reveal
                className={
                  slot.layout === 'offset-left'
                    ? 'lg:col-span-8 lg:col-start-1'
                    : 'lg:col-span-9 lg:col-start-4'
                }
              >
                <Parallax>
                  <Media
                    type={slot.type === 'image' ? 'image' : 'placeholder'}
                    src={slot.src}
                    alt={slot.alt}
                    label={slot.label}
                    aspectRatio={slot.aspectRatio}
                  />
                </Parallax>
              </Reveal>
            </div>
          ))}

          {/* Full-bleed block (e.g. gallery-2 16:9 desktop sections) */}
          {fullGallery.map((slot, idx) => (
            <Reveal key={`full-${idx}`}>
              <Parallax>
                {slot.type === 'video' && slot.src && slot.poster ? (
                  <LoopVideo
                    src={slot.src}
                    poster={slot.poster}
                    alt={slot.alt}
                    aspectRatio={slot.aspectRatio}
                  />
                ) : (
                  <Media
                    type={slot.type === 'image' ? 'image' : 'placeholder'}
                    src={slot.src}
                    alt={slot.alt}
                    label={slot.label}
                    aspectRatio={slot.aspectRatio}
                  />
                )}
              </Parallax>
            </Reveal>
          ))}

          {/* Two-up portrait grid */}
          {twoUpGallery.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {twoUpGallery.map((slot, idx) => (
                <Reveal key={`twoup-${idx}`} delay={idx * 0.08}>
                  <Parallax>
                    <Media
                      type={slot.type === 'image' ? 'image' : 'placeholder'}
                      src={slot.src}
                      alt={slot.alt}
                      label={slot.label}
                      aspectRatio={slot.aspectRatio}
                    />
                  </Parallax>
                </Reveal>
              ))}
            </div>
          )}

          {/* Quiet mono photo credit line at bottom of case study */}
          {SHOW_PHOTO_CREDITS && project.credits && project.credits.length > 0 && (
            <p
              data-testid="case-study-photo-credits"
              className="text-label-mono border-t border-line pt-6 text-ink-muted"
            >
              {stage3.photoCreditsPrefix}{' '}
              {project.credits
                .map((c) => `${c.photographer} (${c.source})`)
                .join(' · ')}
            </p>
          )}
        </Container>
      </section>

      {/* 6. Optional Client Quote (rendered only if project.testimonial exists) */}
      {project.testimonial && (
        <section className="border-t border-line py-[var(--section-pad-y)]">
          <Container className="space-y-8">
            <Label>{stage3.sections.testimonial}</Label>
            <blockquote className="space-y-6">
              <p className="text-display-l max-w-[28ch] text-ink">
                “{project.testimonial.quote}”
              </p>
              <footer className="text-label-mono text-ink-muted">
                {project.testimonial.name} · {project.testimonial.role} ·{' '}
                {project.testimonial.company}
              </footer>
            </blockquote>
          </Container>
        </section>
      )}

      {/* 7. Next Project in Category */}
      <section className="border-t border-line py-[var(--section-pad-y)]">
        <Container>
          <a
            href={nextProject.href}
            data-testid="next-project-link"
            onClick={handleNextProjectClick}
            className="group grid grid-cols-1 items-center gap-10 rounded-card border border-line bg-surface p-6 transition-colors hover:border-line-accent md:p-12 lg:grid-cols-12"
          >
            <div className="space-y-5 lg:col-span-6">
              <Label muted={false} className="text-line-accent">
                {stage3.sections.nextProject} · {nextProject.number}
              </Label>
              <div className="flex items-baseline gap-4">
                <h2 className="text-display-l text-ink transition-colors group-hover:text-line-accent">
                  {nextProject.title}
                </h2>
                <Icon
                  name="arrow_outward"
                  size={24}
                  className="text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <p className="text-body-l text-ink-muted">{nextProject.result}</p>
              <TagList items={nextProject.services} />
            </div>

            <div
              data-next-project-preview="true"
              className="overflow-hidden rounded-card lg:col-span-6"
            >
              <Media
                type={nextProject.media.hero.type === 'image' ? 'image' : 'placeholder'}
                src={nextProject.media.hero.src}
                alt={nextProject.media.hero.alt}
                label={nextProject.media.hero.label}
                aspectRatio={nextProject.media.hero.aspectRatio}
              />
            </div>
          </a>
        </Container>
      </section>

      {/* 8. Closing CTA & Footer Transition */}
      <WorkClosingCta
        contextLocation={`case_study_${project.slug}`}
        primaryHref={closingPrimaryHref}
      />
    </>
  );
}
