export type CurrencyCode = 'USD' | 'NGN';

export interface PackageItem {
  slug: string;
  number: string;
  name: string;
  description: string;
  timeline: string;
  timelineLabel: string;
  prices: Record<CurrencyCode, string>;
}

export type MatcherNeedOptionId = 'brand' | 'website' | 'marketing' | 'whole';
export type MatcherStageOptionId = 'starting' | 'refresh' | 'scale';

export interface MatcherRecommendation {
  slug: string;
  packageName: string;
  price: Record<CurrencyCode, string>;
  reason: string;
  ctaPrefix: string;
}

export interface PackagesContent {
  sectionLabel: string;
  headline: string;
  currencySwitchAriaLabel: string;
  currencies: CurrencyCode[];
  timelinePrefix: string;
  packages: PackageItem[];
  singleServiceNote: string;
  singleServicePrices: Record<
    'brandOnly' | 'buildOnly',
    {
      name: string;
      slug: string;
      prices: Record<CurrencyCode, string>;
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

export const PACKAGES_CONTENT: PackagesContent = {
  sectionLabel: '06 / PACKAGES',
  headline: 'Clear packages. Clear prices.',
  currencySwitchAriaLabel: 'Select display currency',
  currencies: ['USD', 'NGN'],
  timelinePrefix: 'TIMELINE',
  packages: [
    {
      slug: 'launch-starter',
      number: '01',
      name: 'Launch Starter',
      description: 'Brand identity, 5-page website, and social media setup',
      timeline: '3-4 weeks',
      timelineLabel: '3-4 WEEKS',
      prices: {
        USD: 'From $1,500',
        NGN: 'From ₦750k',
      },
    },
    {
      slug: 'launch-plus',
      number: '02',
      name: 'Launch Plus',
      description:
        'Everything in Starter, plus custom features or e-commerce and a launch campaign',
      timeline: '6-8 weeks',
      timelineLabel: '6-8 WEEKS',
      prices: {
        USD: 'From $3,500',
        NGN: 'From ₦1.8M',
      },
    },
    {
      slug: 'growth-retainer',
      number: '03',
      name: 'Growth Retainer',
      description: 'Monthly marketing, content, reporting, and site maintenance',
      timeline: 'Monthly',
      timelineLabel: 'MONTHLY',
      prices: {
        USD: 'From $600 / month',
        NGN: 'From ₦400k / month',
      },
    },
  ],
  singleServiceNote:
    'Need just one service? Brand-only starts from $800 / ₦400k, and websites from $1,200 / ₦450k.',
  singleServicePrices: {
    brandOnly: {
      name: 'Brand-Only',
      slug: 'brand-only',
      prices: {
        USD: 'From $800',
        NGN: 'From ₦400k',
      },
    },
    buildOnly: {
      name: 'Build-Only',
      slug: 'build-only',
      prices: {
        USD: 'From $1,200',
        NGN: 'From ₦450k',
      },
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
      },
      'whole:refresh': {
        slug: 'launch-plus',
        packageName: 'Launch Plus',
        price: { USD: 'From $3,500', NGN: 'From ₦1.8M' },
        reason:
          'Combines a full identity refresh, custom website or e-commerce build, and a coordinated campaign to relaunch strongly.',
        ctaPrefix: 'Talk about',
      },
      'whole:scale': {
        slug: 'launch-plus',
        packageName: 'Launch Plus',
        price: { USD: 'From $3,500', NGN: 'From ₦1.8M' },
        reason:
          'Built for ambitious teams that need custom web features, a sharp brand system, and a launch campaign that drives growth.',
        ctaPrefix: 'Talk about',
      },
      brand: {
        slug: 'brand-only',
        packageName: 'Brand-Only',
        price: { USD: 'From $800', NGN: 'From ₦400k' },
        reason:
          'Focused strategy, visual identity, and brand guidelines so your business looks consistent everywhere.',
        ctaPrefix: 'Talk about',
      },
      website: {
        slug: 'build-only',
        packageName: 'Build-Only',
        price: { USD: 'From $1,200', NGN: 'From ₦450k' },
        reason:
          'A fast, custom-engineered website or web app designed and built by the same team for conversion and reliability.',
        ctaPrefix: 'Talk about',
      },
      marketing: {
        slug: 'growth-retainer',
        packageName: 'Growth Retainer',
        price: { USD: 'From $600 / month', NGN: 'From ₦400k / month' },
        reason:
          'Ongoing monthly SEO, content, paid campaigns, and site care focused on turning attention into customers.',
        ctaPrefix: 'Talk about',
      },
    },
  },
};

/**
 * Resolves the recommended package for the two-question "Find your fit" matcher.
 * Mapping rules from prompt Section 4.8:
 * - whole package + just starting -> Launch Starter
 * - whole package + established or scale -> Launch Plus
 * - new brand -> Brand-Only
 * - website -> Build-Only
 * - marketing -> Growth Retainer
 */
export function resolvePackageMatch(
  need: MatcherNeedOptionId | null,
  stage: MatcherStageOptionId | null,
): MatcherRecommendation | null {
  if (!need || !stage) return null;
  if (need === 'whole') {
    const key = `whole:${stage}`;
    return PACKAGES_CONTENT.matcher.recommendations[key] ?? null;
  }
  return PACKAGES_CONTENT.matcher.recommendations[need] ?? null;
}
