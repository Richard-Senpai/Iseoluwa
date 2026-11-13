'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { Media } from '@/components/media/Media';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { SHOW_CONCEPT_BADGE } from '@/config/site';
import type { ProjectItem, WorkCategory } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

export interface CategoryPanelProps {
  category: WorkCategory;
  projects: ProjectItem[];
  index: number;
  total: number;
  isActive: boolean;
  offsetFromActive: number;
  onSelectNeighbor: (index: number) => void;
  onEnterCategory: (category: WorkCategory, previewEl: HTMLElement | null) => void;
}

/**
 * Single category slide inside `CategorySwiper` (Work Prompt Section 4):
 * - Group labelled e.g. "Branding, 1 of 3".
 * - Mono index (`01`), category title in Display XL, tagline in Body L.
 * - Fanned stack of three project previews on distinct depth layers (`data-depth`).
 * - Mono line with project count (`04 PROJECTS`) and bullet-separated tags.
 * - Active panel displays pill button `Enter [Category]` with `arrow_outward`.
 */
export function CategoryPanel({
  category,
  projects,
  index,
  total,
  isActive,
  offsetFromActive,
  onSelectNeighbor,
  onEnterCategory,
}: CategoryPanelProps) {
  const { stage1 } = WORK_CONTENT;
  const { isTouch, shouldSimplifyMotion } = useMotionPreference();
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const previewProjects = projects.slice(0, 3);
  const projectCountLabel = `${String(projects.length).padStart(2, '0')} ${stage1.projectsCountSuffix}`;

  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;

    if (!isActive) {
      onSelectNeighbor(index);
      return;
    }

    const previewEl = event.currentTarget.querySelector<HTMLElement>(
      '[data-category-primary-preview="true"]',
    );
    onEnterCategory(category, previewEl);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isActive) {
        onSelectNeighbor(index);
      } else {
        const previewEl = event.currentTarget.querySelector<HTMLElement>(
          '[data-category-primary-preview="true"]',
        );
        onEnterCategory(category, previewEl);
      }
    }
  };

  // Neighbor rotation & scale when not reduced motion
  const neighborScale = shouldSimplifyMotion ? 1 : isActive ? 1 : 0.88;
  const neighborRotateY = shouldSimplifyMotion
    ? 0
    : offsetFromActive < 0
      ? 2.5
      : offsetFromActive > 0
        ? -2.5
        : 0;

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${category.title}, ${index + 1} of ${total}`}
      data-testid={`work-panel-${category.slug}`}
      data-active={isActive ? 'true' : 'false'}
      tabIndex={0}
      onClick={handlePanelClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (isTouch) return;
        if (isActive) {
          setCursor('enter', stage1.cursorEnterLabel);
        } else {
          setCursor('drag', stage1.cursorDragLabel);
        }
      }}
      onMouseLeave={() => {
        if (!isTouch) resetCursor();
      }}
      style={{
        transform: `scale(${neighborScale}) rotate(${neighborRotateY}deg)`,
      }}
      className={cn(
        'work-category-panel relative flex h-full w-[86vw] shrink-0 cursor-pointer flex-col justify-between rounded-card border border-current/15 p-6 transition-[transform,opacity,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none md:w-[74vw] md:p-10 lg:w-[72vw] lg:p-12',
        isActive
          ? 'opacity-100 hover:border-line-accent'
          : 'opacity-45 hover:opacity-75',
      )}
    >
      {/* Top row: Mono index + Title + Tagline */}
      <div
        data-depth="title"
        className="grid grid-cols-1 gap-4 will-change-transform lg:grid-cols-12 lg:items-end"
      >
        <div className="space-y-2 lg:col-span-7">
          <span className="text-label-mono block opacity-70">{category.number}</span>
          <h2 className="text-display-xl tracking-[-0.035em]">{category.title}</h2>
        </div>
        <div className="lg:col-span-5 lg:pb-2">
          <p className="text-body-l opacity-80">{category.tagline}</p>
        </div>
      </div>

      {/* Middle row: Fanned stack of three project previews on distinct depth layers */}
      <div className="relative my-auto flex items-center justify-center py-4 md:py-6">
        <div className="relative h-36 w-full max-w-2xl sm:h-44 md:h-56 lg:h-64">
          {/* Layer 3 (back left) */}
          {previewProjects[2] && (
            <div
              data-depth="fan-3"
              className="pointer-events-none absolute top-3 left-2 w-[56%] -rotate-3 opacity-60 transition-transform duration-500 will-change-transform md:left-6"
            >
              <Media
                type={previewProjects[2].media.type === 'image' ? 'image' : 'placeholder'}
                src={previewProjects[2].media.src}
                alt={previewProjects[2].media.alt}
                label={previewProjects[2].title}
                aspectRatio="16/9"
                className="border-current/20 bg-current/5"
              />
            </div>
          )}

          {/* Layer 2 (back right) */}
          {previewProjects[1] && (
            <div
              data-depth="fan-2"
              className="pointer-events-none absolute top-2 right-2 w-[56%] rotate-3 opacity-75 transition-transform duration-500 will-change-transform md:right-6"
            >
              <Media
                type={previewProjects[1].media.type === 'image' ? 'image' : 'placeholder'}
                src={previewProjects[1].media.src}
                alt={previewProjects[1].media.alt}
                label={previewProjects[1].title}
                aspectRatio="16/9"
                className="border-current/20 bg-current/5"
              />
            </div>
          )}

          {/* Layer 1 (front centre — primary zoom origin frame) */}
          {previewProjects[0] && (
            <div
              data-depth="fan-1"
              data-category-primary-preview="true"
              className="relative z-10 mx-auto w-[68%] transition-transform duration-500 will-change-transform md:w-[62%]"
            >
              <Media
                type={previewProjects[0].media.type === 'image' ? 'image' : 'placeholder'}
                src={previewProjects[0].media.src}
                alt={previewProjects[0].media.alt}
                label={`${category.title.toUpperCase()} · ${previewProjects[0].media.label}`}
                aspectRatio="16/9"
                priority={index === 0}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Project count + Tags + Active Enter button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-current/15 pt-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-label-mono font-medium">{projectCountLabel}</span>
          {SHOW_CONCEPT_BADGE && projects.some((p) => p.isConcept) && (
            <>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span
                data-testid="concept-project-badge"
                className="text-label-mono rounded-pill border border-current/25 px-2.5 py-0.5 opacity-80"
              >
                {WORK_CONTENT.stage3.conceptBadgeLabel}
              </span>
            </>
          )}
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <TagList items={category.tags} className="text-current opacity-75" />
        </div>

        <div
          className={cn(
            'transition-opacity duration-300',
            isActive ? ' opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <Button
            id={`enter-category-${category.slug}`}
            variant="primary"
            icon="arrow_outward"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              const panelEl = (e.currentTarget as HTMLElement).closest('.work-category-panel');
              const previewEl =
                panelEl?.querySelector<HTMLElement>('[data-category-primary-preview="true"]') ??
                null;
              onEnterCategory(category, previewEl);
            }}
            className="h-11 px-5"
          >
            {`${stage1.enterPrefix} ${category.title}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
