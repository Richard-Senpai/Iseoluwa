'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Icon } from '@/components/ui/Icon';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { BudgetPicker } from '@/features/contact/components/BudgetPicker';
import {
  CONTACT_CONTENT,
  getBudgetRangeById,
} from '@/features/contact/contact.content';
import { getPackageBySlug, type CurrencyCode } from '@/content/packages';
import { SITE_CONTENT } from '@/content/site';
import {
  BUDGET_RANGE_VALUES,
  contactRequestSchema,
  contactStep1Schema,
  contactStep2Schema,
  contactStep3BaseSchema,
  createInitialContactFormValues,
  evaluateBudgetFit,
  getMinProjectDescriptionLength,
  getPackageDefaults,
} from '@/lib/schemas/contact';
import type {
  BrandingScopeItem,
  BudgetRangeId,
  ContactFormValues,
  ContactPackageInterest,
  MarketingChannelItem,
  ProjectServiceNeed,
  WebsiteFeatureItem,
} from '@/types/contact';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export const DRAFT_STORAGE_KEY = 'iseoluwa_contact_draft_v1';
const UTM_STORAGE_KEY = 'iseoluwa_utm_params_v1';
export const THANK_YOU_FLAG_KEY = 'iseoluwa_contact_submitted';

export interface ProjectRequestFormProps {
  initialPackageSlug?: string | null;
  initialSource?: string | null;
}

export function ProjectRequestForm({
  initialPackageSlug,
  initialSource,
}: ProjectRequestFormProps) {
  const router = useRouter();
  const formId = useId();
  const stepContainerRef = useRef<HTMLDivElement | null>(null);
  const packageChipsRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedStartRef = useRef(false);
  const hasManuallySwitchedCurrencyRef = useRef(false);

  const storeCurrency = useUIStore((s) => s.currency);
  const setStoreCurrency = useUIStore((s) => s.setCurrency);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepAnnouncement, setStepAnnouncement] = useState<string>('');
  const [countries, setCountries] = useState<readonly string[]>([
    'Nigeria',
    'United Kingdom',
    'United States',
    'Canada',
  ]);
  const [countryFilter, setCountryFilter] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    defaultValues: createInitialContactFormValues({
      packageSlug: initialPackageSlug,
      currency: storeCurrency,
      source: initialSource,
    }),
    mode: 'onSubmit',
  });

  const values = form.watch();

  // Lazy-load full country list on client mount
  useEffect(() => {
    let active = true;
    void import('@/features/contact/countries').then((mod) => {
      if (active) {
        setCountries(mod.COUNTRIES_LIST);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Capture UTM params, referrer, pageUrl, and restore sessionStorage draft on mount
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const utmKeys = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
      ] as const;

      const storedUtmRaw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      const storedUtm: Record<string, string> = storedUtmRaw
        ? (JSON.parse(storedUtmRaw) as Record<string, string>)
        : {};

      utmKeys.forEach((key) => {
        const val = url.searchParams.get(key);
        if (val) {
          storedUtm[key] = val;
        }
      });
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(storedUtm));

      // Restore saved draft if present
      const draftRaw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftRaw) {
        const parsed = JSON.parse(draftRaw) as Partial<ContactFormValues>;
        const merged: ContactFormValues = {
          ...createInitialContactFormValues({
            packageSlug: initialPackageSlug,
            currency: storeCurrency,
            source: initialSource,
          }),
          ...parsed,
          startedAtMs: Date.now() - 4000,
        };

        // If URL explicitly passed ?package=, override the draft's package & defaults
        if (initialPackageSlug) {
          const pkgDefaults = getPackageDefaults(initialPackageSlug);
          merged.packageInterest = pkgDefaults.packageInterest;
          if (pkgDefaults.servicesNeeded.length > 0) {
            merged.servicesNeeded = pkgDefaults.servicesNeeded;
          }
          if (pkgDefaults.budgetRange) {
            merged.budgetRange = pkgDefaults.budgetRange;
            merged.budgetAdvise = false;
          }
        }

        merged.meta = {
          ...merged.meta,
          packageSlug: initialPackageSlug ?? merged.meta?.packageSlug,
          source: initialSource ?? url.searchParams.get('source') ?? merged.meta?.source,
          utm_source: storedUtm.utm_source,
          utm_medium: storedUtm.utm_medium,
          utm_campaign: storedUtm.utm_campaign,
          utm_term: storedUtm.utm_term,
          utm_content: storedUtm.utm_content,
          referrer: document.referrer || undefined,
          pageUrl: window.location.pathname + window.location.search,
        };

        form.reset(merged);
      } else {
        form.setValue('startedAtMs', Date.now() - 4000);
        form.setValue('meta', {
          packageSlug: initialPackageSlug ?? undefined,
          source: initialSource ?? url.searchParams.get('source') ?? undefined,
          utm_source: storedUtm.utm_source,
          utm_medium: storedUtm.utm_medium,
          utm_campaign: storedUtm.utm_campaign,
          utm_term: storedUtm.utm_term,
          utm_content: storedUtm.utm_content,
          referrer: document.referrer || undefined,
          pageUrl: window.location.pathname + window.location.search,
        });
      }
    } catch {
      // Ignore sessionStorage errors in private browsing
    }

    if (initialPackageSlug) {
      track('contact_package_prefilled', { package: initialPackageSlug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPackageSlug, initialSource]);

  // Sync store currency into form
  useEffect(() => {
    if (values.currency !== storeCurrency) {
      form.setValue('currency', storeCurrency);
    }
  }, [storeCurrency, form, values.currency]);

  // Autosave draft to sessionStorage whenever form values change
  useEffect(() => {
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Ignore storage quota / private mode errors
    }
  }, [values]);

  const markFormStarted = () => {
    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      track('contact_form_started', {
        package: values.packageInterest,
      });
    }
  };

  const handleCurrencySwitch = (nextCurrency: CurrencyCode) => {
    hasManuallySwitchedCurrencyRef.current = true;
    setStoreCurrency(nextCurrency);
    form.setValue('currency', nextCurrency);
    track('currency_switch', { currency: nextCurrency, location: 'contact_form' });
  };

  const handleCountrySelect = (selectedCountry: string) => {
    markFormStarted();
    form.setValue('country', selectedCountry);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.country;
      return next;
    });

    // Default currency to NGN for Nigeria unless visitor already switched currency
    if (!hasManuallySwitchedCurrencyRef.current) {
      const autoCurrency: CurrencyCode = selectedCountry === 'Nigeria' ? 'NGN' : 'USD';
      setStoreCurrency(autoCurrency);
      form.setValue('currency', autoCurrency);
    }
  };

  const handlePackageInterestChange = (nextPkg: ContactPackageInterest) => {
    markFormStarted();
    form.setValue('packageInterest', nextPkg);
    const defaults = getPackageDefaults(nextPkg);
    if (defaults.servicesNeeded.length > 0) {
      form.setValue('servicesNeeded', defaults.servicesNeeded);
    }
    if (defaults.budgetRange) {
      form.setValue('budgetRange', defaults.budgetRange);
      form.setValue('budgetAdvise', false);
    } else if (nextPkg === 'custom' || nextPkg === 'not-sure') {
      form.setValue('budgetRange', '');
      form.setValue('budgetAdvise', false);
    }
  };

  const handleServicesNeededChange = (nextServices: ProjectServiceNeed[]) => {
    markFormStarted();
    // If "not-sure" was just added, keep it or allow combination
    form.setValue('servicesNeeded', nextServices);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.servicesNeeded;
      return next;
    });
  };

  const focusFirstInvalidField = (errorsMap: Record<string, string>) => {
    const firstKey = Object.keys(errorsMap)[0];
    if (!firstKey || !stepContainerRef.current) return;
    requestAnimationFrame(() => {
      const target =
        stepContainerRef.current?.querySelector<HTMLElement>(
          `[name="${firstKey}"], [data-field="${firstKey}"] input, [data-field="${firstKey}"] textarea, [data-field="${firstKey}"] select, [data-field="${firstKey}"] button`,
        ) ?? null;
      target?.focus();
    });
  };

  const validateCurrentStep = (stepToValidate: 1 | 2 | 3 | 4): boolean => {
    const currentValues = form.getValues();
    const nextErrors: Record<string, string> = {};

    if (stepToValidate === 1) {
      const res = contactStep1Schema.safeParse(currentValues);
      if (!res.success) {
        for (const issue of res.error.issues) {
          const key = String(issue.path[0] ?? 'step1');
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
      }
    } else if (stepToValidate === 2) {
      const res = contactStep2Schema.safeParse(currentValues);
      if (!res.success) {
        for (const issue of res.error.issues) {
          const key = String(issue.path[0] ?? 'step2');
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
      }
    } else if (stepToValidate === 3) {
      const res = contactStep3BaseSchema.safeParse(currentValues);
      if (!res.success) {
        for (const issue of res.error.issues) {
          const key = String(issue.path[0] ?? 'step3');
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
      }
      const hasRange = BUDGET_RANGE_VALUES.includes(
        currentValues.budgetRange as BudgetRangeId,
      );
      const hasAdvise =
        currentValues.budgetAdvise || currentValues.budgetRange === 'advise';
      if (!hasRange && !hasAdvise) {
        nextErrors.budgetRange =
          'Please select a budget range or choose "Not sure yet. Please advise me."';
      }
    } else if (stepToValidate === 4) {
      const res = contactRequestSchema.safeParse(currentValues);
      if (!res.success) {
        for (const issue of res.error.issues) {
          const key = String(issue.path[0] ?? 'step4');
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
      }
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalidField(nextErrors);
      return false;
    }
    return true;
  };

  const goToStep = (targetStep: 1 | 2 | 3 | 4) => {
    setFieldErrors({});
    setSubmitError(null);
    setCurrentStep(targetStep);
    const stepMeta = CONTACT_CONTENT.form.steps[targetStep - 1];
    if (stepMeta) {
      setStepAnnouncement(`Step ${targetStep} of 4: ${stepMeta.title}`);
    }
  };

  const handleNextStep = () => {
    markFormStarted();
    if (!validateCurrentStep(currentStep)) return;
    track('contact_step_completed', { step: currentStep });
    if (currentStep < 4) {
      goToStep((currentStep + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSingleLineKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentStep < 4) {
        handleNextStep();
      }
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (currentStep < 4) {
      handleNextStep();
      return;
    }

    if (!validateCurrentStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const payload = form.getValues();

    track('contact_submit_attempted', {
      package: payload.packageInterest,
      currency: payload.currency,
      budget: payload.budgetAdvise ? 'advise' : payload.budgetRange,
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Could not send request. Please try again.');
      }

      track('contact_submit_succeeded', {
        package: payload.packageInterest,
        currency: payload.currency,
        budget: payload.budgetAdvise ? 'advise' : payload.budgetRange,
      });

      try {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        window.sessionStorage.setItem(THANK_YOU_FLAG_KEY, '1');
      } catch {
        // Ignore storage errors
      }

      router.push('/contact/thank-you');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'We could not send your request right now. Please try again.';
      setSubmitError(msg);
      track('contact_submit_failed', { reason: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { form: formCopy } = CONTACT_CONTENT;
  const activeStepMeta = formCopy.steps[currentStep - 1]!;
  const progressPercent = (currentStep / formCopy.steps.length) * 100;

  const selectedPackageObj =
    values.packageInterest !== 'not-sure'
      ? getPackageBySlug(values.packageInterest)
      : undefined;

  const minDescLength = getMinProjectDescriptionLength(values.packageInterest);
  const currentDescLength = (values.projectDescription ?? '').trim().length;

  const budgetFit = evaluateBudgetFit({
    budgetRange: values.budgetRange,
    budgetAdvise: values.budgetAdvise,
    servicesNeeded: values.servicesNeeded,
    packageInterest: values.packageInterest,
  });

  const filteredCountries = countryFilter.trim()
    ? countries.filter((c) => c.toLowerCase().includes(countryFilter.trim().toLowerCase()))
    : countries;

  return (
    <div className="rounded-card border border-line bg-surface p-6 md:p-10 lg:p-12">
      {/* Screen-reader live region announcing step transitions */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {stepAnnouncement}
      </div>

      {/* Top Progress Header: STEP 01 / 04 + Step Pills + Slim Accent Progress Bar */}
      <div className="space-y-4 border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span
            data-testid="contact-step-indicator"
            className="text-label-mono font-medium text-ink"
          >
            {`${formCopy.stepCounterPrefix} ${activeStepMeta.number} / 04`}
          </span>

          <ol
            aria-label="Form steps"
            className="flex flex-wrap items-center gap-2 text-xs font-mono"
          >
            {formCopy.steps.map((s, idx) => {
              const stepNum = (idx + 1) as 1 | 2 | 3 | 4;
              const isCurrent = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              return (
                <li key={s.number} className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!isCompleted}
                    onClick={() => isCompleted && goToStep(stepNum)}
                    className={cn(
                      'transition-colors',
                      isCurrent
                        ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-4'
                        : isCompleted
                          ? 'cursor-pointer text-ink-muted hover:text-ink'
                          : 'cursor-default text-ink-muted/50',
                    )}
                  >
                    {s.title}
                  </button>
                  {idx < formCopy.steps.length - 1 && (
                    <span aria-hidden="true" className="text-ink-muted/40">
                      ·
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Slim progress bar in accent colour */}
        <div className="h-1 w-full overflow-hidden rounded-pill bg-line">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </div>
      </div>

      {/* Form Body */}
      <form
        id={`contact-request-form-${formId}`}
        noValidate
        onSubmit={handleFormSubmit}
        className="mt-8 space-y-10"
      >
        <div ref={stepContainerRef} className="space-y-8">
          {/* ============================================================== */}
          {/* STEP 1: ABOUT YOU                                              */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div data-testid="contact-step-1" className="space-y-8">
              <h2 className="text-display-m text-ink">{formCopy.step1.heading}</h2>

              {/* Full Name */}
              <div data-field="fullName" className="space-y-2">
                <label
                  htmlFor={`${formId}-fullName`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  <span>{formCopy.step1.fields.fullName.label}</span>
                  <span aria-hidden="true" className="ml-1 text-accent">
                    *
                  </span>
                </label>
                <input
                  id={`${formId}-fullName`}
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={
                    fieldErrors.fullName ? `${formId}-fullName-error` : undefined
                  }
                  value={values.fullName}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => {
                    markFormStarted();
                    form.setValue('fullName', e.target.value);
                  }}
                  className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-lg text-ink transition-colors focus:border-line-accent focus:outline-none"
                />
                {fieldErrors.fullName && (
                  <p
                    id={`${formId}-fullName-error`}
                    role="alert"
                    aria-live="polite"
                    className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                  >
                    <Icon name="error" size={20} className="shrink-0 text-accent" />
                    <span>{fieldErrors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div data-field="email" className="space-y-2">
                <label
                  htmlFor={`${formId}-email`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  <span>{formCopy.step1.fields.email.label}</span>
                  <span aria-hidden="true" className="ml-1 text-accent">
                    *
                  </span>
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
                  value={values.email}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => {
                    markFormStarted();
                    form.setValue('email', e.target.value);
                  }}
                  className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-lg text-ink transition-colors focus:border-line-accent focus:outline-none"
                />
                {fieldErrors.email && (
                  <p
                    id={`${formId}-email-error`}
                    role="alert"
                    aria-live="polite"
                    className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                  >
                    <Icon name="error" size={20} className="shrink-0 text-accent" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Company or brand name */}
              <div data-field="company" className="space-y-2">
                <label
                  htmlFor={`${formId}-company`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  <span>{formCopy.step1.fields.company.label}</span>
                  <span aria-hidden="true" className="ml-1 text-accent">
                    *
                  </span>
                </label>
                <p id={`${formId}-company-helper`} className="text-body text-ink-muted">
                  {formCopy.step1.fields.company.helper}
                </p>
                <input
                  id={`${formId}-company`}
                  type="text"
                  autoComplete="organization"
                  required
                  aria-invalid={Boolean(fieldErrors.company)}
                  aria-describedby={
                    fieldErrors.company
                      ? `${formId}-company-helper ${formId}-company-error`
                      : `${formId}-company-helper`
                  }
                  value={values.company}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => {
                    markFormStarted();
                    form.setValue('company', e.target.value);
                  }}
                  className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-lg text-ink transition-colors focus:border-line-accent focus:outline-none"
                />
                {fieldErrors.company && (
                  <p
                    id={`${formId}-company-error`}
                    role="alert"
                    aria-live="polite"
                    className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                  >
                    <Icon name="error" size={20} className="shrink-0 text-accent" />
                    <span>{fieldErrors.company}</span>
                  </p>
                )}
              </div>

              {/* Your role (optional) & Country (select with search) */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div data-field="role" className="space-y-2">
                  <label
                    htmlFor={`${formId}-role`}
                    className="block font-sans text-base font-medium text-ink"
                  >
                    {formCopy.step1.fields.role.label}
                  </label>
                  <input
                    id={`${formId}-role`}
                    type="text"
                    autoComplete="organization-title"
                    value={values.role}
                    onKeyDown={handleSingleLineKeyDown}
                    onChange={(e) => {
                      markFormStarted();
                      form.setValue('role', e.target.value);
                    }}
                    className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-lg text-ink transition-colors focus:border-line-accent focus:outline-none"
                  />
                </div>

                {/* Searchable Country Select */}
                <div data-field="country" className="space-y-2">
                  <label
                    htmlFor={`${formId}-country`}
                    className="block font-sans text-base font-medium text-ink"
                  >
                    <span>{formCopy.step1.fields.country.label}</span>
                    <span aria-hidden="true" className="ml-1 text-accent">
                      *
                    </span>
                  </label>
                  <input
                    type="search"
                    aria-label={formCopy.step1.fields.country.searchPlaceholder}
                    placeholder={formCopy.step1.fields.country.searchPlaceholder}
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="min-h-[38px] w-full rounded-card border border-line bg-bg px-3 py-1.5 font-mono text-xs text-ink focus:border-line-accent focus:outline-none"
                  />
                  <select
                    id={`${formId}-country`}
                    name="country"
                    autoComplete="country-name"
                    required
                    aria-invalid={Boolean(fieldErrors.country)}
                    aria-describedby={
                      fieldErrors.country ? `${formId}-country-error` : undefined
                    }
                    value={values.country}
                    onChange={(e) => handleCountrySelect(e.target.value)}
                    className="min-h-[48px] w-full border-0 border-b border-line bg-bg px-2 py-3 font-sans text-base text-ink transition-colors focus:border-line-accent focus:outline-none"
                  >
                    <option value="">{formCopy.step1.fields.country.selectPrompt}</option>
                    {filteredCountries.map((countryName) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.country && (
                    <p
                      id={`${formId}-country-error`}
                      role="alert"
                      aria-live="polite"
                      className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                    >
                      <Icon name="error" size={20} className="shrink-0 text-accent" />
                      <span>{fieldErrors.country}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Phone or WhatsApp (optional) */}
              <div data-field="phone" className="space-y-2">
                <label
                  htmlFor={`${formId}-phone`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  {formCopy.step1.fields.phone.label}
                </label>
                <p id={`${formId}-phone-helper`} className="text-body text-ink-muted">
                  {formCopy.step1.fields.phone.helper}
                </p>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby={`${formId}-phone-helper`}
                  value={values.phone}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => {
                    markFormStarted();
                    form.setValue('phone', e.target.value);
                  }}
                  className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-lg text-ink transition-colors focus:border-line-accent focus:outline-none"
                />
              </div>

              {/* Best way to reach you */}
              <div data-field="preferredContact">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step1.fields.preferredContact.label}
                  required
                  options={formCopy.step1.fields.preferredContact.options}
                  value={values.preferredContact}
                  onChange={(val) => {
                    markFormStarted();
                    form.setValue('preferredContact', val);
                  }}
                  error={fieldErrors.preferredContact}
                  testIdPrefix="preferred-contact"
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: YOUR PROJECT                                           */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div data-testid="contact-step-2" className="space-y-8">
              <h2 className="text-display-m text-ink">{formCopy.step2.heading}</h2>

              {/* Preselected Package Summary Card */}
              {selectedPackageObj && (
                <div
                  data-testid="selected-package-summary-card"
                  className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line-accent bg-bg p-5"
                >
                  <div className="space-y-1">
                    <span className="text-label-mono text-accent">
                      {formCopy.step2.selectedPackageSummary.badge}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="font-sans text-xl font-medium text-ink">
                        {selectedPackageObj.name}
                      </h3>
                      <span className="font-mono text-sm text-ink-muted">
                        {selectedPackageObj.prices[values.currency]}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">
                        · {formCopy.step2.selectedPackageSummary.timelinePrefix}{' '}
                        {selectedPackageObj.timeline}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const firstRadio =
                        packageChipsRef.current?.querySelector<HTMLElement>('input');
                      firstRadio?.focus();
                    }}
                    className="text-label-mono link-underline text-ink"
                  >
                    {formCopy.step2.selectedPackageSummary.changeLabel}
                  </button>
                </div>
              )}

              {/* 1. Which package interests you? */}
              <div ref={packageChipsRef} data-field="packageInterest">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step2.packageInterest.label}
                  required
                  options={formCopy.step2.packageInterest.options}
                  value={values.packageInterest}
                  onChange={handlePackageInterestChange}
                  error={fieldErrors.packageInterest}
                  testIdPrefix="package-interest"
                />
              </div>

              {/* 2. What do you need? (Multi-select) */}
              <div data-field="servicesNeeded">
                <ChipGroup<ProjectServiceNeed>
                  mode="multiple"
                  legend={formCopy.step2.servicesNeeded.label}
                  helperText={formCopy.step2.servicesNeeded.helper}
                  required
                  options={formCopy.step2.servicesNeeded.options}
                  value={values.servicesNeeded}
                  onChange={handleServicesNeededChange}
                  error={fieldErrors.servicesNeeded}
                  testIdPrefix="service-need"
                />
              </div>

              {/* 3. Tell us about your project (Textarea + character counter) */}
              <div data-field="projectDescription" className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label
                    htmlFor={`${formId}-projectDescription`}
                    className="block font-sans text-base font-medium text-ink"
                  >
                    <span>{formCopy.step2.projectDescription.label}</span>
                    <span aria-hidden="true" className="ml-1 text-accent">
                      *
                    </span>
                  </label>
                  <span
                    data-testid="project-description-counter"
                    className={cn(
                      'font-mono text-xs',
                      currentDescLength >= minDescLength ? 'text-accent' : 'text-ink-muted',
                    )}
                  >
                    {`${currentDescLength} / ${minDescLength} ${formCopy.step2.projectDescription.charactersSuffix}`}
                  </span>
                </div>
                <p id={`${formId}-projectDescription-helper`} className="text-body text-ink-muted">
                  {formCopy.step2.projectDescription.helper}
                </p>
                <textarea
                  id={`${formId}-projectDescription`}
                  name="projectDescription"
                  rows={4}
                  required
                  aria-invalid={Boolean(fieldErrors.projectDescription)}
                  aria-describedby={
                    fieldErrors.projectDescription
                      ? `${formId}-projectDescription-helper ${formId}-projectDescription-error`
                      : `${formId}-projectDescription-helper`
                  }
                  value={values.projectDescription}
                  onChange={(e) => {
                    markFormStarted();
                    form.setValue('projectDescription', e.target.value);
                  }}
                  className="w-full rounded-card border border-line bg-bg p-4 font-sans text-base text-ink transition-colors focus:border-line-accent focus:outline-none"
                />
                {fieldErrors.projectDescription && (
                  <p
                    id={`${formId}-projectDescription-error`}
                    role="alert"
                    aria-live="polite"
                    className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                  >
                    <Icon name="error" size={20} className="shrink-0 text-accent" />
                    <span>{fieldErrors.projectDescription}</span>
                  </p>
                )}
              </div>

              {/* 4. What is the main goal? */}
              <div data-field="mainGoal">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step2.mainGoal.label}
                  required
                  options={formCopy.step2.mainGoal.options}
                  value={values.mainGoal}
                  onChange={(val) => form.setValue('mainGoal', val)}
                  error={fieldErrors.mainGoal}
                  testIdPrefix="main-goal"
                />
              </div>

              {/* Conditional Questions: Branding */}
              {values.servicesNeeded.includes('branding') && (
                <div
                  data-testid="conditional-branding"
                  className="space-y-6 rounded-card border border-line bg-bg p-6"
                >
                  <p className="text-label-mono text-accent">
                    {formCopy.step2.conditionalBranding.sectionLabel}
                  </p>
                  <ChipGroup<BrandingScopeItem>
                    mode="multiple"
                    legend={formCopy.step2.conditionalBranding.needsLabel}
                    options={formCopy.step2.conditionalBranding.needsOptions}
                    value={values.brandingNeeds}
                    onChange={(val) => form.setValue('brandingNeeds', val)}
                  />
                  <ChipGroup
                    mode="single"
                    legend={formCopy.step2.conditionalBranding.startingPointLabel}
                    options={formCopy.step2.conditionalBranding.startingPointOptions}
                    value={values.brandingStartingPoint}
                    onChange={(val) => form.setValue('brandingStartingPoint', val)}
                  />
                </div>
              )}

              {/* Conditional Questions: Website or web app */}
              {values.servicesNeeded.includes('website') && (
                <div
                  data-testid="conditional-website"
                  className="space-y-6 rounded-card border border-line bg-bg p-6"
                >
                  <p className="text-label-mono text-accent">
                    {formCopy.step2.conditionalWebsite.sectionLabel}
                  </p>
                  <ChipGroup
                    mode="single"
                    legend={formCopy.step2.conditionalWebsite.kindLabel}
                    options={formCopy.step2.conditionalWebsite.kindOptions}
                    value={values.websiteKind}
                    onChange={(val) => form.setValue('websiteKind', val)}
                  />
                  <ChipGroup<WebsiteFeatureItem>
                    mode="multiple"
                    legend={formCopy.step2.conditionalWebsite.featuresLabel}
                    options={formCopy.step2.conditionalWebsite.featuresOptions}
                    value={values.websiteFeatures}
                    onChange={(val) => form.setValue('websiteFeatures', val)}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-existingSiteUrl`}
                      className="block font-sans text-base font-medium text-ink"
                    >
                      {formCopy.step2.conditionalWebsite.existingUrlLabel}
                    </label>
                    <input
                      id={`${formId}-existingSiteUrl`}
                      type="url"
                      inputMode="url"
                      value={values.existingSiteUrl}
                      onKeyDown={handleSingleLineKeyDown}
                      onChange={(e) => form.setValue('existingSiteUrl', e.target.value)}
                      className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-base text-ink focus:border-line-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Questions: Marketing */}
              {values.servicesNeeded.includes('marketing') && (
                <div
                  data-testid="conditional-marketing"
                  className="space-y-6 rounded-card border border-line bg-bg p-6"
                >
                  <p className="text-label-mono text-accent">
                    {formCopy.step2.conditionalMarketing.sectionLabel}
                  </p>
                  <ChipGroup<MarketingChannelItem>
                    mode="multiple"
                    legend={formCopy.step2.conditionalMarketing.channelsLabel}
                    options={formCopy.step2.conditionalMarketing.channelsOptions}
                    value={values.marketingChannels}
                    onChange={(val) => form.setValue('marketingChannels', val)}
                  />
                  <ChipGroup
                    mode="single"
                    legend={formCopy.step2.conditionalMarketing.aimLabel}
                    options={formCopy.step2.conditionalMarketing.aimOptions}
                    value={values.marketingAim}
                    onChange={(val) => form.setValue('marketingAim', val)}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-existingMarketingLinks`}
                      className="block font-sans text-base font-medium text-ink"
                    >
                      {formCopy.step2.conditionalMarketing.existingAccountsLabel}
                    </label>
                    <input
                      id={`${formId}-existingMarketingLinks`}
                      type="text"
                      value={values.existingMarketingLinks}
                      onKeyDown={handleSingleLineKeyDown}
                      onChange={(e) =>
                        form.setValue('existingMarketingLinks', e.target.value)
                      }
                      className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-base text-ink focus:border-line-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 5. Do you have existing materials or inspiration? */}
              <div data-field="existingMaterialsLinks" className="space-y-2">
                <label
                  htmlFor={`${formId}-existingMaterialsLinks`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  {formCopy.step2.existingMaterialsLinks.label}
                </label>
                <p
                  id={`${formId}-existingMaterialsLinks-helper`}
                  className="text-body text-ink-muted"
                >
                  {formCopy.step2.existingMaterialsLinks.helper}
                </p>
                <input
                  id={`${formId}-existingMaterialsLinks`}
                  type="text"
                  aria-describedby={`${formId}-existingMaterialsLinks-helper`}
                  value={values.existingMaterialsLinks}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => form.setValue('existingMaterialsLinks', e.target.value)}
                  className="min-h-[48px] w-full border-0 border-b border-line bg-transparent px-0 py-3 font-sans text-base text-ink focus:border-line-accent focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: BUDGET AND TIMING                                      */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div data-testid="contact-step-3" className="space-y-8">
              <h2 className="text-display-m text-ink">{formCopy.step3.heading}</h2>

              <div data-field="budgetRange">
                <BudgetPicker
                  currency={values.currency}
                  onCurrencyChange={handleCurrencySwitch}
                  budgetRange={values.budgetRange}
                  onBudgetRangeChange={(nextRange) => {
                    form.setValue('budgetRange', nextRange);
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.budgetRange;
                      return next;
                    });
                  }}
                  budgetAdvise={values.budgetAdvise}
                  onBudgetAdviseChange={(advise) => {
                    form.setValue('budgetAdvise', advise);
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.budgetRange;
                      return next;
                    });
                  }}
                  showGentleFitNote={budgetFit.showGentleNote}
                  error={fieldErrors.budgetRange}
                />
              </div>

              {/* When would you like to start? */}
              <div data-field="startTimeline">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step3.startTimeline.label}
                  required
                  options={formCopy.step3.startTimeline.options}
                  value={values.startTimeline}
                  onChange={(val) => form.setValue('startTimeline', val)}
                  error={fieldErrors.startTimeline}
                  testIdPrefix="start-timeline"
                />
              </div>

              {/* Optional deadline or event date */}
              <div data-field="deadlineDate" className="space-y-2">
                <label
                  htmlFor={`${formId}-deadlineDate`}
                  className="block font-sans text-base font-medium text-ink"
                >
                  {formCopy.step3.deadlineDate.label}
                </label>
                <p id={`${formId}-deadlineDate-helper`} className="text-body text-ink-muted">
                  {formCopy.step3.deadlineDate.helper}
                </p>
                <input
                  id={`${formId}-deadlineDate`}
                  type="date"
                  aria-describedby={`${formId}-deadlineDate-helper`}
                  value={values.deadlineDate}
                  onKeyDown={handleSingleLineKeyDown}
                  onChange={(e) => form.setValue('deadlineDate', e.target.value)}
                  className="min-h-[48px] w-full max-w-xs border-0 border-b border-line bg-transparent px-0 py-3 font-mono text-sm text-ink focus:border-line-accent focus:outline-none"
                />
              </div>

              {/* Who makes the final decision? (optional) */}
              <div data-field="decisionMaker">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step3.decisionMaker.label}
                  options={formCopy.step3.decisionMaker.options}
                  value={values.decisionMaker}
                  onChange={(val) => form.setValue('decisionMaker', val)}
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: REVIEW AND SEND                                        */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div data-testid="contact-step-4" className="space-y-8">
              <h2 className="text-display-m text-ink">{formCopy.step4.heading}</h2>

              {/* Grouped Summary with Edit Links */}
              <div className="divide-y divide-line rounded-card border border-line bg-bg">
                {/* Summary Group 1: About you */}
                <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-start">
                  <div className="space-y-2">
                    <p className="text-label-mono text-ink-muted">
                      {formCopy.step4.groups.step1}
                    </p>
                    <p className="font-sans text-lg font-medium text-ink">
                      {values.fullName} · {values.company}
                    </p>
                    <p className="font-mono text-xs text-ink-muted">
                      {values.email} · {values.country}
                      {values.phone ? ` · ${values.phone}` : ''} · Reach via{' '}
                      {values.preferredContact}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid="review-edit-step-1"
                    onClick={() => goToStep(1)}
                    className="text-label-mono link-underline self-start text-ink"
                  >
                    {formCopy.step4.editStepLabel}
                  </button>
                </div>

                {/* Summary Group 2: Your project */}
                <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-start">
                  <div className="space-y-2">
                    <p className="text-label-mono text-ink-muted">
                      {formCopy.step4.groups.step2}
                    </p>
                    <p className="font-sans text-lg font-medium text-ink">
                      {selectedPackageObj?.name ?? 'Not sure yet'} ·{' '}
                      {values.servicesNeeded.join(', ')}
                    </p>
                    <p className="text-body max-w-[56ch] text-ink-muted">
                      {values.projectDescription}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid="review-edit-step-2"
                    onClick={() => goToStep(2)}
                    className="text-label-mono link-underline self-start text-ink"
                  >
                    {formCopy.step4.editStepLabel}
                  </button>
                </div>

                {/* Summary Group 3: Budget and timing */}
                <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-start">
                  <div className="space-y-2">
                    <p className="text-label-mono text-ink-muted">
                      {formCopy.step4.groups.step3}
                    </p>
                    <p className="font-sans text-lg font-medium text-ink">
                      {values.budgetAdvise || values.budgetRange === 'advise'
                        ? formCopy.step3.budgetPicker.adviseDisplay
                        : (getBudgetRangeById(values.budgetRange)?.labels[values.currency] ??
                          values.budgetRange)}{' '}
                      ({values.currency})
                    </p>
                    <p className="font-mono text-xs text-ink-muted">
                      Start: {values.startTimeline}
                      {values.deadlineDate ? ` · Deadline: ${values.deadlineDate}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid="review-edit-step-3"
                    onClick={() => goToStep(3)}
                    className="text-label-mono link-underline self-start text-ink"
                  >
                    {formCopy.step4.editStepLabel}
                  </button>
                </div>
              </div>

              {/* How did you hear about us? (optional) */}
              <div data-field="heardAboutUs">
                <ChipGroup
                  mode="single"
                  legend={formCopy.step4.heardAboutUs.label}
                  options={formCopy.step4.heardAboutUs.options}
                  value={values.heardAboutUs}
                  onChange={(val) => form.setValue('heardAboutUs', val)}
                />
              </div>

              {/* Required Consent Checkbox */}
              <div data-field="consentAccepted" className="space-y-2 border-t border-line pt-6">
                <label
                  htmlFor={`${formId}-consent`}
                  className="inline-flex min-h-[48px] cursor-pointer items-start gap-3 select-none"
                >
                  <input
                    id={`${formId}-consent`}
                    name="consentAccepted"
                    type="checkbox"
                    data-testid="contact-consent-checkbox"
                    checked={values.consentAccepted}
                    onChange={(e) => {
                      form.setValue('consentAccepted', e.target.checked);
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.consentAccepted;
                        return next;
                      });
                    }}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
                  />
                  <span className="text-body text-ink">
                    {formCopy.step4.consent.prefix}
                    <TransitionLink
                      href={formCopy.step4.consent.privacyHref}
                      className="link-underline font-medium text-ink"
                    >
                      {formCopy.step4.consent.privacyLinkLabel}
                    </TransitionLink>
                    {formCopy.step4.consent.suffix}
                  </span>
                </label>

                {fieldErrors.consentAccepted && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="inline-flex items-center gap-2 font-mono text-xs text-ink"
                  >
                    <Icon name="error" size={20} className="shrink-0 text-accent" />
                    <span>{fieldErrors.consentAccepted}</span>
                  </p>
                )}
              </div>

              {/* Hidden Honeypot Field */}
              <div aria-hidden="true" className="sr-only">
                <label htmlFor={`${formId}-website-hp`}>
                  {formCopy.step4.honeypotLabel}
                </label>
                <input
                  id={`${formId}-website-hp`}
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.honeypot}
                  onChange={(e) => form.setValue('honeypot', e.target.value)}
                />
              </div>

              {/* Submission Failure Banner (Keeps all user answers + offers email/WhatsApp fallbacks) */}
              {submitError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  data-testid="contact-submit-error-banner"
                  className="space-y-3 rounded-card border border-line-accent bg-bg p-6"
                >
                  <div className="flex items-center gap-2 font-sans text-lg font-medium text-ink">
                    <Icon name="error" size={20} className="text-accent" />
                    <span>{formCopy.step4.errorBanner.heading}</span>
                  </div>
                  <p className="text-body text-ink-muted">{submitError}</p>
                  <p className="text-body text-ink-muted">
                    {formCopy.step4.errorBanner.body}{' '}
                    <a
                      href={`mailto:${SITE_CONTENT.contact.email}`}
                      className="link-underline font-mono text-ink"
                    >
                      {SITE_CONTENT.contact.email}
                    </a>{' '}
                    or{' '}
                    <a
                      href={SITE_CONTENT.contact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-mono text-ink"
                    >
                      {formCopy.step4.errorBanner.whatsappLabel}
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Step Navigation Bar: Back & Next / Send my request */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              data-testid="contact-back-button"
              onClick={handlePrevStep}
              className="text-btn inline-flex min-h-[48px] items-center gap-2 rounded-pill border border-line bg-bg px-6 py-3 text-ink transition-colors hover:border-ink"
            >
              <Icon name="arrow_back" size={20} />
              <span>{formCopy.navigation.backLabel}</span>
            </button>
          ) : (
            <span />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              data-testid="contact-next-button"
              onClick={handleNextStep}
              className="text-btn inline-flex min-h-[48px] items-center gap-2 rounded-pill border border-ink bg-ink px-7 py-3.5 text-bg transition-transform duration-200 hover:scale-[1.02]"
            >
              <span>{formCopy.navigation.nextLabel}</span>
              <Icon name="arrow_forward" size={20} />
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-submit-button"
                className="text-btn inline-flex min-h-[48px] items-center gap-2.5 rounded-pill border border-ink bg-ink px-8 py-4 text-bg transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
              >
                <span>
                  {isSubmitting
                    ? formCopy.navigation.submittingLabel
                    : formCopy.navigation.submitLabel}
                </span>
                <Icon name="arrow_outward" size={20} />
              </button>
              <span className="text-label-mono text-ink-muted">
                {formCopy.navigation.submitReassurance}
              </span>
            </div>
          )}
        </div>
      </form>

      {/* No-JavaScript fallback */}
      <noscript>
        <div className="mt-8 rounded-card border border-line bg-bg p-6">
          <p className="text-body text-ink">
            JavaScript is disabled in your browser. You can reach us directly at{' '}
            <a href={`mailto:${SITE_CONTENT.contact.email}`} className="underline">
              {SITE_CONTENT.contact.email}
            </a>{' '}
            or on{' '}
            <a href={SITE_CONTENT.contact.whatsappHref} className="underline">
              WhatsApp
            </a>
            .
          </p>
        </div>
      </noscript>
    </div>
  );
}
