export type CurrencyCode = 'USD' | 'NGN';

export type PackageSlug =
  | 'launch-starter'
  | 'launch-plus'
  | 'brand-only'
  | 'build-only'
  | 'care-plan'
  | 'growth-retainer'
  | 'custom';

export interface PackageItem {
  slug: PackageSlug;
  number: string;
  name: string;
  tagline?: string;
  badgeLabel?: string;
  description: string;
  timeline: string;
  timelineLabel: string;
  prices: Record<CurrencyCode, string>;
  ctaLabel: string;
  href: string;
  featured: boolean;
  isCustom?: boolean;
}

export type MatcherNeedOptionId = 'brand' | 'website' | 'marketing' | 'whole' | 'other';
export type MatcherStageOptionId = 'starting' | 'refresh' | 'scale';

export interface MatcherRecommendation {
  slug: PackageSlug;
  packageName: string;
  price: Record<CurrencyCode, string>;
  reason: string;
  ctaPrefix: string;
  ctaLabel?: string;
  href: string;
}

export interface PackagesContent {
  sectionLabel: string;
  headline: string;
  currencySwitchAriaLabel: string;
  currencies: CurrencyCode[];
  timelinePrefix: string;
  /** The 4 featured packages shown on the Home page */
  packages: PackageItem[];
  /** Complete catalog of all 7 packages (used by Contact form & future Services page) */
  allPackages: PackageItem[];
  singleServiceNote: string;
  singleServicePrices: Record<
    'brandOnly' | 'buildOnly',
    {
      name: string;
      slug: PackageSlug;
      prices: Record<CurrencyCode, string>;
      ctaLabel: string;
      href: string;
    }
  >;
  seeAllLabel: string;
  seeAllHref: string;
  matcher: {
    label: string;
    title: string;
    subtitle: string;
    question1: {
      id: string;
      prompt: string;
      options: Array<{ id: MatcherNeedOptionId; label: string }>;
    };
    question2: {
      id: string;
      prompt: string;
      options: Array<{ id: MatcherStageOptionId; label: string }>;
    };
    recommendedLabel: string;
    emptyPrompt: string;
    recommendations: Record<string, MatcherRecommendation>;
  };
}

export const ALL_PACKAGES: PackageItem[] = [
  {
    slug: 'launch-starter',
    number: '01',
    name: 'Launch Starter',
    tagline: 'Brand, website, and social launch.',
    description: 'Brand identity, 5-page website, and social media setup',
    timeline: '3-4 weeks',
    timelineLabel: '3-4 WEEKS',
    prices: {
      USD: 'From $1,500',
      NGN: 'From ₦750k',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=launch-starter',
    featured: true,
  },
  {
    slug: 'launch-plus',
    number: '02',
    name: 'Launch Plus',
    tagline: 'Full identity, custom web build, and launch campaign.',
    description:
      'Everything in Starter, plus custom features or e-commerce and a launch campaign',
    timeline: '6-8 weeks',
    timelineLabel: '6-8 WEEKS',
    prices: {
      USD: 'From $3,500',
      NGN: 'From ₦1.8M',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=launch-plus',
    featured: true,
  },
  {
    slug: 'growth-retainer',
    number: '03',
    name: 'Growth Retainer',
    tagline: 'Ongoing monthly marketing and site care.',
    description: 'Monthly marketing, content, reporting, and site maintenance',
    timeline: 'Monthly',
    timelineLabel: 'MONTHLY',
    prices: {
      USD: 'From $600 / month',
      NGN: 'From ₦400k / month',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=growth-retainer',
    featured: true,
  },
  {
    slug: 'custom',
    number: '04',
    name: 'Custom Package',
    tagline: 'Every budget. Every idea.',
    badgeLabel: 'FOR EVERY BUDGET',
    description:
      'Not sure which package fits, or need something different? Tell us what you want and what you can invest, and we will build a plan around it.',
    timeline: 'Scoped with you',
    timelineLabel: 'SCOPED WITH YOU',
    prices: {
      USD: 'You set the budget',
      NGN: 'You set the budget',
    },
    ctaLabel: 'Tell us what you need',
    href: '/contact?package=custom',
    featured: true,
    isCustom: true,
  },
  {
    slug: 'brand-only',
    number: '05',
    name: 'Brand-Only',
    tagline: 'Strategy, logo, and visual identity system.',
    description: 'Complete brand strategy, logo suite, colour & type system, and brand guidelines',
    timeline: '2-3 weeks',
    timelineLabel: '2-3 WEEKS',
    prices: {
      USD: 'From $800',
      NGN: 'From ₦400k',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=brand-only',
    featured: false,
  },
  {
    slug: 'build-only',
    number: '06',
    name: 'Build-Only',
    tagline: 'Custom-designed and engineered website or web app.',
    description: 'UI/UX design, full-stack development, CMS setup, and technical SEO',
    timeline: '3-6 weeks',
    timelineLabel: '3-6 WEEKS',
    prices: {
      USD: 'From $1,200',
      NGN: 'From ₦450k',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=build-only',
    featured: false,
  },
  {
    slug: 'care-plan',
    number: '07',
    name: 'Care Plan',
    tagline: 'Dependable hosting, security, and updates.',
    description: 'Ongoing hosting oversight, backups, performance checks, and content updates',
    timeline: 'Monthly',
    timelineLabel: 'MONTHLY',
    prices: {
      USD: 'From $150 / month',
      NGN: 'From ₦100k / month',
    },
    ctaLabel: 'Get started',
    href: '/contact?package=care-plan',
    featured: false,
  },
];

export const PACKAGES_CONTENT: PackagesContent = {
  sectionLabel: '06 / PACKAGES',
  headline: 'Clear packages. Clear prices.',
  currencySwitchAriaLabel: 'Select display currency',
  currencies: ['USD', 'NGN'],
  timelinePrefix: 'TIMELINE',
  packages: ALL_PACKAGES.filter((pkg) => pkg.featured),
  allPackages: ALL_PACKAGES,
  singleServiceNote:
    'Need just one service? Brand-only starts from $800 / ₦400k, and websites from $1,200 / ₦450k. Not sure which package fits? Choose the Custom Package and tell us your budget.',
  singleServicePrices: {
    brandOnly: {
      name: 'Brand-Only',
      slug: 'brand-only',
      prices: {
        USD: 'From $800',
        NGN: 'From ₦400k',
      },
      ctaLabel: 'Get started',
      href: '/contact?package=brand-only',
    },
    buildOnly: {
      name: 'Build-Only',
      slug: 'build-only',
      prices: {
        USD: 'From $1,200',
        NGN: 'From ₦450k',
      },
      ctaLabel: 'Get started',
      href: '/contact?package=build-only',
    },
  },
  seeAllLabel: 'See all packages',
  seeAllHref: '/services',
  matcher: {
    label: 'FIND YOUR FIT',
    title: 'Not sure where to start?',
    subtitle: 'Answer two quick questions for a tailored recommendation.',
    question1: {
      id: 'need',
      prompt: '01. What do you need?',
      options: [
        { id: 'brand', label: 'A new brand' },
        { id: 'website', label: 'A website or web app' },
        { id: 'marketing', label: 'Marketing to grow' },
        { id: 'whole', label: 'The whole package' },
        { id: 'other', label: 'Something else or not sure' },
      ],
    },
    question2: {
      id: 'stage',
      prompt: '02. Where are you now?',
      options: [
        { id: 'starting', label: 'Just starting' },
        { id: 'refresh', label: 'Established, needs a refresh' },
        { id: 'scale', label: 'Ready to scale' },
      ],
    },
    recommendedLabel: 'RECOMMENDED PACKAGE',
    emptyPrompt: 'Select an option for both questions above to see your recommended package.',
    recommendations: {
      'whole:starting': {
        slug: 'launch-starter',
        packageName: 'Launch Starter',
        price: { USD: 'From $1,500', NGN: 'From ₦750k' },
        reason:
          'Gives a new business a complete brand identity, a 5-page website, and social channels ready to launch in 3-4 weeks.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=launch-starter&source=home-matcher',
      },
      'whole:refresh': {
        slug: 'launch-plus',
        packageName: 'Launch Plus',
        price: { USD: 'From $3,500', NGN: 'From ₦1.8M' },
        reason:
          'Combines a full identity refresh, custom website or e-commerce build, and a coordinated campaign to relaunch strongly.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=launch-plus&source=home-matcher',
      },
      'whole:scale': {
        slug: 'launch-plus',
        packageName: 'Launch Plus',
        price: { USD: 'From $3,500', NGN: 'From ₦1.8M' },
        reason:
          'Built for ambitious teams that need custom web features, a sharp brand system, and a launch campaign that drives growth.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=launch-plus&source=home-matcher',
      },
      brand: {
        slug: 'brand-only',
        packageName: 'Brand-Only',
        price: { USD: 'From $800', NGN: 'From ₦400k' },
        reason:
          'Focused strategy, visual identity, and brand guidelines so your business looks consistent everywhere.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=brand-only&source=home-matcher',
      },
      website: {
        slug: 'build-only',
        packageName: 'Build-Only',
        price: { USD: 'From $1,200', NGN: 'From ₦450k' },
        reason:
          'A fast, custom-engineered website or web app designed and built by the same team for conversion and reliability.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=build-only&source=home-matcher',
      },
      marketing: {
        slug: 'growth-retainer',
        packageName: 'Growth Retainer',
        price: { USD: 'From $600 / month', NGN: 'From ₦400k / month' },
        reason:
          'Ongoing monthly SEO, content, paid campaigns, and site care focused on turning attention into customers.',
        ctaPrefix: 'Talk about',
        href: '/contact?package=growth-retainer&source=home-matcher',
      },
      custom: {
        slug: 'custom',
        packageName: 'Custom Package',
        price: { USD: 'You set the budget', NGN: 'You set the budget' },
        reason:
          'Tell us what you want to build and what you can invest, and we will shape a clear scope, price, and timeline around it.',
        ctaPrefix: 'Start with',
        ctaLabel: 'Tell us what you need',
        href: '/contact?package=custom&source=home-matcher',
      },
    },
  },
};

export function getPackageBySlug(slug?: string | null): PackageItem | undefined {
  if (!slug) return undefined;
  return ALL_PACKAGES.find((pkg) => pkg.slug === slug);
}

/**
 * Resolves the recommended package for the two-question "Find your fit" matcher.
 * Mapping rules from Home Prompt Section 4.8 + Contact Prompt Section B3:
 * - "other" ("Something else or not sure") -> Custom Package
 * - whole package + just starting -> Launch Starter
 * - whole package + established or scale -> Launch Plus
 * - new brand -> Brand-Only
 * - website -> Build-Only
 * - marketing -> Growth Retainer
 * - fallback -> Custom Package
 */
export function resolvePackageMatch(
  need: MatcherNeedOptionId | null,
  stage: MatcherStageOptionId | null,
): MatcherRecommendation | null {
  if (!need) return null;
  if (need === 'other') {
    return PACKAGES_CONTENT.matcher.recommendations.custom ?? null;
  }
  if (!stage) return null;
  if (need === 'whole') {
    const key = `whole:${stage}`;
    return (
      PACKAGES_CONTENT.matcher.recommendations[key] ??
      PACKAGES_CONTENT.matcher.recommendations.custom ??
      null
    );
  }
  return (
    PACKAGES_CONTENT.matcher.recommendations[need] ??
    PACKAGES_CONTENT.matcher.recommendations.custom ??
    null
  );
}
