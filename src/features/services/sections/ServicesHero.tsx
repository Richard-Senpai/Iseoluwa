'use client';

import type { MouseEvent } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { useLenis } from '@/components/motion/SmoothScroll';
import { SERVICES_CONTENT } from '@/features/services/services.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { track } from '@/lib/analytics';

/**
 * Section 1: Services Hero (`src/features/services/sections/ServicesHero.tsx`)
 * - Mono label `SERVICES`
 * - Headline (Display XL): Everything you need to launch and grow, in one place.
 * - Body L text + "Start a project" & "See packages" buttons + mono reassurance
 * - Thick FlowingLine Occurrence 1 of 3 on `/services`
 */
export function ServicesHero() {
  const { hero } = SERVICES_CONTENT;
  const lenis = useLenis();
  const { shouldSimplifyMotion } = useMotionPreference();

  const handleSeePackagesClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const packagesEl = document.getElementById('packages');
    if (packagesEl) {
      event.preventDefault();
      track('services_nav_clicked', { section: 'packages' });
      if (lenis && !shouldSimplifyMotion) {
        lenis.scrollTo(packagesEl, { offset: -72, duration: 0.9 });
      } else {
        packagesEl.scrollIntoView({ behavior: shouldSimplifyMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <section
      id="services-hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <Container className="relative z-10 space-y-10 md:space-y-12">
        <div className="max-w-[16ch] space-y-5">
          <Label withStatusDot>{hero.label}</Label>
          <SplitReveal as="h1" className="text-display-xl text-balance text-ink">
            {hero.headline}
          </SplitReveal>
        </div>

        <Reveal delay={0.08} className="max-w-[54ch] space-y-8">
          <p className="text-body-l text-ink-muted">{hero.body}</p>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                href={hero.primaryCta.href}
                variant="primary"
                onClick={() => {
                  track('start_project_click', { location: 'services_hero' });
                  track('services_cta_clicked', { service: 'hero' });
                }}
              >
                {hero.primaryCta.label}
              </Button>

              <a
                href={hero.secondaryCta.href}
                onClick={handleSeePackagesClick}
                className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-line bg-transparent px-6 py-3.5 text-ink transition-colors duration-200 hover:border-ink"
              >
                <span>{hero.secondaryCta.label}</span>
              </a>
            </div>

            <p className="text-label-mono text-ink-muted">{hero.reassurance}</p>
          </div>
        </Reveal>
      </Container>

      {/* Thick FlowingLine Occurrence 1 of 3 on /services */}
      <div className="pointer-events-none mt-10 w-full md:mt-14">
        <FlowingLine
          weight="hero"
          amplitude={26}
          frequency={0.004}
          speed={0.022}
          reactToPointer
          drawOnScroll
          className="h-28 md:h-40"
        />
      </div>
    </section>
  );
}
