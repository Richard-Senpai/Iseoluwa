'use client';

import { useId } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export interface ChipOption<T extends string = string> {
  value: T;
  label: string;
}

interface BaseChipGroupProps<T extends string> {
  legend: string;
  helperText?: string;
  options: readonly ChipOption<T>[];
  error?: string;
  required?: boolean;
  name?: string;
  className?: string;
  testIdPrefix?: string;
}

export interface SingleChipGroupProps<T extends string = string> extends BaseChipGroupProps<T> {
  mode: 'single';
  value: T | '';
  onChange: (nextValue: T) => void;
}

export interface MultiChipGroupProps<T extends string = string> extends BaseChipGroupProps<T> {
  mode: 'multiple';
  value: readonly T[];
  onChange: (nextValues: T[]) => void;
}

export type ChipGroupProps<T extends string = string> =
  | SingleChipGroupProps<T>
  | MultiChipGroupProps<T>;

/**
 * Accessible ChipGroup built on native `<input type="radio">` or `<input type="checkbox">`
 * inside `<fieldset>` and `<legend>` (Contact Prompt Section A3).
 * - Minimum 48px touch targets
 * - Active chip outlined in `--line-accent`
 * - Errors linked via `aria-describedby` with `error` icon and `aria-live="polite"`
 */
export function ChipGroup<T extends string = string>(props: ChipGroupProps<T>) {
  const {
    legend,
    helperText,
    options,
    error,
    required = false,
    name,
    className,
    testIdPrefix,
  } = props;

  const generatedId = useId();
  const groupName = name ?? `chip-group-${generatedId}`;
  const helperId = helperText ? `${groupName}-helper` : undefined;
  const errorId = error ? `${groupName}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
      className={cn('space-y-3', className)}
    >
      <legend className="font-sans text-base font-medium text-ink md:text-lg">
        <span>{legend}</span>
        {required && (
          <span aria-hidden="true" className="ml-1 text-accent">
            *
          </span>
        )}
      </legend>

      {helperText && (
        <p id={helperId} className="text-body text-ink-muted">
          {helperText}
        </p>
      )}

      <div className="flex flex-wrap gap-2.5 pt-1">
        {options.map((opt) => {
          const isSelected =
            props.mode === 'single'
              ? props.value === opt.value
              : props.value.includes(opt.value);

          const inputId = `${groupName}-${opt.value}`;

          const handleToggle = () => {
            if (props.mode === 'single') {
              props.onChange(opt.value);
            } else {
              const current = [...props.value];
              const idx = current.indexOf(opt.value);
              if (idx >= 0) {
                current.splice(idx, 1);
              } else {
                current.push(opt.value);
              }
              props.onChange(current);
            }
          };

          return (
            <label
              key={opt.value}
              htmlFor={inputId}
              data-testid={testIdPrefix ? `${testIdPrefix}-${opt.value}` : undefined}
              className={cn(
                'relative inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-pill border px-5 py-2.5 font-sans text-sm font-medium transition-colors duration-200 select-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg',
                isSelected
                  ? 'border-2 border-line-accent bg-surface text-ink'
                  : 'border-line bg-bg text-ink-muted hover:border-ink hover:text-ink',
              )}
            >
              <input
                id={inputId}
                type={props.mode === 'single' ? 'radio' : 'checkbox'}
                name={groupName}
                value={opt.value}
                checked={isSelected}
                onChange={handleToggle}
                className="sr-only"
              />
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block h-2 w-2 rounded-full bg-accent"
                />
              )}
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>

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
    </fieldset>
  );
}
