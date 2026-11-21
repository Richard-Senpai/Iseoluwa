import type { PackageSlug } from '@/content/packages';

export type MatrixPackageColumnSlug = Exclude<PackageSlug, 'custom'>;

export interface PackageMatrixRow {
  id: string;
  feature: string;
  values: Record<MatrixPackageColumnSlug, boolean | string>;
}

export interface PackageAddOnItem {
  id: string;
  title: string;
  description: string;
  priceNote: string;
}

export interface PackageTermItem {
  id: string;
  title: string;
  detail: string;
}

export const MATRIX_PACKAGE_COLUMNS: ReadonlyArray<{
  slug: MatrixPackageColumnSlug;
  name: string;
}> = [
  { slug: 'launch-starter', name: 'Launch Starter' },
  { slug: 'launch-plus', name: 'Launch Plus' },
  { slug: 'brand-only', name: 'Brand-Only' },
  { slug: 'build-only', name: 'Build-Only' },
  { slug: 'care-plan', name: 'Care Plan' },
  { slug: 'growth-retainer', name: 'Growth Retainer' },
] as const;

// TODO: confirm comparison matrix rows with the team
export const PACKAGE_MATRIX_ROWS: readonly PackageMatrixRow[] = [
  {
    id: 'brand-strategy',
    feature: 'Brand strategy',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': true,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'logo-visual-identity',
    feature: 'Logo and visual identity',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': true,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'brand-guidelines',
    feature: 'Brand guidelines',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': true,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'website-pages',
    feature: 'Website pages',
    values: {
      'launch-starter': 'Up to 5 pages',
      'launch-plus': 'Custom scope',
      'brand-only': false,
      'build-only': 'Custom scope',
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'ecommerce',
    feature: 'E-commerce',
    values: {
      'launch-starter': false,
      'launch-plus': true,
      'brand-only': false,
      'build-only': true,
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'custom-features',
    feature: 'Custom features',
    values: {
      'launch-starter': false,
      'launch-plus': true,
      'brand-only': false,
      'build-only': true,
      'care-plan': false,
      'growth-retainer': false,
    },
  },
  {
    id: 'seo-setup',
    feature: 'SEO setup',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': false,
      'build-only': true,
      'care-plan': false,
      'growth-retainer': true,
    },
  },
  {
    id: 'social-profile-setup',
    feature: 'Social profile setup',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': false,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': true,
    },
  },
  {
    id: 'launch-campaign',
    feature: 'Launch campaign',
    values: {
      'launch-starter': false,
      'launch-plus': true,
      'brand-only': false,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': true,
    },
  },
  {
    id: 'hosting-setup',
    feature: 'Hosting setup',
    values: {
      'launch-starter': true,
      'launch-plus': true,
      'brand-only': false,
      'build-only': true,
      'care-plan': true,
      'growth-retainer': false,
    },
  },
  {
    id: 'monthly-marketing',
    feature: 'Monthly marketing',
    values: {
      'launch-starter': false,
      'launch-plus': false,
      'brand-only': false,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': true,
    },
  },
  {
    id: 'monthly-reporting',
    feature: 'Monthly reporting',
    values: {
      'launch-starter': false,
      'launch-plus': false,
      'brand-only': false,
      'build-only': false,
      'care-plan': false,
      'growth-retainer': true,
    },
  },
  {
    id: 'maintenance-updates',
    feature: 'Maintenance and updates',
    values: {
      'launch-starter': false,
      'launch-plus': false,
      'brand-only': false,
      'build-only': false,
      'care-plan': true,
      'growth-retainer': true,
    },
  },
] as const;

export const PACKAGE_ADD_ONS: readonly PackageAddOnItem[] = [
  {
    id: 'extra-pages',
    title: 'Extra pages',
    description: 'Additional landing pages, service pages, or editorial templates.',
    priceNote: 'Quoted per project',
  },
  {
    id: 'extra-integrations',
    title: 'Extra integrations',
    description: 'CRM, booking, inventory, payment gateway, or custom API connections.',
    priceNote: 'Quoted per project',
  },
  {
    id: 'additional-campaigns',
    title: 'Additional campaigns',
    description: 'Extra seasonal, product, or multi-channel campaign rollouts.',
    priceNote: 'Quoted per project',
  },
  {
    id: 'rush-delivery',
    title: 'Rush delivery',
    description: 'Accelerated timeline when a fixed launch date cannot wait.',
    priceNote: 'Quoted per project',
  },
  {
    id: 'extra-revisions',
    title: 'Extra revision rounds',
    description: 'Additional review rounds beyond the agreed stage checkpoints.',
    priceNote: 'Quoted per project',
  },
] as const;

// TODO: confirm studio terms & VAT note with owner
export const PACKAGE_TERMS: readonly PackageTermItem[] = [
  {
    id: 'payments',
    title: 'How payments work',
    detail:
      'A 50% deposit starts work and the balance is due on delivery. For larger projects (such as Launch Plus or custom web applications), payments can be split into agreed milestones (for example 25% / 50% / 25%).',
  },
  {
    id: 'revisions',
    title: 'Revisions',
    detail:
      'Each design stage includes 2 rounds per design stage so feedback stays structured and timelines stay predictable.',
  },
  {
    id: 'ownership',
    title: 'Ownership of files',
    detail:
      'You own the final brand files, source assets, and website codebase once the project is paid in full.',
  },
  {
    id: 'currencies',
    title: 'Accepted currencies',
    detail: 'We quote and invoice in USD ($) and Nigerian Naira (₦).',
  },
  {
    id: 'vat',
    title: 'Taxes and VAT',
    detail:
      'Listed prices exclude VAT where applicable. In Nigeria, VAT is 7.5% on web design and digital services; every written proposal states clearly whether VAT applies to your quote.',
  },
] as const;
