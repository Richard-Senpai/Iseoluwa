import { z } from 'zod';
import type {
  BudgetFitLevel,
  BudgetRangeId,
  BudgetSelectionValue,
  ContactFormValues,
  ContactPackageInterest,
  ProjectServiceNeed,
} from '@/types/contact';
import type { CurrencyCode } from '@/content/packages';

export const PREFERRED_CONTACT_VALUES = ['email', 'whatsapp', 'video-call'] as const;

export const PACKAGE_INTEREST_VALUES = [
  'launch-starter',
  'launch-plus',
  'brand-only',
  'build-only',
  'care-plan',
  'growth-retainer',
  'custom',
  'not-sure',
] as const;

export const SERVICE_NEED_VALUES = ['branding', 'website', 'marketing', 'not-sure'] as const;

export const MAIN_GOAL_VALUES = [
  'launch-new',
  'rebrand-refresh',
  'get-customers',
  'sell-online',
  'improve-existing',
  'something-else',
] as const;

export const BRANDING_SCOPE_VALUES = [
  'strategy',
  'logo',
  'identity',
  'guidelines',
  'templates',
  'not-sure',
] as const;

export const BRANDING_START_VALUES = ['scratch', 'refresh', 'evolve'] as const;

export const WEBSITE_KIND_VALUES = [
  'marketing-site',
  'ecommerce',
  'web-app',
  'landing-page',
  'redesign',
] as const;

export const WEBSITE_FEATURE_VALUES = [
  'payments',
  'bookings',
  'accounts',
  'cms',
  'multilingual',
  'integrations',
  'not-sure',
] as const;

export const MARKETING_CHANNEL_VALUES = [
  'social',
  'seo',
  'paid-ads',
  'email',
  'content',
  'not-sure',
] as const;

export const MARKETING_AIM_VALUES = ['awareness', 'leads', 'sales', 'launch'] as const;

export const BUDGET_RANGE_VALUES = [
  'range-1',
  'range-2',
  'range-3',
  'range-4',
  'range-5',
  'range-6',
] as const;

export const START_TIMELINE_VALUES = [
  'asap',
  'within-month',
  'two-three-months',
  'exploring',
] as const;

export const DECISION_MAKER_VALUES = ['just-me', 'me-and-team', 'someone-else'] as const;

export const REFERRAL_SOURCE_VALUES = [
  'search',
  'social',
  'referral',
  'portfolio',
  'other',
] as const;

/**
 * Minimum character count for project description:
 * 40 characters when the package is `custom` or `not-sure`, 20 characters otherwise.
 */
export function getMinProjectDescriptionLength(
  packageInterest: ContactPackageInterest,
): number {
  return packageInterest === 'custom' || packageInterest === 'not-sure' ? 40 : 20;
}

/**
 * Step 1 Schema: About you
 */
export const contactStep1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'Name must be 120 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(160, 'Email must be 160 characters or fewer.'),
  company: z
    .string()
    .trim()
    .min(1, 'Please enter your company, brand name, or "Personal project".')
    .max(140, 'Company name must be 140 characters or fewer.'),
  role: z.string().trim().max(100, 'Role must be 100 characters or fewer.'),
  country: z.string().trim().min(2, 'Please select your country.').max(100),
  phone: z.string().trim().max(60, 'Phone number must be 60 characters or fewer.'),
  preferredContact: z.enum(PREFERRED_CONTACT_VALUES, {
    message: 'Please choose the best way to reach you.',
  }),
});

/**
 * Step 2 Base Schema: Your project
 */
export const contactStep2BaseSchema = z.object({
  packageInterest: z.enum(PACKAGE_INTEREST_VALUES, {
    message: 'Please select a package option.',
  }),
  servicesNeeded: z
    .array(z.enum(SERVICE_NEED_VALUES))
    .min(1, 'Please select at least one service or "I am not sure yet".'),
  projectDescription: z
    .string()
    .trim()
    .max(3000, 'Project description must be 3,000 characters or fewer.'),
  mainGoal: z.enum(MAIN_GOAL_VALUES, {
    message: 'Please select the main goal for your project.',
  }),
  existingMaterialsLinks: z.string().trim().max(1000),

  // Conditional fields
  brandingNeeds: z.array(z.enum(BRANDING_SCOPE_VALUES)),
  brandingStartingPoint: z.union([z.enum(BRANDING_START_VALUES), z.literal('')]),

  websiteKind: z.union([z.enum(WEBSITE_KIND_VALUES), z.literal('')]),
  websiteFeatures: z.array(z.enum(WEBSITE_FEATURE_VALUES)),
  existingSiteUrl: z.string().trim().max(500),

  marketingChannels: z.array(z.enum(MARKETING_CHANNEL_VALUES)),
  marketingAim: z.union([z.enum(MARKETING_AIM_VALUES), z.literal('')]),
  existingMarketingLinks: z.string().trim().max(500),
});

export const contactStep2Schema = contactStep2BaseSchema.superRefine((data, ctx) => {
  const minChars = getMinProjectDescriptionLength(data.packageInterest);
  if (data.projectDescription.trim().length < minChars) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['projectDescription'],
      message: `Please tell us a little more about your project (at least ${minChars} characters).`,
    });
  }
});

/**
 * Step 3 Base Schema: Budget and timing
 */
export const contactStep3BaseSchema = z.object({
  currency: z.enum(['USD', 'NGN']),
  budgetRange: z.union([
    z.enum(BUDGET_RANGE_VALUES),
    z.literal('advise'),
    z.literal(''),
  ]),
  budgetAdvise: z.boolean(),
  startTimeline: z.enum(START_TIMELINE_VALUES, {
    message: 'Please select when you would like to start.',
  }),
  deadlineDate: z.string().trim().max(100),
  decisionMaker: z.union([z.enum(DECISION_MAKER_VALUES), z.literal('')]),
});

/**
 * Step 4 Schema: Review and send
 */
export const contactStep4Schema = z.object({
  heardAboutUs: z.union([z.enum(REFERRAL_SOURCE_VALUES), z.literal('')]),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: 'Please agree to be contacted in line with the Privacy Policy.',
  }),
  honeypot: z.string().max(0, 'Spam detected.'),
  startedAtMs: z.number(),
  meta: z
    .object({
      packageSlug: z.string().max(80).optional(),
      source: z.string().max(120).optional(),
      utm_source: z.string().max(120).optional(),
      utm_medium: z.string().max(120).optional(),
      utm_campaign: z.string().max(120).optional(),
      utm_term: z.string().max(120).optional(),
      utm_content: z.string().max(120).optional(),
      referrer: z.string().max(500).optional(),
      pageUrl: z.string().max(500).optional(),
    })
    .strict(),
});

/**
 * Full Combined Schema (shared by client and `/api/contact` server route).
 * Uses `.strict()` so unexpected fields are rejected.
 */
export const contactRequestSchema = contactStep1Schema
  .merge(contactStep2BaseSchema)
  .merge(contactStep3BaseSchema)
  .merge(contactStep4Schema)
  .strict()
  .superRefine((data, ctx) => {
    const minChars = getMinProjectDescriptionLength(data.packageInterest);
    if (data.projectDescription.trim().length < minChars) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['projectDescription'],
        message: `Please tell us a little more about your project (at least ${minChars} characters).`,
      });
    }

    // Budget must be selected (either a range 1..6 or "advise")
    const hasBudgetRange = BUDGET_RANGE_VALUES.includes(
      data.budgetRange as BudgetRangeId,
    );
    const hasAdvise = data.budgetAdvise || data.budgetRange === 'advise';

    if (!hasBudgetRange && !hasAdvise) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['budgetRange'],
        message: 'Please select a budget range or choose "Not sure yet. Please advise me."',
      });
    }
  });

/**
 * Maps a preselected package slug to default services and budget range per Prompt Section A3:
 * - Launch Starter -> services: branding, website, marketing; budget: range-3 ($1,500–$3,500)
 * - Launch Plus -> services: branding, website, marketing; budget: range-4 ($3,500–$7,500)
 * - Brand-Only -> services: branding; budget: range-2 ($800–$1,500)
 * - Build-Only -> services: website; budget: range-2 ($800–$1,500)
 * - Care Plan -> services: website; budget: range-2 ($800–$1,500)
 * - Growth Retainer -> services: marketing; budget: range-2 ($800–$1,500)
 * - Custom / Not sure -> preselect nothing for budget
 */
export function getPackageDefaults(packageSlug?: string | null): {
  packageInterest: ContactPackageInterest;
  servicesNeeded: ProjectServiceNeed[];
  budgetRange: BudgetSelectionValue;
} {
  switch (packageSlug) {
    case 'launch-starter':
      return {
        packageInterest: 'launch-starter',
        servicesNeeded: ['branding', 'website', 'marketing'],
        budgetRange: 'range-3',
      };
    case 'launch-plus':
      return {
        packageInterest: 'launch-plus',
        servicesNeeded: ['branding', 'website', 'marketing'],
        budgetRange: 'range-4',
      };
    case 'brand-only':
      return {
        packageInterest: 'brand-only',
        servicesNeeded: ['branding'],
        budgetRange: 'range-2',
      };
    case 'build-only':
      return {
        packageInterest: 'build-only',
        servicesNeeded: ['website'],
        budgetRange: 'range-2',
      };
    case 'care-plan':
      return {
        packageInterest: 'care-plan',
        servicesNeeded: ['website'],
        budgetRange: 'range-2',
      };
    case 'growth-retainer':
      return {
        packageInterest: 'growth-retainer',
        servicesNeeded: ['marketing'],
        budgetRange: 'range-2',
      };
    case 'custom':
      return {
        packageInterest: 'custom',
        servicesNeeded: [],
        budgetRange: '',
      };
    default:
      return {
        packageInterest: 'not-sure',
        servicesNeeded: [],
        budgetRange: '',
      };
  }
}

/**
 * Evaluates gentle budget fit (never blocking):
 * - Range 1 (Under $800 / Under ₦400k) is below the studio minimum for branding ($800) or websites ($1,200).
 * - Range 2 ($800–$1,500 / ₦400k–₦750k) is near minimum when both branding and website are selected.
 * - Range 3+ is at or above typical starting minimums.
 */
export function evaluateBudgetFit(params: {
  budgetRange: BudgetSelectionValue;
  budgetAdvise: boolean;
  servicesNeeded: ProjectServiceNeed[];
  packageInterest: ContactPackageInterest;
}): {
  level: BudgetFitLevel;
  showGentleNote: boolean;
} {
  const { budgetRange, budgetAdvise, servicesNeeded, packageInterest } = params;

  if (budgetAdvise || budgetRange === 'advise' || budgetRange === '') {
    return { level: 'advise', showGentleNote: false };
  }

  const needsWebsite =
    servicesNeeded.includes('website') ||
    packageInterest === 'build-only' ||
    packageInterest === 'launch-starter' ||
    packageInterest === 'launch-plus';
  const needsBranding =
    servicesNeeded.includes('branding') ||
    packageInterest === 'brand-only' ||
    packageInterest === 'launch-starter' ||
    packageInterest === 'launch-plus';

  if (budgetRange === 'range-1') {
    return {
      level: 'below',
      showGentleNote: true,
    };
  }

  if (budgetRange === 'range-2' && needsWebsite && needsBranding) {
    return {
      level: 'near',
      showGentleNote: true,
    };
  }

  if (budgetRange === 'range-2' && packageInterest === 'launch-plus') {
    return {
      level: 'below',
      showGentleNote: true,
    };
  }

  return {
    level: 'above',
    showGentleNote: false,
  };
}

export function createInitialContactFormValues(params?: {
  packageSlug?: string | null;
  currency?: CurrencyCode;
  source?: string | null;
}): ContactFormValues {
  const defaults = getPackageDefaults(params?.packageSlug);
  return {
    fullName: '',
    email: '',
    company: '',
    role: '',
    country: '',
    phone: '',
    preferredContact: 'email',

    packageInterest: defaults.packageInterest,
    servicesNeeded: defaults.servicesNeeded,
    projectDescription: '',
    mainGoal: 'launch-new',
    existingMaterialsLinks: '',

    brandingNeeds: [],
    brandingStartingPoint: '',

    websiteKind: '',
    websiteFeatures: [],
    existingSiteUrl: '',

    marketingChannels: [],
    marketingAim: '',
    existingMarketingLinks: '',

    currency: params?.currency ?? 'USD',
    budgetRange: defaults.budgetRange,
    budgetAdvise: false,
    startTimeline: 'within-month',
    deadlineDate: '',
    decisionMaker: '',

    heardAboutUs: '',
    consentAccepted: false,
    honeypot: '',
    startedAtMs: Date.now(),

    meta: {
      packageSlug: params?.packageSlug ?? undefined,
      source: params?.source ?? undefined,
    },
  };
}
