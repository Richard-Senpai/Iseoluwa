'use client';

import { useRef, useState } from 'react';
import { Media } from '@/components/media/Media';
import { LoopVideo } from '@/components/media/LoopVideo';
import { TagList } from '@/components/ui/Tag';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Parallax } from '@/components/motion/Parallax';
import { TransitionLink } from '@/components/motion/TransitionLink';
import type { ProjectItem } from '@/content/projects';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';

export interface ProjectStackProps {
  projects: ProjectItem[];
  cursorLabel?: string;
}

/**
 * Signature Project Scroll Experience (Design System Section 6.3 & Tech Stack Section 4.3):
 * - Each project is a large media frame.
 * - As the next project scrolls up over the current one, the outgoing project scales down
 *   to ~0.94, darkens, and drifts upward slower (parallax).
 * - Inside each frame, media reveals via `clip-path` and inner parallax (`Parallax`).
 * - Mono counter (`01 / 03`) updates via ScrollTrigger callbacks.
 * - Desktop hover switches custom cursor into a ring labelled `View`.
 */
export function ProjectStack({ projects, cursorLabel = 'View' }: ProjectStackProps) {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const totalLabel = String(projects.length).padStart(2, '0');
  const activeLabel = String(activeIndex + 1).padStart(2, '0');

  useGSAP(
    () => {
      const container = stackRef.current;
      if (!container || shouldSimplifyMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>('.project-stack-card', container);
      const targetScale = isTouch
        ? MOTION.projectStack.outgoingScaleMobile
        : MOTION.projectStack.outgoingScale;

      cards.forEach((card, index) => {
        const mediaWrap = card.querySelector<HTMLElement>('.project-media-clip');
        const darkOverlay = card.querySelector<HTMLElement>('.project-card-dim');

        // Clip-path entrance reveal for incoming project media
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

        // Update active project counter
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

        // Scale down and darken outgoing card as the next card slides over it
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
    { scope: stackRef, dependencies: [shouldSimplifyMotion, isTouch, projects.length] },
  );

  return (
    <div ref={stackRef} className="relative space-y-12 md:space-y-0">
      {/* Sticky project counter bar */}
      <div className="sticky top-24 z-30 mb-6 flex items-center justify-between pointer-events-none">
        <span className="text-label-mono rounded-pill border border-line bg-bg/90 px-3.5 py-1.5 text-ink backdrop-blur-sm">
          {activeLabel} / {totalLabel}
        </span>
      </div>

      <div className="space-y-16 md:space-y-24">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className="project-stack-card relative overflow-hidden rounded-card border border-line bg-bg p-5 will-change-transform md:sticky md:top-28 md:p-8"
            style={{ zIndex: index + 1 }}
          >
            {/* Darkening overlay for outgoing card */}
            <div
              aria-hidden="true"
              className="project-card-dim pointer-events-none absolute inset-0 z-20 bg-[#0a0a0a] opacity-0"
            />

            <TransitionLink
              href={project.href}
              data-cursor="view"
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
                <span className="text-label-mono text-ink-muted">{project.year}</span>
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

              {/* Project Title & Result Line */}
              <div className="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-end">
                <SplitReveal as="h3" className="text-display-l text-ink">
                  {project.title}
                </SplitReveal>
                <p className="text-body text-ink-muted md:max-w-[34ch] md:text-right">
                  {project.result}
                </p>
              </div>
            </TransitionLink>
          </article>
        ))}
      </div>
    </div>
  );
}
