'use client';

import { useId } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BUDGET_RANGES, CONTACT_CONTENT } from '@/features/contact/contact.content';
import type { CurrencyCode } from '@/content/packages';
import type { BudgetRangeId, BudgetSelectionValue } from '@/types/contact';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface BudgetPickerProps {
  currency: CurrencyCode;
  onCurrencyChange: (nextCurrency: CurrencyCode) => void;
  budgetRange: BudgetSelectionValue;
  onBudgetRangeChange: (nextRange: BudgetSelectionValue) => void;
  budgetAdvise: boolean;
  onBudgetAdviseChange: (advise: boolean) => void;
  showGentleFitNote: boolean;
  error?: string;
}

/**
 * Step 3 Budget Picker (`BudgetPicker` — Contact Prompt Section A3):
 * - Small USD / NGN switch synced with the global store and `sessionStorage`.
 * - Huge Display L readout of the currently selected budget range above the slider.
 * - Accessible `input[type=range]` with `aria-valuetext` reading the full range aloud,
 *   styled with a thick tapered ribbon track in `--accent`, plus direct step buttons.
 * - Under reduced motion, uses plain styled step buttons.
 * - Separate checkbox: "Not sure yet. Please advise me." (disables slider and records `budget: "advise"`).
 * - Gentle, non-blocking fit guidance note when selected range is below typical starting minimum.
 */
export function BudgetPicker({
  currency,
  onCurrencyChange,
  budgetRange,
  onBudgetRangeChange,
  budgetAdvise,
  onBudgetAdviseChange,
  showGentleFitNote,
  error,
}: BudgetPickerProps) {
  const { budgetPicker } = CONTACT_CONTENT.form.step3;
  const { shouldSimplifyMotion } = useMotionPreference();
  const idPrefix = useId();
  const sliderId = `${idPrefix}-budget-slider`;
  const adviseId = `${idPrefix}-budget-advise`;
  const errorId = error ? `${idPrefix}-budget-error` : undefined;

  const activeRangeDef = BUDGET_RANGES.find((r) => r.id === budgetRange);
  const currentStepIndex = activeRangeDef?.stepIndex ?? 3;

  const displayReadout = budgetAdvise
    ? budgetPicker.adviseDisplay
    : activeRangeDef
      ? activeRangeDef.labels[currency]
      : budgetPicker.unselectedDisplay;

  const fillPercent = activeRangeDef
    ? ((activeRangeDef.stepIndex - 1) / (BUDGET_RANGES.length - 1)) * 100
    : 0;

  const handleRangeSelect = (rangeId: BudgetRangeId) => {
    if (budgetAdvise) {
      onBudgetAdviseChange(false);
    }
    onBudgetRangeChange(rangeId);
    const def = BUDGET_RANGES.find((r) => r.id === rangeId);
    track('contact_budget_selected', {
      range: rangeId,
      label: def?.labels[currency] ?? rangeId,
      currency,
    });
  };

  const handleSliderChange = (stepNumber: number) => {
    const found = BUDGET_RANGES.find((r) => r.stepIndex === stepNumber);
    if (found) {
      handleRangeSelect(found.id);
    }
  };

  const handleAdviseToggle = (checked: boolean) => {
    onBudgetAdviseChange(checked);
    if (checked) {
      onBudgetRangeChange('advise');
      track('contact_budget_selected', {
        range: 'advise',
        currency,
      });
    } else {
      onBudgetRangeChange('range-3');
    }
  };

  return (
    <div
      data-testid="budget-picker"
      aria-describedby={errorId}
      className="space-y-8 rounded-card border border-line bg-surface p-6 md:p-8"
    >
      {/* Top row: Label + USD / NGN Currency Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <label
          htmlFor={sliderId}
          className="font-sans text-base font-medium text-ink md:text-lg"
        >
          <span>{budgetPicker.label}</span>
          <span aria-hidden="true" className="ml-1 text-accent">
            *
          </span>
        </label>

        <div
          role="group"
          aria-label={budgetPicker.currencyLabel}
          className="inline-flex rounded-pill border border-line bg-bg p-1"
        >
          {(['USD', 'NGN'] as const).map((code) => {
            const isActive = currency === code;
            return (
              <button
                key={code}
                type="button"
                data-testid={`budget-currency-${code.toLowerCase()}`}
                aria-pressed={isActive}
                onClick={() => onCurrencyChange(code)}
                className={cn(
                  'text-label-mono min-h-[38px] rounded-pill px-4 py-1.5 transition-colors duration-200',
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

      {/* Huge Display L selected budget range readout */}
      <div aria-live="polite" aria-atomic="true" className="py-2">
        <p
          data-testid="budget-display-readout"
          className={cn(
            'text-display-l font-medium tracking-[-0.03em] transition-opacity duration-200',
            budgetAdvise || !activeRangeDef ? 'text-ink-muted' : 'text-ink',
          )}
        >
          {displayReadout}
        </p>
      </div>

      {/* Stepped Ribbon Slider (hidden in reduced motion in favour of plain step buttons below) */}
      {!shouldSimplifyMotion && (
        <div
          className={cn(
            'relative py-4 transition-opacity duration-200',
            budgetAdvise && 'pointer-events-none opacity-40',
          )}
        >
          {/* Tapered ribbon background track */}
          <div className="relative h-4 w-full rounded-pill bg-line/60">
            {/* Active tapered green ribbon fill */}
            <div
              aria-hidden="true"
              style={{ width: `${Math.max(6, fillPercent)}%` }}
              className="h-full rounded-pill bg-accent transition-[width] duration-200 ease-out"
            />

            {/* Step tick markers */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-between px-2"
            >
              {BUDGET_RANGES.map((range) => {
                const isReached =
                  activeRangeDef && range.stepIndex <= activeRangeDef.stepIndex;
                return (
                  <span
                    key={range.id}
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      isReached ? 'bg-bg' : 'bg-ink/35',
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Native accessible range input overlaid across the track */}
          <input
            id={sliderId}
            type="range"
            min={1}
            max={BUDGET_RANGES.length}
            step={1}
            disabled={budgetAdvise}
            value={currentStepIndex}
            aria-label={budgetPicker.sliderAriaLabel}
            aria-valuemin={1}
            aria-valuemax={BUDGET_RANGES.length}
            aria-valuenow={currentStepIndex}
            aria-valuetext={displayReadout}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      )}

      {/* Direct Stepped Range Pills (always visible & accessible on keyboard/touch/reduced-motion) */}
      <div
        role="group"
        aria-label={budgetPicker.sliderAriaLabel}
        className={cn(
          'grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3',
          budgetAdvise && 'opacity-50',
        )}
      >
        {BUDGET_RANGES.map((range) => {
          const isSelected = !budgetAdvise && budgetRange === range.id;
          return (
            <button
              key={range.id}
              type="button"
              data-testid={`budget-step-${range.id}`}
              aria-pressed={isSelected}
              onClick={() => handleRangeSelect(range.id)}
              className={cn(
                'flex min-h-[48px] items-center justify-between rounded-card border px-4 py-3 text-left font-mono text-xs transition-colors duration-200',
                isSelected
                  ? 'border-2 border-line-accent bg-bg font-medium text-ink'
                  : 'border-line bg-bg/60 text-ink-muted hover:border-ink hover:text-ink',
              )}
            >
              <span>{`0${range.stepIndex}`}</span>
              <span>{range.labels[currency]}</span>
            </button>
          );
        })}
      </div>

      {/* Separate Checkbox: "Not sure yet. Please advise me." */}
      <div className="border-t border-line pt-5">
        <label
          htmlFor={adviseId}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-3 select-none"
        >
          <input
            id={adviseId}
            type="checkbox"
            data-testid="budget-advise-checkbox"
            checked={budgetAdvise}
            onChange={(e) => handleAdviseToggle(e.target.checked)}
            className="h-5 w-5 cursor-pointer accent-[var(--accent)]"
          />
          <span className="font-sans text-base font-medium text-ink">
            {budgetPicker.adviseCheckboxLabel}
          </span>
        </label>
      </div>

      {/* Gentle Fit Guidance Note (Never blocking) */}
      {showGentleFitNote && !budgetAdvise && (
        <div
          data-testid="budget-gentle-fit-note"
          role="status"
          aria-live="polite"
          className="rounded-card border border-line bg-bg p-4 text-sm text-ink-muted"
        >
          <p className="text-body">{budgetPicker.gentleFitNote}</p>
        </div>
      )}

      {/* Validation Error */}
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="inline-flex items-center gap-2 font-mono text-xs text-ink"
        >
          <Icon name="error" size={20} className="shrink-0 text-accent" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
