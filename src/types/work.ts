export type WorkCategorySlug = 'branding' | 'websites' | 'marketing';

export type MediaSlotType = 'placeholder' | 'image' | 'video';

export type MediaAspectRatio = '16/9' | '4/5' | '1/1';

export type GalleryBlockLayout = 'full' | 'two-up' | 'offset-left' | 'offset-right';

export interface ProjectMediaSlot {
  type: MediaSlotType;
  label: string;
  aspectRatio: MediaAspectRatio;
  src?: string;
  poster?: string;
  alt: string;
  layout?: GalleryBlockLayout;
}

export interface ProjectTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface WorkCategory {
  slug: WorkCategorySlug;
  number: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  surfaceTone: 'light' | 'inverse';
}

export interface ProjectItem {
  slug: string;
  category: WorkCategorySlug;
  number: string;
  title: string;
  year: string;
  services: string[];
  client: string;
  role: string;
  result: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  featuredOnHome?: boolean;
  href: string;
  /** Primary media slot kept backward-compatible with Home `ProjectStack` */
  media: ProjectMediaSlot & {
    hero: ProjectMediaSlot;
    gallery: ProjectMediaSlot[];
  };
  testimonial?: ProjectTestimonial;
}
