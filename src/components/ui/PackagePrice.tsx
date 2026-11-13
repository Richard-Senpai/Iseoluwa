import { cn } from '@/lib/utils';

export interface ParsedPackagePrice {
  prefix: string | null;
  amount: string;
  suffix: string | null;
  isCustom: boolean;
}

export function parsePackagePrice(rawPrice: string, isCustom = false): ParsedPackagePrice {
  const trimmed = rawPrice.trim();
  if (isCustom || !/^from\s+/i.test(trimmed)) {
    return {
      prefix: null,
      amount: trimmed,
      suffix: null,
      isCustom: true,
    };
  }

  let remainder = trimmed.replace(/^from\s+/i, '').trim();
  let suffix: string | null = null;

  const monthMatch = remainder.match(/\s*(\/\s*month)$/i);
  if (monthMatch) {
    suffix = '/ MONTH';
    remainder = remainder.slice(0, monthMatch.index).trim();
  }

  return {
    prefix: 'FROM',
    amount: remainder,
    suffix,
    isCustom: false,
  };
}

export interface PackagePriceProps {
  price: string;
  isCustom?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Reusable `<PackagePrice />` component (Design System Section 14.2):
 * Renders package prices in three structured parts inside an inline-size container:
 * 1. Mono `FROM` label above (12px, `--ink-muted`)
 * 2. Number in Aeonik Medium at `clamp(28px, 11cqi, 52px)`, line-height `1.05`, tracking `-0.03em`
 * 3. Mono `/ MONTH` note beneath where applicable (12px, `--ink-muted`)
 * Custom Package's `"You set the budget"` renders in Heading M (`clamp(20px, 2.2vw, 32px)`).
 */
export function PackagePrice({
  price,
  isCustom = false,
  compact = false,
  className,
}: PackagePriceProps) {
  const parsed = parsePackagePrice(price, isCustom);

  if (parsed.isCustom) {
    return (
      <div
        data-testid="package-price"
        className={cn('min-w-0 flex flex-col justify-center', className)}
      >
        <p
          className={cn(
            'font-sans font-medium text-ink break-words',
            compact
              ? 'text-lg leading-tight tracking-tight'
              : 'text-heading-m',
          )}
        >
          {parsed.amount}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        data-testid="package-price"
        className={cn('min-w-0 inline-flex flex-wrap items-baseline gap-1.5', className)}
      >
        {parsed.prefix && (
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
            {parsed.prefix}
          </span>
        )}
        <span className="font-sans text-lg font-medium tracking-[-0.03em] text-ink">
          {parsed.amount}
        </span>
        {parsed.suffix && (
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
            {parsed.suffix}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="package-price"
      className={cn('min-w-0 flex flex-col gap-1', className)}
    >
      {parsed.prefix && (
        <span className="font-mono text-xs uppercase leading-[1.4] tracking-[0.08em] text-ink-muted">
          {parsed.prefix}
        </span>
      )}
      <span className="font-sans text-[clamp(28px,11cqi,52px)] font-medium leading-[1.05] tracking-[-0.03em] text-ink break-words">
        {parsed.amount}
      </span>
      {parsed.suffix ? (
        <span className="font-mono text-xs uppercase leading-[1.4] tracking-[0.08em] text-ink-muted">
          {parsed.suffix}
        </span>
      ) : (
        <span aria-hidden="true" className="font-mono text-xs leading-[1.4] opacity-0 select-none">
          &nbsp;
        </span>
      )}
    </div>
  );
}
