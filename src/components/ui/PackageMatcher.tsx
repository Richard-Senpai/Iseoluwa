'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import {
  PACKAGES_CONTENT,
  resolvePackageMatch,
  type MatcherNeedOptionId,
  type MatcherStageOptionId,
} from '@/content/packages';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface PackageMatcherProps {
  source?: 'home-matcher' | 'services-matcher';
  idPrefix?: string;
  className?: string;
}

/**
 * Shared Two-Question Package Matcher ("Find your fit") used on both Home (`/`) and Services (`/services`).
 * - Keyboard accessible buttons with `aria-pressed`
 * - `aria-live="polite"` result card linking to `/contact?package=<slug>&source=<source>`
 * - "Something else or not sure" immediately recommends the Custom Package
 */
export function PackageMatcher({
  source = 'home-matcher',
  idPrefix = 'matcher',
  className,
}: PackageMatcherProps) {
  const currency = useUIStore((s) => s.currency);
  const [selectedNeed, setSelectedNeed] = useState<MatcherNeedOptionId | null>(null);
  const [selectedStage, setSelectedStage] = useState<MatcherStageOptionId | null>(null);

  const handleSelectNeed = (need: MatcherNeedOptionId) => {
    setSelectedNeed(need);
    const match = resolvePackageMatch(need, selectedStage);
    if (match) {
      track('matcher_result_shown', {
        need,
        stage: selectedStage ?? '',
        recommendedPackage: match.slug,
        source,
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
        source,
      });
    }
  };

  const recommendation = resolvePackageMatch(selectedNeed, selectedStage);
  const { matcher } = PACKAGES_CONTENT;

  const targetHref = recommendation
    ? source === 'services-matcher'
      ? `/contact?package=${recommendation.slug}&source=services-matcher`
      : recommendation.href
    : '/contact';

  return (
    <div
      id={idPrefix === 'matcher' ? 'package-matcher' : `${idPrefix}-package-matcher`}
      data-testid="package-matcher"
      className={cn(
        'rounded-card border border-line bg-bg p-6 md:p-10 lg:p-12',
        className,
      )}
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
                    id={`${idPrefix}-need-${option.id}`}
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
                    id={`${idPrefix}-stage-${option.id}`}
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
                    id={`${idPrefix}-result-title`}
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
                  href={targetHref}
                  variant="primary"
                  onClick={() => {
                    track('matcher_button_click', {
                      package: recommendation.slug,
                      currency,
                    });
                    track('package_cta_clicked', {
                      package: recommendation.slug,
                      source,
                    });
                    if (recommendation.slug === 'custom') {
                      track('custom_package_clicked', {
                        location: source,
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
  );
}
