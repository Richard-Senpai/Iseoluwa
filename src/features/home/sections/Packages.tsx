'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import {
  PACKAGES_CONTENT,
  resolvePackageMatch,
  type CurrencyCode,
  type MatcherNeedOptionId,
  type MatcherStageOptionId,
} from '@/content/packages';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Section 8: Packages and "Find your fit" (Home Prompt Section 4.8)
 * - Surface background (`bg-surface`).
 * - Currency switch: USD / NGN toggle (default USD).
 * - Three hairline-separated columns (Launch Starter, Launch Plus, Growth Retainer).
 * - Single-service note + "See all packages" link (`/services`).
 * - Interactive two-question package matcher ("Find your fit"), keyboard accessible,
 *   with `aria-live="polite"` result card linking to `/contact?package=<slug>`.
 */
export function Packages() {
  const currency = useUIStore((s) => s.currency);
  const setCurrency = useUIStore((s) => s.setCurrency);

  const [selectedNeed, setSelectedNeed] = useState<MatcherNeedOptionId | null>(null);
  const [selectedStage, setSelectedStage] = useState<MatcherStageOptionId | null>(null);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    track('currency_switch', { currency: nextCurrency });
  };

  const handleSelectNeed = (need: MatcherNeedOptionId) => {
    setSelectedNeed(need);
    const match = resolvePackageMatch(need, selectedStage);
    if (match) {
      track('matcher_result_shown', {
        need,
        stage: selectedStage ?? '',
        recommendedPackage: match.slug,
      });
    }
  };

  const handleSelectStage = (stage: MatcherStageOptionId) => {
    setSelectedStage(stage);
    const match = resolvePackageMatch(selectedNeed, stage);
    if (match) {
      track('matcher_result_shown', {
        need: selectedNeed ?? '',
        stage,
        recommendedPackage: match.slug,
      });
    }
  };

  const recommendation = resolvePackageMatch(selectedNeed, selectedStage);
  const { matcher } = PACKAGES_CONTENT;

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
        <div className="grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {PACKAGES_CONTENT.packages.map((pkg) => {
            const isCustom = pkg.isCustom === true;
            return (
              <article
                key={pkg.slug}
                className={cn(
                  'flex flex-col justify-between gap-10 p-8 lg:py-10',
                  isCustom
                    ? 'bg-surface-inverse text-ink-on-inverse'
                    : 'lg:first:pl-0',
                )}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'text-label-mono',
                        isCustom ? 'text-accent' : 'text-ink-muted',
                      )}
                    >
                      {isCustom && pkg.badgeLabel ? pkg.badgeLabel : pkg.number}
                    </span>
                    <span
                      className={cn(
                        'text-label-mono',
                        isCustom ? 'text-inverse-ink/70' : 'text-ink-muted',
                      )}
                    >
                      {PACKAGES_CONTENT.timelinePrefix} · {pkg.timelineLabel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3
                      className={cn(
                        'text-heading-m',
                        isCustom ? 'text-inverse-ink' : 'text-ink',
                      )}
                    >
                      {pkg.name}
                    </h3>
                    {pkg.tagline && (
                      <p
                        className={cn(
                          'font-sans text-lg font-medium tracking-tight',
                          isCustom ? 'text-inverse-ink' : 'text-ink',
                        )}
                      >
                        {pkg.tagline}
                      </p>
                    )}
                  </div>

                  <p
                    className={cn(
                      'text-body max-w-[44ch]',
                      isCustom ? 'text-inverse-ink/80' : 'text-ink-muted',
                    )}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div
                  className={cn(
                    'space-y-6 border-t pt-6',
                    isCustom ? 'border-inverse-ink/20' : 'border-line',
                  )}
                >
                  <p
                    className={cn(
                      'text-display-l',
                      isCustom ? 'text-inverse-ink' : 'text-ink',
                    )}
                  >
                    {pkg.prices[currency]}
                  </p>
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
                      'inline-flex items-center justify-between gap-3 rounded-pill px-5 py-3 text-sm font-medium transition-colors duration-200',
                      isCustom
                        ? 'bg-inverse-ink text-inverse-bg hover:opacity-90'
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

        {/* Interactive Two-Question Package Matcher ("Find your fit") */}
        <div
          id="package-matcher"
          className="rounded-card border border-line bg-bg p-6 md:p-10 lg:p-12"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <div className="space-y-2">
                <Label>{matcher.label}</Label>
                <h3 className="text-heading-m text-ink">{matcher.title}</h3>
                <p className="text-body text-ink-muted">{matcher.subtitle}</p>
              </div>

              {/* Question 1 */}
              <fieldset className="space-y-4">
                <legend className="text-label-mono text-ink">{matcher.question1.prompt}</legend>
                <div className="flex flex-wrap gap-3 pt-1">
                  {matcher.question1.options.map((option) => {
                    const isSelected = selectedNeed === option.id;
                    return (
                      <button
                        key={option.id}
                        id={`matcher-need-${option.id}`}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectNeed(option.id)}
                        className={cn(
                          'rounded-pill border px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                          isSelected
                            ? 'border-line-accent bg-green-light text-[#0a0a0a] dark:bg-green-signal dark:text-[#0a0a0a]'
                            : 'border-line bg-transparent text-ink hover:border-line-accent',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Question 2 */}
              <fieldset className="space-y-4">
                <legend className="text-label-mono text-ink">{matcher.question2.prompt}</legend>
                <div className="flex flex-wrap gap-3 pt-1">
                  {matcher.question2.options.map((option) => {
                    const isSelected = selectedStage === option.id;
                    return (
                      <button
                        key={option.id}
                        id={`matcher-stage-${option.id}`}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectStage(option.id)}
                        className={cn(
                          'rounded-pill border px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                          isSelected
                            ? 'border-line-accent bg-green-light text-[#0a0a0a] dark:bg-green-signal dark:text-[#0a0a0a]'
                            : 'border-line bg-transparent text-ink hover:border-line-accent',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Result Card */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="flex flex-col justify-between rounded-card border border-line bg-surface p-6 md:p-8 lg:col-span-5"
            >
              {recommendation ? (
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="space-y-4">
                    <Label withStatusDot muted={false}>
                      {matcher.recommendedLabel}
                    </Label>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4
                        id="matcher-result-title"
                        className="text-heading-m text-ink"
                      >
                        {recommendation.packageName}
                      </h4>
                      <span className="font-mono text-lg font-medium text-line-accent">
                        {recommendation.price[currency]}
                      </span>
                    </div>
                    <p className="text-body text-ink-muted">{recommendation.reason}</p>
                  </div>

                  <div>
                    <Button
                      href={recommendation.href}
                      variant="primary"
                      onClick={() => {
                        track('matcher_button_click', {
                          package: recommendation.slug,
                          currency,
                        });
                        track('package_cta_clicked', {
                          package: recommendation.slug,
                          source: 'home-matcher',
                        });
                        if (recommendation.slug === 'custom') {
                          track('custom_package_clicked', {
                            location: 'home_matcher',
                          });
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      {recommendation.ctaLabel ??
                        `${recommendation.ctaPrefix} ${recommendation.packageName}`}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center py-8 text-center">
                  <p className="text-body max-w-[30ch] text-ink-muted">{matcher.emptyPrompt}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
