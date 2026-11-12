import type {
  ProjectItem,
  ProjectMediaSlot,
  WorkCategory,
  WorkCategorySlug,
} from '@/types/work';

export type { ProjectItem, ProjectMediaSlot, WorkCategory, WorkCategorySlug };

/**
 * Ordered Work categories (Work Prompt Section 3).
 * Branding (light) -> Websites (inverse/black) -> Marketing (light).
 */
export const WORK_CATEGORIES: WorkCategory[] = [
  {
    slug: 'branding',
    number: '01',
    title: 'Branding',
    tagline: 'Identity systems people remember.',
    description:
      'Strategy, logo, and visual identity that make a business look like what it wants to become.',
    tags: ['STRATEGY', 'IDENTITY', 'GUIDELINES'],
    surfaceTone: 'light',
  },
  {
    slug: 'websites',
    number: '02',
    title: 'Websites',
    tagline: 'Sites built to work as hard as you do.',
    description:
      'Fast, beautiful, full-stack websites and web apps, designed and built by the same team.',
    tags: ['UI/UX', 'DEVELOPMENT', 'E-COMMERCE'],
    surfaceTone: 'inverse',
  },
  {
    slug: 'marketing',
    number: '03',
    title: 'Marketing',
    tagline: 'Attention that turns into customers.',
    description:
      'Social, SEO, ads, and email campaigns that bring the right people to your door.',
    tags: ['SOCIAL', 'SEO', 'ADS', 'EMAIL'],
    surfaceTone: 'light',
  },
];

function createPlaceholderProject(params: {
  slug: string;
  category: WorkCategorySlug;
  number: string;
  title: string;
  services: string[];
  featuredOnHome?: boolean;
}): ProjectItem {
  const heroSlot: ProjectMediaSlot = {
    type: 'placeholder',
    label: 'PROJECT MEDIA 16:9',
    aspectRatio: '16/9',
    alt: `${params.title} hero media placeholder`,
  };

  const gallerySlots: ProjectMediaSlot[] = [
    {
      type: 'placeholder',
      label: 'PROJECT MEDIA 16:9',
      aspectRatio: '16/9',
      alt: `${params.title} full-bleed showcase placeholder`,
      layout: 'full',
    },
    {
      type: 'placeholder',
      label: 'PROJECT MEDIA 4:5',
      aspectRatio: '4/5',
      alt: `${params.title} detail placeholder 01`,
      layout: 'two-up',
    },
    {
      type: 'placeholder',
      label: 'PROJECT MEDIA 4:5',
      aspectRatio: '4/5',
      alt: `${params.title} detail placeholder 02`,
      layout: 'two-up',
    },
    {
      type: 'placeholder',
      label: 'PROJECT MEDIA 16:9',
      aspectRatio: '16/9',
      alt: `${params.title} offset showcase placeholder`,
      layout: 'offset-right',
    },
  ];

  return {
    slug: params.slug,
    category: params.category,
    number: params.number,
    title: params.title,
    year: '[Year]',
    services: params.services,
    client: '[Client name]',
    role: params.services.join(' • '),
    result: '[One-line result]',
    summary:
      '[Project overview placeholder — replace with two to three sentences explaining the client context, the core objective, and the unified solution delivered by Iséoluwa.]',
    challenge:
      '[Challenge placeholder — replace with a clear description of the business problem, audience friction, or fragmented brand/web setup before the project began.]',
    approach:
      '[What we did placeholder — replace with a concise breakdown of the strategy, design system, engineering architecture, or campaign execution.]',
    outcome:
      '[Outcome supporting text placeholder — replace with qualitative and verified post-launch impact once live metrics are approved.]',
    featuredOnHome: params.featuredOnHome,
    href: `/work/${params.category}/${params.slug}`,
    media: {
      ...heroSlot,
      hero: heroSlot,
      gallery: gallerySlots,
    },
  };
}

/**
 * Single source of truth for all 12 placeholder projects (4 per category).
 * Do not invent clients, logos, results, or statistics.
 * Swapping in real work is a data-only change here (or via Sanity in Phase 4).
 */
export const ALL_PROJECTS: ProjectItem[] = [
  // Branding (4 projects)
  createPlaceholderProject({
    slug: 'branding-project-01',
    category: 'branding',
    number: '01',
    title: '[Branding project 01]',
    services: ['STRATEGY', 'IDENTITY', 'GUIDELINES'],
    featuredOnHome: true,
  }),
  createPlaceholderProject({
    slug: 'branding-project-02',
    category: 'branding',
    number: '02',
    title: '[Branding project 02]',
    services: ['STRATEGY', 'IDENTITY'],
  }),
  createPlaceholderProject({
    slug: 'branding-project-03',
    category: 'branding',
    number: '03',
    title: '[Branding project 03]',
    services: ['IDENTITY', 'GUIDELINES', 'PACKAGING'],
  }),
  createPlaceholderProject({
    slug: 'branding-project-04',
    category: 'branding',
    number: '04',
    title: '[Branding project 04]',
    services: ['STRATEGY', 'IDENTITY', 'WEB'],
  }),

  // Websites (4 projects)
  createPlaceholderProject({
    slug: 'websites-project-01',
    category: 'websites',
    number: '01',
    title: '[Websites project 01]',
    services: ['BRAND', 'UI/UX', 'DEVELOPMENT'],
    featuredOnHome: true,
  }),
  createPlaceholderProject({
    slug: 'websites-project-02',
    category: 'websites',
    number: '02',
    title: '[Websites project 02]',
    services: ['UI/UX', 'DEVELOPMENT', 'E-COMMERCE'],
  }),
  createPlaceholderProject({
    slug: 'websites-project-03',
    category: 'websites',
    number: '03',
    title: '[Websites project 03]',
    services: ['UI/UX', 'WEB APP', 'DEVELOPMENT'],
  }),
  createPlaceholderProject({
    slug: 'websites-project-04',
    category: 'websites',
    number: '04',
    title: '[Websites project 04]',
    services: ['BRAND', 'DEVELOPMENT'],
  }),

  // Marketing (4 projects)
  createPlaceholderProject({
    slug: 'marketing-project-01',
    category: 'marketing',
    number: '01',
    title: '[Marketing project 01]',
    services: ['SOCIAL', 'SEO', 'ADS'],
    featuredOnHome: true,
  }),
  createPlaceholderProject({
    slug: 'marketing-project-02',
    category: 'marketing',
    number: '02',
    title: '[Marketing project 02]',
    services: ['SEO', 'CONTENT', 'EMAIL'],
  }),
  createPlaceholderProject({
    slug: 'marketing-project-03',
    category: 'marketing',
    number: '03',
    title: '[Marketing project 03]',
    services: ['ADS', 'LANDING PAGES', 'EMAIL'],
  }),
  createPlaceholderProject({
    slug: 'marketing-project-04',
    category: 'marketing',
    number: '04',
    title: '[Marketing project 04]',
    services: ['SOCIAL', 'ADS', 'ANALYTICS'],
  }),
];

/**
 * Featured projects shown on the Home page Selected Work section,
 * derived from `ALL_PROJECTS` so there is one source of truth.
 */
export const PROJECTS_CONTENT: ProjectItem[] = ALL_PROJECTS.filter(
  (project) => project.featuredOnHome,
).map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, '0'),
}));

export function getCategoryBySlug(slug: string): WorkCategory | undefined {
  return WORK_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getProjectsByCategory(category: WorkCategorySlug): ProjectItem[] {
  return ALL_PROJECTS.filter((project) => project.category === category);
}

export function getProjectBySlug(
  category: WorkCategorySlug,
  slug: string,
): ProjectItem | undefined {
  return ALL_PROJECTS.find(
    (project) => project.category === category && project.slug === slug,
  );
}

export function getNextCategory(currentSlug: WorkCategorySlug): WorkCategory {
  const idx = WORK_CATEGORIES.findIndex((cat) => cat.slug === currentSlug);
  const nextIdx = (idx + 1) % WORK_CATEGORIES.length;
  return WORK_CATEGORIES[nextIdx] ?? WORK_CATEGORIES[0]!;
}

export function getNextProjectInCategory(
  category: WorkCategorySlug,
  currentSlug: string,
): ProjectItem {
  const list = getProjectsByCategory(category);
  const idx = list.findIndex((item) => item.slug === currentSlug);
  const nextIdx = (idx + 1) % list.length;
  return list[nextIdx] ?? list[0]!;
}
