import type { CurrencyCode } from '@/content/packages';

export type PreferredContactMethod = 'email' | 'whatsapp' | 'video-call';

export type ContactPackageInterest =
  | 'launch-starter'
  | 'launch-plus'
  | 'brand-only'
  | 'build-only'
  | 'care-plan'
  | 'growth-retainer'
  | 'custom'
  | 'not-sure';

export type ProjectServiceNeed = 'branding' | 'website' | 'marketing' | 'not-sure';

export type ProjectMainGoal =
  | 'launch-new'
  | 'rebrand-refresh'
  | 'get-customers'
  | 'sell-online'
  | 'improve-existing'
  | 'something-else';

export type BrandingScopeItem =
  | 'strategy'
  | 'logo'
  | 'identity'
  | 'guidelines'
  | 'templates'
  | 'not-sure';

export type BrandingStartingPoint = 'scratch' | 'refresh' | 'evolve';

export type WebsiteKind =
  | 'marketing-site'
  | 'ecommerce'
  | 'web-app'
  | 'landing-page'
  | 'redesign';

export type WebsiteFeatureItem =
  | 'payments'
  | 'bookings'
  | 'accounts'
  | 'cms'
  | 'multilingual'
  | 'integrations'
  | 'not-sure';

export type MarketingChannelItem =
  | 'social'
  | 'seo'
  | 'paid-ads'
  | 'email'
  | 'content'
  | 'not-sure';

export type MarketingAim = 'awareness' | 'leads' | 'sales' | 'launch';

export type BudgetRangeId = 'range-1' | 'range-2' | 'range-3' | 'range-4' | 'range-5' | 'range-6';

export type BudgetSelectionValue = BudgetRangeId | 'advise' | '';

export type StartTimelineOption = 'asap' | 'within-month' | 'two-three-months' | 'exploring';

export type DecisionMakerOption = 'just-me' | 'me-and-team' | 'someone-else';

export type ReferralSourceOption = 'search' | 'social' | 'referral' | 'portfolio' | 'other';

export type BudgetFitLevel = 'above' | 'near' | 'below' | 'advise';

export interface BudgetRangeDefinition {
  id: BudgetRangeId;
  stepIndex: number; // 1..6
  labels: Record<CurrencyCode, string>;
  minUsd: number;
}

export interface ContactUtmMetadata {
  packageSlug?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  pageUrl?: string;
}

export interface ContactFormValues {
  // Step 1: About you
  fullName: string;
  email: string;
  company: string;
  role: string;
  country: string;
  phone: string;
  preferredContact: PreferredContactMethod;

  // Step 2: Your project
  packageInterest: ContactPackageInterest;
  servicesNeeded: ProjectServiceNeed[];
  projectDescription: string;
  mainGoal: ProjectMainGoal;
  existingMaterialsLinks: string;

  // Conditional — Branding
  brandingNeeds: BrandingScopeItem[];
  brandingStartingPoint: BrandingStartingPoint | '';

  // Conditional — Website or web app
  websiteKind: WebsiteKind | '';
  websiteFeatures: WebsiteFeatureItem[];
  existingSiteUrl: string;

  // Conditional — Marketing
  marketingChannels: MarketingChannelItem[];
  marketingAim: MarketingAim | '';
  existingMarketingLinks: string;

  // Step 3: Budget and timing
  currency: CurrencyCode;
  budgetRange: BudgetSelectionValue;
  budgetAdvise: boolean;
  startTimeline: StartTimelineOption;
  deadlineDate: string;
  decisionMaker: DecisionMakerOption | '';

  // Step 4: Review and send
  heardAboutUs: ReferralSourceOption | '';
  consentAccepted: boolean;
  honeypot: string;
  startedAtMs: number;

  // Hidden tracking metadata
  meta: ContactUtmMetadata;
}
