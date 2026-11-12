'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ProjectStack } from '@/components/motion/ProjectStack';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { PROJECTS_CONTENT } from '@/content/projects';
import { HOME_CONTENT } from '@/features/home/home.content';
import { track } from '@/lib/analytics';

/**
 * Section 5: Selected work (Home Prompt Section 4.5)
 * - Section label: 03 / SELECTED WORK. Headline: Work we are proud of.
 * - Renders `ProjectStack` with three placeholder projects from `content/projects.ts`.
 * - Below: "View all work" button (`/work`) and "Start a project" conversion link.
 */
export function SelectedWork() {
  const { selectedWork } = HOME_CONTENT;

  return (
    <section
      id="selected-work"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="space-y-4">
          <Label>{selectedWork.sectionLabel}</Label>
          <SplitReveal as="h2" className="text-display-l text-ink">
            {selectedWork.headline}
          </SplitReveal>
        </div>

        <ProjectStack
          projects={PROJECTS_CONTENT}
          cursorLabel={selectedWork.cursorLabel}
        />

        <div className="flex flex-col items-start justify-between gap-8 border-t border-line pt-10 sm:flex-row sm:items-center">
          <Button href={selectedWork.viewAllCta.href} variant="secondary" icon="arrow_outward">
            {selectedWork.viewAllCta.label}
          </Button>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <TransitionLink
              href={selectedWork.startProjectCta.href}
              onClick={() => track('start_project_click', { location: 'selected_work' })}
              className="link-underline text-btn text-ink"
            >
              <span>{selectedWork.startProjectCta.label}</span>
              <Icon name="arrow_outward" size={20} />
            </TransitionLink>
            <span className="text-label-mono text-ink-muted">{selectedWork.reassurance}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
