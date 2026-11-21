'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { TagList } from '@/components/ui/Tag';
import { Media } from '@/components/media/Media';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { REAL_WEBSITE_PROJECTS } from '@/content/projects';
import { HOME_CONTENT } from '@/features/home/home.content';
import { track } from '@/lib/analytics';

/**
 * Home Page Strip: "Websites we have built." (`src/features/home/sections/RecentBuildsStrip.tsx`)
 * - Placed right after Selected Work on `/`.
 * - Section label: `RECENT BUILDS`
 * - Headline: `Websites we have built.`
 * - Four compact cards for the 4 real sites (`icestein-grillz`, `crtx-nutrition`, `divathea`, `richard-portfolio`),
 *   each showing its 16:9 `hero.webp`, title, service tags, `LIVE SITE` badge, link to its case study,
 *   and a direct `Visit live ↗` external link.
 */
export function RecentBuildsStrip() {
  const { recentBuilds } = HOME_CONTENT;

  return (
    <section
      id="recent-builds"
      data-testid="recent-builds-strip"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container className="space-y-10 md:space-y-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <Label>{recentBuilds.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {recentBuilds.headline}
            </SplitReveal>
          </div>

          <TransitionLink
            href={recentBuilds.seeAllWebsitesCta.href}
            className="link-underline text-btn text-ink"
          >
            <span>{recentBuilds.seeAllWebsitesCta.label}</span>
            <Icon name="arrow_outward" size={20} />
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REAL_WEBSITE_PROJECTS.map((site) => (
            <article
              key={site.slug}
              data-testid={`recent-build-card-${site.slug}`}
              className="group flex flex-col justify-between rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-accent"
            >
              <div className="space-y-4">
                <TransitionLink
                  href={site.href}
                  onClick={() =>
                    track('home_builds_strip_clicked', {
                      slug: site.slug,
                      target: 'case-study',
                    })
                  }
                  className="block overflow-hidden rounded-card"
                >
                  <Media
                    type="image"
                    src={site.media.hero.src}
                    alt={site.media.hero.alt}
                    label={site.media.hero.label}
                    aspectRatio="16/9"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </TransitionLink>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      data-testid="live-site-badge"
                      className="text-label-mono inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-0.5 text-ink"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{recentBuilds.liveBadgeLabel}</span>
                    </span>
                  </div>

                  <h3 className="font-sans text-lg font-medium text-ink">
                    <TransitionLink
                      href={site.href}
                      onClick={() =>
                        track('home_builds_strip_clicked', {
                          slug: site.slug,
                          target: 'case-study',
                        })
                      }
                      className="transition-colors hover:text-line-accent"
                    >
                      {site.title}
                    </TransitionLink>
                  </h3>

                  <TagList items={site.services.slice(0, 2)} />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3.5">
                <TransitionLink
                  href={site.href}
                  onClick={() =>
                    track('home_builds_strip_clicked', {
                      slug: site.slug,
                      target: 'case-study',
                    })
                  }
                  className="text-label-mono text-ink-muted transition-colors hover:text-ink"
                >
                  {recentBuilds.viewCaseStudyLabel}
                </TransitionLink>

                {site.liveUrl && (
                  <a
                    href={site.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`recent-build-live-link-${site.slug}`}
                    onClick={() => {
                      track('home_builds_strip_clicked', {
                        slug: site.slug,
                        target: 'live',
                      });
                      track('work_live_site_clicked', {
                        slug: site.slug,
                        url: site.liveUrl!,
                      });
                    }}
                    className="text-label-mono inline-flex items-center gap-1 text-ink transition-colors hover:text-line-accent"
                  >
                    <span>{recentBuilds.visitLiveLabel}</span>
                    <Icon name="arrow_outward" size={20} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
