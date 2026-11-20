'use client';

import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { PackagePrice } from '@/components/ui/PackagePrice';
import { PackageMatcher } from '@/components/ui/PackageMatcher';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import {
  PACKAGES_CONTENT,
  type CurrencyCode,
} from '@/content/packages';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Section 8: Packages and "Find your fit" (Home Prompt Section 4.8)
 * - Surface background (`bg-surface`).
 * - Currency switch: USD / NGN toggle (default USD).
 * - Four hairline-separated columns (Launch Starter, Launch Plus, Growth Retainer, Custom Package).
 * - Single-service note + "See all packages" link (`/services#packages`).
 * - Shared interactive two-question package matcher ("Find your fit").
 */
export function Packages() {
  const currency = useUIStore((s) => s.currency);
  const setCurrency = useUIStore((s) => s.setCurrency);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    track('currency_switch', { currency: nextCurrency });
    track('currency_switched', { currency: nextCurrency });
  };

  return (
    <section
      id="packages"
      className="border-t border-line bg-surface py-[var(--section-pad-y)]"
    >
      <Container className="space-y-12 md:space-y-16">
        {/* Top header + Currency Switch */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Label>{PACKAGES_CONTENT.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {PACKAGES_CONTENT.headline}
            </SplitReveal>
          </div>

          <div
            role="group"
            aria-label={PACKAGES_CONTENT.currencySwitchAriaLabel}
            className="inline-flex self-start rounded-pill border border-line bg-bg p-1 md:self-auto"
          >
            {PACKAGES_CONTENT.currencies.map((code) => {
              const isActive = currency === code;
              return (
                <button
                  key={code}
                  id={`currency-switch-${code.toLowerCase()}`}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleCurrencyChange(code)}
                  className={cn(
                    'text-label-mono rounded-pill px-4 py-2 transition-colors duration-200',
                    isActive
                      ? 'bg-inverse-bg text-inverse-ink'
                      : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Four package columns separated by hairlines (4th is inverse Custom Package) */}
        <div
          data-testid="packages-grid"
          className="grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-[repeat(2,minmax(0,1fr))] md:divide-y-0 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:divide-x"
        >
          {PACKAGES_CONTENT.packages.map((pkg) => {
            const isCustom = pkg.isCustom === true;
            return (
              <article
                key={pkg.slug}
                data-testid={`package-card-${pkg.slug}`}
                className={cn(
                  'flex min-w-0 flex-col justify-between gap-10 p-6 md:p-8 lg:px-7 lg:py-10 [container-type:inline-size]',
                  isCustom && 'surface-inverse border border-line',
                )}
              >
                <div className="min-w-0 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={cn(
                        'text-label-mono',
                        isCustom ? 'text-line-accent' : 'text-ink-muted',
                      )}
                    >
                      {isCustom && pkg.badgeLabel ? pkg.badgeLabel : pkg.number}
                    </span>
                    <span className="text-label-mono text-ink-muted">
                      {PACKAGES_CONTENT.timelinePrefix} · {pkg.timelineLabel}
                    </span>
                  </div>

                  <div className="space-y-2 lg:min-h-[5.5rem]">
                    <h3 className="text-heading-m text-ink">{pkg.name}</h3>
                    {pkg.tagline && (
                      <p className="font-sans text-lg font-medium tracking-tight text-ink">
                        {pkg.tagline}
                      </p>
                    )}
                  </div>

                  <p className="text-body max-w-[44ch] text-ink-muted">
                    {pkg.description}
                  </p>
                </div>

                <div className="min-w-0 space-y-6 border-t border-line pt-6">
                  <PackagePrice
                    price={pkg.prices[currency]}
                    isCustom={isCustom}
                    className="lg:min-h-[5.5rem]"
                  />
                  <TransitionLink
                    href={pkg.href}
                    onClick={() => {
                      track('start_project_click', {
                        location: 'package_column',
                        package: pkg.slug,
                      });
                      track('package_cta_clicked', {
                        package: pkg.slug,
                        currency,
                      });
                      if (isCustom) {
                        track('custom_package_clicked', {
                          location: 'home_packages_grid',
                        });
                      }
                    }}
                    className={cn(
                      'inline-flex w-full items-center justify-between gap-3 rounded-pill px-5 py-3 text-sm font-medium transition-colors duration-200',
                      isCustom
                        ? 'bg-ink text-bg hover:opacity-90'
                        : 'border border-line text-ink hover:border-ink',
                    )}
                  >
                    <span>{pkg.ctaLabel}</span>
                    <Icon name="arrow_outward" size={20} />
                  </TransitionLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* Single-service note + See all packages link */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-body text-ink-muted">{PACKAGES_CONTENT.singleServiceNote}</p>
          <TransitionLink
            href={PACKAGES_CONTENT.seeAllHref}
            className="link-underline text-btn shrink-0 text-ink"
          >
            <span>{PACKAGES_CONTENT.seeAllLabel}</span>
            <Icon name="arrow_outward" size={20} />
          </TransitionLink>
        </div>

        {/* Shared Interactive Two-Question Package Matcher ("Find your fit") */}
        <PackageMatcher source="home-matcher" idPrefix="matcher" />
      </Container>
    </section>
  );
}
