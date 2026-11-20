'use client';

import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import { PackagePrice } from '@/components/ui/PackagePrice';
import { PackageMatcher } from '@/components/ui/PackageMatcher';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import {
  ALL_PACKAGES,
  PACKAGES_CONTENT,
  type CurrencyCode,
  type PackageItem,
  type PackageSlug,
} from '@/content/packages';
import {
  MATRIX_PACKAGE_COLUMNS,
  PACKAGE_ADD_ONS,
  PACKAGE_MATRIX_ROWS,
  PACKAGE_TERMS,
} from '@/content/package-matrix';
import { SERVICES_CONTENT } from '@/features/services/services.content';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const GROUP_LABELS: Record<PackageItem['group'], string> = {
  launch: 'LAUNCH PACKAGE',
  single: 'SINGLE SERVICE',
  ongoing: 'ONGOING CARE',
  custom: 'FOR EVERY BUDGET',
};

/**
 * Section 7: Packages (`src/features/services/sections/ServicesPackages.tsx`)
 * - Surface background (`bg-surface`)
 * - Shared USD / NGN switch & currency store
 * - All 7 packages grouped cleanly in equal `minmax(0, 1fr)` grids with container-query price sizing,
 *   first 4 inclusions + inline expandable "See everything included", and `/contact?package=<slug>&source=services` CTAs
 * - Custom Package in `.surface-inverse` with `FOR EVERY BUDGET` and `Tell us what you need`
 * - Side-by-side comparison table (`content/package-matrix.ts`) with sticky header/column on desktop
 *   and per-package accordion on mobile
 * - Add-ons block ("Quoted per project")
 * - Terms in plain language linking to `/terms`
 * - Shared two-question "Find your fit" `<PackageMatcher />`
 */
export function ServicesPackages() {
  const { packagesSection } = SERVICES_CONTENT;
  const currency = useUIStore((s) => s.currency);
  const setCurrency = useUIStore((s) => s.setCurrency);

  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const [openMobileMatrixSlug, setOpenMobileMatrixSlug] = useState<string | null>(
    MATRIX_PACKAGE_COLUMNS[0]?.slug ?? null,
  );
  const matrixRef = useRef<HTMLDivElement>(null);
  const hasTrackedMatrixRef = useRef(false);

  // Track `package_matrix_viewed` once when the comparison table enters the viewport
  useEffect(() => {
    const el = matrixRef.current;
    if (!el || hasTrackedMatrixRef.current) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !hasTrackedMatrixRef.current) {
          hasTrackedMatrixRef.current = true;
          track('package_matrix_viewed');
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    track('currency_switch', { currency: nextCurrency });
    track('currency_switched', { currency: nextCurrency });
  };

  const togglePackageDetails = (slug: PackageSlug) => {
    setExpandedPackages((prev) => {
      const nextOpen = !prev[slug];
      if (nextOpen) {
        track('package_details_opened', { package: slug });
      }
      return { ...prev, [slug]: nextOpen };
    });
  };

  // Row 1 (4 equal columns): Launch (Starter, Plus) + Single services (Brand-Only, Build-Only)
  const primaryRowSlugs: PackageSlug[] = [
    'launch-starter',
    'launch-plus',
    'brand-only',
    'build-only',
  ];
  // Row 2 (3 equal columns): Ongoing (Care Plan, Growth Retainer) + Custom Package
  const secondaryRowSlugs: PackageSlug[] = ['care-plan', 'growth-retainer', 'custom'];

  const primaryPackages = primaryRowSlugs
    .map((slug) => ALL_PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is PackageItem => Boolean(p));

  const secondaryPackages = secondaryRowSlugs
    .map((slug) => ALL_PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is PackageItem => Boolean(p));

  const renderPackageCard = (pkg: PackageItem) => {
    const isCustom = pkg.isCustom === true;
    const isExpanded = Boolean(expandedPackages[pkg.slug]);
    const initialIncludes = pkg.includes.slice(0, 4);
    const extraIncludes = pkg.includes.slice(4);
    const hasExtra = extraIncludes.length > 0;
    const detailsPanelId = `package-extra-details-${pkg.slug}`;

    return (
      <article
        key={pkg.slug}
        data-testid={`services-package-card-${pkg.slug}`}
        className={cn(
          'flex min-w-0 flex-col justify-between gap-8 bg-bg p-6 md:p-8 lg:px-7 lg:py-9 [container-type:inline-size]',
          isCustom && 'surface-inverse border border-line',
        )}
      >
        <div className="min-w-0 space-y-5">
          {/* Group badge & Timeline */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={cn(
                'text-label-mono',
                isCustom ? 'text-line-accent' : 'text-ink-muted',
              )}
            >
              {isCustom && pkg.badgeLabel ? pkg.badgeLabel : GROUP_LABELS[pkg.group]}
            </span>
            <span className="text-label-mono text-ink-muted">
              {PACKAGES_CONTENT.timelinePrefix} · {pkg.timelineLabel}
            </span>
          </div>

          {/* Package Name & Best For line */}
          <div className="space-y-2 lg:min-h-[6rem]">
            <h3 className="text-heading-m text-ink">{pkg.name}</h3>
            <p className="text-body text-ink-muted">
              <span className="text-label-mono mr-2 text-line-accent">
                {packagesSection.bestForLabel}:
              </span>
              <span>{pkg.bestFor}</span>
            </p>
          </div>

          {/* Container-query Price */}
          <div className="border-y border-line py-5">
            <PackagePrice
              price={pkg.prices[currency]}
              isCustom={isCustom}
              className="lg:min-h-[5.25rem]"
            />
          </div>

          {/* First 4 Inclusions + Expandable Rest (all present in SSR HTML) */}
          <div className="space-y-3">
            <p className="text-label-mono text-ink-muted">{packagesSection.includesLabel}</p>
            <ul className="space-y-2.5">
              {initialIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Icon
                    name="check"
                    size={20}
                    className="mt-0.5 shrink-0 text-line-accent"
                  />
                  <span className="text-body text-ink">{item}</span>
                </li>
              ))}
            </ul>

            {/* Extra inclusions & revision/payment metadata (always in DOM for SSR/crawlers) */}
            <div
              id={detailsPanelId}
              aria-hidden={!isExpanded}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2.5 pt-2.5">
                  {extraIncludes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Icon
                        name="check"
                        size={20}
                        className="mt-0.5 shrink-0 text-line-accent"
                      />
                      <span className="text-body text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1.5 border-t border-line pt-3 font-mono text-xs text-ink-muted">
                  <p>Revisions: {pkg.revisions}</p>
                  <p>Payment: {pkg.paymentNote}</p>
                </div>
              </div>
            </div>

            {hasExtra && (
              <button
                type="button"
                data-testid={`package-details-toggle-${pkg.slug}`}
                aria-expanded={isExpanded}
                aria-controls={detailsPanelId}
                onClick={() => togglePackageDetails(pkg.slug)}
                className="text-label-mono link-underline inline-flex items-center gap-1.5 pt-1 text-ink"
              >
                <span>
                  {isExpanded
                    ? packagesSection.hideExtraLabel
                    : packagesSection.seeEverythingLabel}
                </span>
                <Icon name={isExpanded ? 'remove' : 'add'} size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Conversion CTA Button */}
        <div className="min-w-0 pt-2">
          <TransitionLink
            href={pkg.servicesHref}
            data-testid={`services-package-cta-${pkg.slug}`}
            onClick={() => {
              track('package_cta_clicked', {
                package: pkg.slug,
                source: 'services',
                currency,
              });
              if (isCustom) {
                track('custom_package_clicked', {
                  location: 'services_packages_grid',
                });
              }
            }}
            className={cn(
              'inline-flex w-full items-center justify-between gap-3 rounded-pill px-5 py-3.5 text-sm font-medium transition-colors duration-200',
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
  };

  return (
    <section
      id="packages"
      data-testid="services-packages-section"
      className="border-b border-line bg-surface py-[var(--section-pad-y)]"
    >
      <Container className="space-y-16 md:space-y-20">
        {/* Top Header + Shared USD / NGN Currency Switch */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[38ch] space-y-4">
            <Label>{packagesSection.sectionLabel}</Label>
            <SplitReveal as="h2" className="text-display-l text-ink">
              {packagesSection.headline}
            </SplitReveal>
            <p className="text-body-l text-ink-muted">{packagesSection.subtitle}</p>
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
                  id={`services-currency-switch-${code.toLowerCase()}`}
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

        {/* 7 Package Cards in Equal minmax(0, 1fr) Grids */}
        <div className="space-y-8">
          {/* Primary 4-column grid: Launch (Starter, Plus) + Single services (Brand-Only, Build-Only) */}
          <div
            data-testid="services-packages-grid-primary"
            className="grid grid-cols-1 divide-y divide-line border border-line md:grid-cols-[repeat(2,minmax(0,1fr))] md:divide-y-0 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:divide-x"
          >
            {primaryPackages.map(renderPackageCard)}
          </div>

          {/* Secondary 3-column grid: Ongoing (Care Plan, Growth Retainer) + Custom Package (.surface-inverse) */}
          <div
            data-testid="services-packages-grid-secondary"
            className="grid grid-cols-1 divide-y divide-line border border-line md:grid-cols-[repeat(3,minmax(0,1fr))] md:divide-x md:divide-y-0"
          >
            {secondaryPackages.map(renderPackageCard)}
          </div>
        </div>

        {/* b) Comparison Table (Sticky headers on desktop, per-package accordion on mobile) */}
        <div ref={matrixRef} className="space-y-8 pt-4">
          <div className="space-y-2">
            <Label>{packagesSection.matrix.label}</Label>
            <h3 className="text-display-m text-ink">{packagesSection.matrix.headline}</h3>
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden overflow-x-auto rounded-card border border-line bg-bg lg:block">
            <table
              data-testid="package-comparison-table"
              className="w-full border-collapse text-left"
            >
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th
                    scope="col"
                    className="text-label-mono sticky left-0 z-20 bg-surface px-6 py-4 text-ink"
                  >
                    {packagesSection.matrix.featureColumnHeader}
                  </th>
                  {MATRIX_PACKAGE_COLUMNS.map((col) => (
                    <th
                      key={col.slug}
                      scope="col"
                      className="text-label-mono px-4 py-4 text-center text-ink"
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PACKAGE_MATRIX_ROWS.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-surface/60">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-bg px-6 py-4 font-sans text-sm font-medium text-ink"
                    >
                      {row.feature}
                    </th>
                    {MATRIX_PACKAGE_COLUMNS.map((col) => {
                      const cellValue = row.values[col.slug];
                      return (
                        <td
                          key={col.slug}
                          className="px-4 py-4 text-center font-mono text-xs text-ink"
                        >
                          {typeof cellValue === 'string' ? (
                            <span className="text-ink">{cellValue}</span>
                          ) : cellValue ? (
                            <span className="inline-flex items-center justify-center text-line-accent">
                              <Icon name="check" size={20} />
                              <span className="sr-only">
                                {packagesSection.matrix.includedSrLabel}
                              </span>
                            </span>
                          ) : (
                            <span className="text-ink-muted">
                              <span aria-hidden="true">
                                {packagesSection.matrix.notIncludedSymbol}
                              </span>
                              <span className="sr-only">
                                {packagesSection.matrix.notIncludedSrLabel}
                              </span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Per-Package Comparison Accordion */}
          <div
            data-testid="package-matrix-mobile-accordion"
            className="divide-y divide-line rounded-card border border-line bg-bg lg:hidden"
          >
            {MATRIX_PACKAGE_COLUMNS.map((col) => {
              const isOpen = openMobileMatrixSlug === col.slug;
              const triggerId = `matrix-mobile-trigger-${col.slug}`;
              const panelId = `matrix-mobile-panel-${col.slug}`;

              return (
                <div key={col.slug} className="p-4">
                  <h4>
                    <button
                      id={triggerId}
                      type="button"
                      data-testid={`matrix-mobile-trigger-${col.slug}`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenMobileMatrixSlug(isOpen ? null : col.slug)
                      }
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="font-sans text-lg font-medium text-ink">
                        {col.name}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink">
                        <Icon name={isOpen ? 'remove' : 'add'} size={20} />
                      </span>
                    </button>
                  </h4>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <dl className="mt-4 divide-y divide-line border-t border-line pt-2">
                        {PACKAGE_MATRIX_ROWS.map((row) => {
                          const val = row.values[col.slug];
                          return (
                            <div
                              key={row.id}
                              className="flex items-center justify-between gap-4 py-2.5"
                            >
                              <dt className="font-sans text-sm text-ink">{row.feature}</dt>
                              <dd className="font-mono text-xs text-ink">
                                {typeof val === 'string' ? (
                                  <span>{val}</span>
                                ) : val ? (
                                  <span className="inline-flex items-center text-line-accent">
                                    <Icon name="check" size={20} />
                                    <span className="sr-only">
                                      {packagesSection.matrix.includedSrLabel}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-ink-muted">
                                    <span aria-hidden="true">
                                      {packagesSection.matrix.notIncludedSymbol}
                                    </span>
                                    <span className="sr-only">
                                      {packagesSection.matrix.notIncludedSrLabel}
                                    </span>
                                  </span>
                                )}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* c) Add-ons & d) Terms in Plain Language */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Add-ons */}
          <div className="space-y-6 rounded-card border border-line bg-bg p-6 md:p-8 lg:col-span-5">
            <div className="space-y-2">
              <Label>{packagesSection.addOns.label}</Label>
              <h3 className="text-heading-m text-ink">{packagesSection.addOns.headline}</h3>
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {PACKAGE_ADD_ONS.map((addon) => (
                <li key={addon.id} className="space-y-1 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-sans text-base font-medium text-ink">
                      {addon.title}
                    </span>
                    <span className="text-label-mono text-line-accent">
                      {addon.priceNote}
                    </span>
                  </div>
                  <p className="text-body text-ink-muted">{addon.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms in plain language */}
          <div className="flex flex-col justify-between gap-8 rounded-card border border-line bg-bg p-6 md:p-8 lg:col-span-7">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{packagesSection.terms.label}</Label>
                <h3 className="text-heading-m text-ink">{packagesSection.terms.headline}</h3>
              </div>

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {PACKAGE_TERMS.map((term) => (
                  <div key={term.id} className="space-y-1.5 border-t border-line pt-4">
                    <dt className="font-sans text-base font-medium text-ink">{term.title}</dt>
                    <dd className="text-body text-ink-muted">{term.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-label-mono text-ink-muted">{packagesSection.reassurance}</p>
              <TransitionLink
                href={packagesSection.terms.termsLinkHref}
                className="link-underline text-btn text-ink"
              >
                <span>{packagesSection.terms.termsLinkLabel}</span>
                <Icon name="arrow_outward" size={20} />
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* e) Find your fit (shared two-question PackageMatcher) */}
        <PackageMatcher
          source="services-matcher"
          idPrefix="services-matcher"
        />
      </Container>
    </section>
  );
}
