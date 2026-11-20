import type { PackageSlug } from '@/content/packages';
import type { WorkCategorySlug } from '@/types/work';

export type ServiceSlug = 'branding' | 'web' | 'marketing';

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  deliverables: readonly string[];
  previewImage: string;
  previewAlt: string;
}

export interface ServiceFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceItem {
  slug: ServiceSlug;
  number: '01' | '02' | '03';
  sectionLabel: string;
  title: string;
  tagline: string;
  intro: string;
  forWhoLabel: string;
  forWho: string;
  offeringsHeading: string;
  deliverablesHeading: string;
  offerings: readonly ServiceOffering[];
  outcomesHeading: string;
  outcomes: readonly string[];
  relatedWorkHeading: string;
  relatedCategory: WorkCategorySlug;
  seeAllProjectsLabel: string;
  seeAllProjectsHref: string;
  faqHeading: string;
  faq: readonly ServiceFaqItem[];
  bestMatchingPackageSlug: PackageSlug;
  ctaLabel: string;
  ctaHref: string;
  bookCallLabel: string;
  bookCallHref: string;
  reassurance: string;
  isInverse?: boolean;
}
