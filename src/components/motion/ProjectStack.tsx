'use client';

import { useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Media } from '@/components/media/Media';
import { LoopVideo } from '@/components/media/LoopVideo';
import { TagList } from '@/components/ui/Tag';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Parallax } from '@/components/motion/Parallax';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { SHOW_CONCEPT_BADGE } from '@/config/site';
import type { ProjectItem } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { useZoomStore } from '@/store/zoom';
import { track } from '@/lib/analytics';

export interface ProjectStackProps {
  projects: ProjectItem[];
  cursorLabel?: string;
  showScrollProgress?: boolean;
  enableZoomTransition?: boolean;
}

/**
 * Signature Project Scroll Experience (Design System Section 6.3 & Work Prompt Section 6):
 * - Generalised for both the Home page and `/work/[category]`.
 * - Each project is a large media frame; as the next slides over it, the outgoing card
 *   scales to ~0.94, darkens, and moves slower (parallax).
 * - Media reveals with a clip-path and inner parallax; titles reveal line by line;
 *   mono counter (`01 / 04`) updates via ScrollTrigger callbacks.
 * - Optional edge scroll-progress bar (`showScrollProgress`) and shared-element zoom
 *   into the case study (`enableZoomTransition`).
 */
export function ProjectStack({
  projects,
  cursorLabel = 'View',
  showScrollProgress = false,
  enableZoomTransition = false,
}: ProjectStackProps) {
  const router = useRouter();
  const stackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);
  const saveOrigin = useZoomStore((s) => s.saveOrigin);
  const startZoom = useZoomStore((s) => s.startZoom);

  const totalLabel = String(projects.length).padStart(2, '0');
  const activeLabel = String(activeIndex + 1).padStart(2, '0');

  useGSAP(
    () => {
      const container = stackRef.current;
      if (!container || shouldSimplifyMotion) return;

      if (showScrollProgress && progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: MOTION.ease.linear,
            scrollTrigger: {
              trigger: container,
              start: 'top 25%',
              end: 'bottom 80%',
              scrub: true,
            },
          },
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>('.project-stack-card', container);
      const targetScale = isTouch
        ? MOTION.projectStack.outgoingScaleMobile
        : MOTION.projectStack.outgoingScale;

      cards.forEach((card, index) => {
        const mediaWrap = card.querySelector<HTMLElement>('.project-media-clip');
        const darkOverlay = card.querySelector<HTMLElement>('.project-card-dim');

        if (mediaWrap && index > 0) {
          gsap.fromTo(
            mediaWrap,
            { clipPath: 'inset(12% 4% 12% 4% round 6px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 6px)',
              ease: MOTION.ease.smoothOut,
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 25%',
                scrub: true,
              },
            },
          );
        }

        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 55%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (self.isActive) {
                setActiveIndex(index);
              }
            },
          },
        });

        const nextCard = cards[index + 1];
        if (nextCard) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom',
              end: 'top 15%',
              scrub: true,
            },
          });

          tl.to(
            card,
            {
              scale: targetScale,
              yPercent: isTouch ? -2 : -5,
              ease: MOTION.ease.linear,
            },
            0,
          );

          if (darkOverlay) {
            tl.to(
              darkOverlay,
              {
                opacity: MOTION.projectStack.outgoingOverlayOpacity,
                ease: MOTION.ease.linear,
              },
              0,
            );
          }
        }
      });
    },
    {
      scope: stackRef,
      dependencies: [shouldSimplifyMotion, isTouch, projects.length, showScrollProgress],
    },
  );

  const handleProjectClick = (
    event: MouseEvent<HTMLAnchorElement>,
    project: ProjectItem,
  ) => {
    resetCursor();
    track('work_project_opened', {
      category: project.category,
      slug: project.slug,
    });

    if (!enableZoomTransition) return;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const cardEl = document.getElementById(`project-card-${project.slug}`);
    const mediaEl = cardEl?.querySelector<HTMLElement>('.project-media-clip') ?? cardEl;
    const rect = mediaEl?.getBoundingClientRect();

    const originKey = `project:${project.category}:${project.slug}`;
    const zoomRect = rect
      ? {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
      : null;

    if (zoomRect) {
      saveOrigin(originKey, zoomRect, project.media.label);
    }

    if (shouldSimplifyMotion || !zoomRect) {
      router.push(project.href);
      return;
    }

    startZoom({
      direction: 'in',
      targetHref: project.href,
      originKey,
      fromRect: zoomRect,
      label: project.media.label,
      title: project.title,
    });
  };

  return (
    <div ref={stackRef} className="relative space-y-12 md:space-y-0">
      {/* Optional thin accent scroll-progress bar along the right edge */}
      {showScrollProgress && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-28 right-3 bottom-12 z-30 hidden w-[2px] bg-line md:block"
        >
          <div
            ref={progressBarRef}
            className="h-full w-full origin-top scale-y-0 bg-line-accent"
          />
        </div>
      )}

      {/* Sticky project counter bar */}
      <div className="pointer-events-none sticky top-24 z-30 mb-6 flex items-center justify-between">
        <span
          data-testid="project-stack-counter"
          className="text-label-mono rounded-pill border border-line bg-bg/90 px-3.5 py-1.5 text-ink backdrop-blur-sm"
        >
          {activeLabel} / {totalLabel}
        </span>
      </div>

      <div className="space-y-16 md:space-y-24">
        {projects.map((project, index) => {
          const LinkComponent = enableZoomTransition ? 'a' : TransitionLink;
          return (
            <article
              key={project.slug}
              id={`project-card-${project.slug}`}
              data-project-slug={project.slug}
              className="project-stack-card relative overflow-hidden rounded-card border border-line bg-bg p-5 will-change-transform md:sticky md:top-28 md:p-8"
              style={{ zIndex: index + 1 }}
            >
              {/* Darkening overlay for outgoing card */}
              <div
                aria-hidden="true"
                className="project-card-dim pointer-events-none absolute inset-0 z-20 bg-[#0a0a0a] opacity-0"
              />

              <LinkComponent
                href={project.href}
                data-cursor="view"
                onClick={(e) => handleProjectClick(e, project)}
                onMouseEnter={() => !isTouch && setCursor('view', cursorLabel)}
                onMouseLeave={() => !isTouch && resetCursor()}
                className="group block space-y-6"
              >
                {/* Top metadata bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-label-mono text-ink-muted">
                      {project.number} / {totalLabel}
                    </span>
                    <TagList items={project.services} />
                  </div>
                  <div className="flex items-center gap-2.5">
                    {SHOW_CONCEPT_BADGE && project.isConcept && (
                      <span
                        data-testid="concept-project-badge"
                        className="text-label-mono rounded-pill border border-line px-2.5 py-0.5 text-ink-muted"
                      >
                        {WORK_CONTENT.stage3.conceptBadgeLabel}
                      </span>
                    )}
                    <span className="text-label-mono text-ink-muted">{project.year}</span>
                  </div>
                </div>

                {/* Large Media Frame with Clip-Path Reveal & Inner Parallax */}
                <div className="project-media-clip overflow-hidden rounded-card">
                  <Parallax>
                    {project.media.type === 'video' && project.media.src && project.media.poster ? (
                      <LoopVideo
                        src={project.media.src}
                        poster={project.media.poster}
                        alt={project.media.alt}
                        aspectRatio={project.media.aspectRatio}
                      />
                    ) : (
                      <Media
                        type={project.media.type === 'image' ? 'image' : 'placeholder'}
                        src={project.media.src}
                        alt={project.media.alt}
                        label={project.media.label}
                        aspectRatio={project.media.aspectRatio}
                        priority={index === 0}
                      />
                    )}
                  </Parallax>
                </div>

                {/* Project Title, Service Tags beneath title, & Result Line */}
                <div className="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-end">
                  <div className="space-y-2">
                    <SplitReveal as="h3" className="text-display-l text-ink">
                      {project.title}
                    </SplitReveal>
                    <TagList items={project.services} />
                  </div>
                  <p className="text-body text-ink-muted md:max-w-[34ch] md:text-right">
                    {project.result}
                  </p>
                </div>
              </LinkComponent>
            </article>
          );
        })}
      </div>
    </div>
  );
}
