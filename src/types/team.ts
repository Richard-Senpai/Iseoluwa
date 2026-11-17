export type TeamMemberId = 'iseoluwa' | 'daniel' | 'maleek' | 'jessica';

export type TeamMemberSectionLabel = 'FOUNDER' | 'CO-FOUNDER' | 'DEVELOPER' | 'MARKETING';

export interface TeamPortraitFocalPoint {
  x: number;
  y: number;
}

export interface TeamMemberPortrait {
  src?: string;
  avifSrc?: string;
  srcSetWebp?: string;
  srcSetAvif?: string;
  blurDataURL?: string;
  alt: string;
  focalPoint: TeamPortraitFocalPoint;
  aspect: '4:5';
  placeholderLabel: string;
}

export interface TeamMemberLinks {
  portfolio?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  x?: string;
  github?: string;
  behance?: string;
}

export interface TeamFounderChapter {
  marker: string;
  label: string;
  text: string;
}

export interface TeamFounderQuickFact {
  label: string;
  value: string;
  withStatusDot?: boolean;
}

export interface TeamFounderNote {
  quote: string;
  authorName: string;
  authorTitle: string;
}

export interface TeamMember {
  id: TeamMemberId;
  orderNumber: string;
  firstName: string;
  name: string;
  displayName: string;
  role: string;
  sectionLabel: TeamMemberSectionLabel;
  railLabel: string;
  bio: readonly string[];
  focus: readonly string[];
  portrait: TeamMemberPortrait;
  links: TeamMemberLinks;
  ctaLabel: string;
  ctaHref: string;
  chapters?: readonly TeamFounderChapter[];
  quickFacts?: readonly TeamFounderQuickFact[];
  note?: TeamFounderNote;
}
