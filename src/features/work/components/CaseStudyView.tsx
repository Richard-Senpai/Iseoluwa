'use client';

import type { MouseEvent } from 'react';
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
 * Stage 3: Case Study Template (`/work/[category]/[slug]`, Work Prompt Section 7):
 * 1. Back control returning to `/work/[category]` with zoom-out.
 * 2. Hero: project's hero media filling the viewport + mono `[CATEGORY] / [YEAR]` + Display XL `h1`.
 * 3. Meta row (mono): Client, Year, Services, Role.
 * 4. Overview: large summary paragraph that lights up on scroll (`ScrollText`).
 * 5. The challenge / What we did / The result: asymmetric editorial layout.
 * 6. Gallery: varied layout blocks (full bleed, two-up, offset) with inner parallax and reveal.
 * 7. Client quote: optional block rendered only if `project.testimonial` exists.
 * 8. Next project: large zoom link with preview media to the next project in the same category.
 * 9. Closing CTA & Footer transition (`WorkClosingCta`).
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

            <Label>
              {category.title.toUpperCase()} / {project.year}
            </Label>
          </div>

          <div className="space-y-6">
            <SplitReveal as="h1" triggerOnLoad className="text-display-xl text-ink">
              {project.title}
            </SplitReveal>
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

          {/* 2. Meta Row (Client, Year, Services, Role) */}
          <dl className="grid grid-cols-2 gap-6 border-y border-line py-8 md:grid-cols-4">
            <div className="space-y-2">
              <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.client}</dt>
              <dd className="font-mono text-sm text-ink">{project.client}</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.year}</dt>
              <dd className="font-mono text-sm text-ink">{project.year}</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.services}</dt>
              <dd>
                <TagList items={project.services} className="text-ink" />
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-label-mono text-ink-muted">{stage3.metaLabels.role}</dt>
              <dd className="font-mono text-sm text-ink">{project.role}</dd>
            </div>
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

      {/* 4. Asymmetric Editorial Breakdown: The Challenge / What We Did / The Result */}
      <section className="border-t border-line py-[var(--section-pad-y)]">
        <Container className="space-y-20 md:space-y-28">
          {/* The Challenge */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label>{stage3.sections.challenge}</Label>
            </div>
            <Reveal className="lg:col-span-8">
              <p className="text-body-l max-w-[60ch] text-ink">{project.challenge}</p>
            </Reveal>
          </div>

          {/* What We Did */}
          <div className="grid grid-cols-1 gap-6 border-t border-line pt-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label>{stage3.sections.approach}</Label>
            </div>
            <Reveal className="lg:col-span-8">
              <p className="text-body-l max-w-[60ch] text-ink">{project.approach}</p>
            </Reveal>
          </div>

          {/* The Result (single bold/large line followed by supporting text) */}
          <div className="grid grid-cols-1 gap-6 border-t border-line pt-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label>{stage3.sections.result}</Label>
            </div>
            <Reveal className="space-y-4 lg:col-span-8">
              <p className="text-display-l font-medium text-ink">{project.result}</p>
              <p className="text-body-l max-w-[60ch] text-ink-muted">{project.outcome}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. Gallery (Full bleed, Two-up, Offset blocks with inner Parallax and Reveal) */}
      <section className="border-t border-line py-[var(--section-pad-y)]">
        <Container className="space-y-12 md:space-y-20">
          <Label>{stage3.sections.gallery}</Label>

          {/* Full-bleed block */}
          {fullGallery.map((slot, idx) => (
            <Reveal key={`full-${idx}`}>
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

          {/* Offset editorial frame */}
          {offsetGallery.map((slot, idx) => (
            <div key={`offset-${idx}`} className="grid grid-cols-1 lg:grid-cols-12">
              <Reveal className="lg:col-span-9 lg:col-start-4">
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
      <WorkClosingCta contextLocation={`case_study_${project.slug}`} />
    </>
  );
}
