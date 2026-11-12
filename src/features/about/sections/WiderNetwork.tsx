'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { TagList } from '@/components/ui/Tag';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';

/**
 * Section 7: The Wider Team (About Prompt Section B3.7)
 * - Section label: 06 / THE NETWORK
 * - Headline: A small core, a trusted network.
 * - Body text + mono list of roles: DESIGNERS • DEVELOPERS • MARKETERS • [MORE SOON]
 * - Renders profile cards only if `widerNetwork.team` has entries (never invents team members)
 */
export function WiderNetwork() {
  const { widerNetwork } = ABOUT_CONTENT;

  return (
    <section
      id="the-network"
      className="relative border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="space-y-4 lg:col-span-7">
            <Label>{widerNetwork.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l max-w-[14ch] text-ink">
              {widerNetwork.headline}
            </SplitReveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="text-body-l text-ink-muted">{widerNetwork.body}</p>
            </Reveal>
          </div>
        </div>

        {/* Mono list of network roles */}
        <div className="border-y border-line py-6">
          <TagList items={[...widerNetwork.rolesLine]} className="text-ink" />
        </div>

        {/* Optional team profile cards (rendered only when team array is non-empty) */}
        {widerNetwork.team.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {widerNetwork.team.map((member) => (
              <article
                key={member.name}
                className="rounded-card border border-line bg-surface p-6"
              >
                <p className="font-sans text-lg font-medium text-ink">{member.name}</p>
                <p className="text-label-mono mt-1 text-ink-muted">{member.role}</p>
                {member.location && (
                  <p className="text-label-mono mt-3 text-ink-muted">{member.location}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
