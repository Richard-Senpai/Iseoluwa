'use client';

import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TagList } from '@/components/ui/Tag';
import type { ProjectItem } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface ProjectIndexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  categoryTitle: string;
}

/**
 * Compact Index overlay on `/work/[category]` (Work Prompt Section 6):
 * - Lists all projects in the category (number, title, tags).
 * - Selecting one smoothly scrolls to `#project-card-<slug>` and closes the overlay.
 * - Closes on Escape and traps keyboard focus while open.
 */
export function ProjectIndexOverlay({
  isOpen,
  onClose,
  projects,
  categoryTitle,
}: ProjectIndexOverlayProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { shouldSimplifyMotion } = useMotionPreference();
  const { stage2 } = WORK_CONTENT;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialogEl = dialogRef.current;
    const focusables = dialogEl
      ? Array.from(
          dialogEl.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];

    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleJumpToProject = (slug: string) => {
    onClose();
    const targetEl = document.getElementById(`project-card-${slug}`);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: shouldSimplifyMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div
      id="work-project-index-overlay"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${categoryTitle} ${stage2.indexDialogTitle}`}
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/75 p-4 backdrop-blur-sm transition-opacity duration-300',
        isOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-card border border-line bg-bg p-6 text-ink md:p-10">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="text-label-mono text-ink-muted">
            {categoryTitle.toUpperCase()} · {stage2.indexOpenLabel.toUpperCase()}
          </span>
          <button
            id="work-index-close-button"
            type="button"
            aria-label={stage2.indexCloseLabel}
            onClick={onClose}
            className="text-label-mono inline-flex items-center gap-1.5 rounded-pill border border-line px-3 py-1.5 text-ink hover:border-line-accent"
          >
            <span>{stage2.indexCloseLabel}</span>
            <Icon name="close" size={20} />
          </button>
        </div>

        <ul className="divide-y divide-line">
          {projects.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                data-testid={`work-index-item-${project.slug}`}
                onClick={() => handleJumpToProject(project.slug)}
                className="group flex w-full flex-col justify-between gap-2 py-5 text-left transition-colors hover:text-line-accent sm:flex-row sm:items-baseline"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-label-mono text-ink-muted group-hover:text-line-accent">
                    {project.number}
                  </span>
                  <span className="text-heading-m text-ink group-hover:text-line-accent">
                    {project.title}
                  </span>
                </span>
                <TagList items={project.services} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
