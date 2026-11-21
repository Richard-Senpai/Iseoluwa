export type CurrencyCode = 'USD' | 'NGN';

export type PackageSlug =
  | 'launch-starter'
  | 'launch-plus'
  | 'brand-only'
  | 'build-only'
  | 'care-plan'
  | 'growth-retainer'
  | 'custom';

export type PackageGroupId = 'launch' | 'single' | 'ongoing' | 'custom';

export interface PackageItem {
  slug: PackageSlug;
  number: string;
  name: string;
  group: PackageGroupId;
  tagline?: string;
  badgeLabel?: string;
  bestFor: string;
  description: string;
  includes: readonly string[];
  notIncluded?: readonly string[];
  timeline: string;
  timelineLabel: string;
  revisions: string;
  paymentNote: string;
  prices: Record<CurrencyCode, string>;
  startingPriceUsd?: number;
  ctaLabel: string;
  href: string;
  servicesHref: string;
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
  /** Complete catalog of all 7 packages (used by Contact form & Services page) */
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

// TODO: confirm exact inclusions
export const ALL_PACKAGES: PackageItem[] = [
  {
    slug: 'launch-starter',
    number: '01',
    name: 'Launch Starter',
    group: 'launch',
    tagline: 'Brand, website, and social launch.',
    bestFor: 'New businesses that need a complete, professional start',
    description: 'Brand identity, 5-page website, and social media setup',
    includes: [
      'Brand identity and brand guidelines',
      'A 5-page responsive website',
      'Basic SEO setup',
      'Social media profile setup',
      'Contact form and analytics setup',
      'Handover walkthrough and source files',
    ],
    notIncluded: ['E-commerce checkout', 'Paid ad campaign management'],
    timeline: '3-4 weeks',
    timelineLabel: '3-4 WEEKS',
    revisions: '2 rounds per design stage',
    paymentNote: '50% deposit to start · 50% on delivery',
    prices: {
      USD: 'From $1,500',
      NGN: 'From ₦750k',
    },
    startingPriceUsd: 1500,
    ctaLabel: 'Get started',
    href: '/contact?package=launch-starter',
    servicesHref: '/contact?package=launch-starter&source=services',
    featured: true,
  },
  {
    slug: 'launch-plus',
    number: '02',
    name: 'Launch Plus',
    group: 'launch',
    tagline: 'Full identity, custom web build, and launch campaign.',
    bestFor: 'Businesses that want a bigger launch with custom features or an online store',
    description:
      'Everything in Starter, plus custom features or e-commerce and a launch campaign',
    includes: [
      'Everything in Launch Starter',
      'Custom web features or e-commerce store',
      'CMS setup for easy content updates',
      'Coordinated launch campaign creative and plan',
      'Email capture and welcome automation',
      'Post-launch check-in and handover training',
    ],
    timeline: '6-8 weeks',
    timelineLabel: '6-8 WEEKS',
    revisions: '2 rounds per design stage',
    paymentNote: '50% deposit to start · 50% on delivery (or 25/50/25 milestones)',
    prices: {
      USD: 'From $3,500',
      NGN: 'From ₦1.8M',
    },
    startingPriceUsd: 3500,
    ctaLabel: 'Get started',
    href: '/contact?package=launch-plus',
    servicesHref: '/contact?package=launch-plus&source=services',
    featured: true,
  },
  {
    slug: 'growth-retainer',
    number: '03',
    name: 'Growth Retainer',
    group: 'ongoing',
    tagline: 'Ongoing monthly marketing and site care.',
    bestFor: 'Businesses that want steady marketing support',
    description: 'Monthly marketing, content, reporting, and site maintenance',
    includes: [
      'Monthly marketing and campaign planning',
      'Social media content and creative direction',
      'SEO and landing page improvements',
      'Monthly report with plain-language insights',
      'Ongoing website maintenance and updates',
    ],
    timeline: 'Monthly',
    timelineLabel: 'MONTHLY',
    revisions: '2 rounds per design stage',
    paymentNote: 'Billed monthly in advance',
    prices: {
      USD: 'From $600 / month',
      NGN: 'From ₦400k / month',
    },
    startingPriceUsd: 600,
    ctaLabel: 'Get started',
    href: '/contact?package=growth-retainer',
    servicesHref: '/contact?package=growth-retainer&source=services',
    featured: true,
  },
  {
    slug: 'custom',
    number: '04',
    name: 'Custom Package',
    group: 'custom',
    tagline: 'Every budget. Every idea.',
    badgeLabel: 'FOR EVERY BUDGET',
    bestFor: 'Anyone whose needs or budget do not fit the others',
    description:
      'Not sure which package fits, or need something different? Tell us what you want and what you can invest, and we will build a plan around it.',
    includes: [
      'A plan shaped around what you want and what you can invest',
      'Any combination of brand, web, or marketing deliverables',
      'Fixed scope, fixed price, and clear timeline agreed before work begins',
      'Direct collaboration with our founders and project lead',
      'Milestone payment options for larger scopes',
    ],
    timeline: 'Scoped with you',
    timelineLabel: 'SCOPED WITH YOU',
    revisions: 'Agreed per scope',
    paymentNote: '50% deposit or milestone schedule agreed upfront',
    prices: {
      USD: 'You set the budget',
      NGN: 'You set the budget',
    },
    ctaLabel: 'Tell us what you need',
    href: '/contact?package=custom',
    servicesHref: '/contact?package=custom&source=services',
    featured: true,
    isCustom: true,
  },
  {
    slug: 'brand-only',
    number: '05',
    name: 'Brand-Only',
    group: 'single',
    tagline: 'Strategy, logo, and visual identity system.',
    bestFor: 'Businesses that need strategy and identity first',
    description: 'Complete brand strategy, logo suite, colour & type system, and brand guidelines',
    includes: [
      'Brand strategy and positioning statement',
      'Primary logo, secondary marks, and variations',
      'Colour palette and typography system',
      'Brand guidelines document',
      'Social media templates and business card design',
    ],
    notIncluded: ['Website design and development', 'Monthly marketing management'],
    timeline: '2-3 weeks',
    timelineLabel: '2-3 WEEKS',
    revisions: '2 rounds per design stage',
    paymentNote: '50% deposit to start · 50% on delivery',
    prices: {
      USD: 'From $800',
      NGN: 'From ₦400k',
    },
    startingPriceUsd: 800,
    ctaLabel: 'Get started',
    href: '/contact?package=brand-only',
    servicesHref: '/contact?package=brand-only&source=services',
    featured: false,
  },
  {
    slug: 'build-only',
    number: '06',
    name: 'Build-Only',
    group: 'single',
    tagline: 'Custom-designed and engineered website or web app.',
    bestFor: 'Businesses that already have a brand and need a website or web app',
    description: 'UI/UX design, full-stack development, CMS setup, and technical SEO',
    includes: [
      'UI/UX design and interactive prototype',
      'A website or web application, designed and built',
      'CMS setup and technical SEO foundations',
      'Hosting setup, deployment, and handover',
      'Responsive testing across phone, tablet, and desktop',
    ],
    notIncluded: ['Logo and brand identity design'],
    timeline: 'Depends on scope',
    timelineLabel: 'DEPENDS ON SCOPE',
    revisions: '2 rounds per design stage',
    paymentNote: '50% deposit to start · 50% on delivery',
    prices: {
      USD: 'From $1,200',
      NGN: 'From ₦450k',
    },
    startingPriceUsd: 1200,
    ctaLabel: 'Get started',
    href: '/contact?package=build-only',
    servicesHref: '/contact?package=build-only&source=services',
    featured: false,
  },
  {
    slug: 'care-plan',
    number: '07',
    name: 'Care Plan',
    group: 'ongoing',
    tagline: 'Dependable hosting, security, and updates.',
    bestFor: 'Websites that need to stay fast, safe, and up to date',
    description: 'Hosting, security updates, backups, minor edits',
    includes: [
      'Managed hosting oversight and uptime monitoring',
      'Security updates and dependency patching',
      'Automated scheduled backups',
      'Minor content and layout edits each month',
      'Priority technical support within one business day',
    ],
    timeline: 'Monthly',
    timelineLabel: 'MONTHLY',
    revisions: 'Ongoing monthly edits',
    paymentNote: 'Billed monthly in advance',
    prices: {
      USD: 'From $120 / month',
      NGN: 'From ₦180k / month',
    },
    startingPriceUsd: 120,
    ctaLabel: 'Get started',
    href: '/contact?package=care-plan',
    servicesHref: '/contact?package=care-plan&source=services',
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
  seeAllHref: '/services#packages',
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
