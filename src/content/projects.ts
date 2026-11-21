import { SHOW_SAMPLE_PROJECTS } from '@/config/site';
import type {
  ProjectItem,
  ProjectKind,
  ProjectMediaSlot,
  ProjectPhotoCredit,
  WorkCategory,
  WorkCategorySlug,
} from '@/types/work';

export type {
  ProjectItem,
  ProjectKind,
  ProjectMediaSlot,
  ProjectPhotoCredit,
  WorkCategory,
  WorkCategorySlug,
};

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

const DEFAULT_BLUR_DATA_URL =
  'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAkAAUAmJaQAA3AA/vuUAAA=';

interface ConceptProjectParams {
  slug: string;
  category: WorkCategorySlug;
  number: string;
  title: string;
  services: string[];
  result: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  featured?: boolean;
  hasVideoLoop?: boolean;
  credits: ProjectPhotoCredit[];
}

function createConceptProject(params: ConceptProjectParams): ProjectItem {
  const basePath = `/media/concepts/${params.slug}`;

  const heroSlot: ProjectMediaSlot = {
    type: 'image',
    src: `${basePath}/hero.webp`,
    blurDataURL: DEFAULT_BLUR_DATA_URL,
    label: `${params.title.toUpperCase()} · HERO 16:9`,
    aspectRatio: '16/9',
    alt: `${params.title} concept hero showcase`,
  };

  const gallerySlots: ProjectMediaSlot[] = [
    params.hasVideoLoop
      ? {
          type: 'video',
          src: `${basePath}/loop.webm`,
          poster: `${basePath}/gallery-01.webp`,
          blurDataURL: DEFAULT_BLUR_DATA_URL,
          label: `${params.title.toUpperCase()} · MOTION WALKTHROUGH 16:9`,
          aspectRatio: '16/9',
          alt: `${params.title} interactive walkthrough loop`,
          layout: 'full',
        }
      : {
          type: 'image',
          src: `${basePath}/gallery-01.webp`,
          blurDataURL: DEFAULT_BLUR_DATA_URL,
          label: `${params.title.toUpperCase()} · SYSTEM OVERVIEW 16:9`,
          aspectRatio: '16/9',
          alt: `${params.title} system overview`,
          layout: 'full',
        },
    {
      type: 'image',
      src: `${basePath}/gallery-02.webp`,
      blurDataURL: DEFAULT_BLUR_DATA_URL,
      label: `${params.title.toUpperCase()} · APPLICATION DETAIL 4:5`,
      aspectRatio: '4/5',
      alt: `${params.title} application detail`,
      layout: 'offset-right',
    },
  ];

  return {
    slug: params.slug,
    category: params.category,
    kind: 'concept',
    number: params.number,
    title: params.title,
    year: '2026',
    services: params.services,
    client: `${params.title} (concept)`,
    role: params.services.join(' • '),
    result: params.result,
    summary: params.summary,
    challenge: params.challenge,
    approach: params.approach,
    outcome: params.outcome,
    isConcept: true,
    featured: params.featured ?? false,
    featuredOnHome: params.featured ?? false,
    href: `/work/${params.category}/${params.slug}`,
    media: {
      ...heroSlot,
      hero: heroSlot,
      gallery: gallerySlots,
    },
    credits: params.credits,
  };
}

interface WebsiteProjectParams {
  slug: string;
  kind: 'real' | 'sample';
  number: string;
  title: string;
  services: string[];
  client?: string;
  role?: string;
  year?: string;
  liveUrl?: string;
  summary: string;
  highlights?: string[];
  builtWith?: string[];
  featured?: boolean;
}

function createWebsiteProject(params: WebsiteProjectParams): ProjectItem {
  const basePath = `/media/projects/${params.slug}`;

  const heroSlot: ProjectMediaSlot = {
    type: 'image',
    src: `${basePath}/hero.webp`,
    blurDataURL: DEFAULT_BLUR_DATA_URL,
    label: `${params.title.toUpperCase()} · HERO 16:9`,
    aspectRatio: '16/9',
    alt:
      params.kind === 'real'
        ? `${params.title} live website showcase`
        : `${params.title} sample layout showcase`,
  };

  const gallerySlots: ProjectMediaSlot[] = [
    {
      type: 'image',
      src: `${basePath}/gallery-1.webp`,
      blurDataURL: DEFAULT_BLUR_DATA_URL,
      label: `${params.title.toUpperCase()} · MOBILE SCREENS 4:5`,
      aspectRatio: '4/5',
      alt: `${params.title} mobile interface views`,
      layout: 'offset-left',
    },
    {
      type: 'image',
      src: `${basePath}/gallery-2.webp`,
      blurDataURL: DEFAULT_BLUR_DATA_URL,
      label: `${params.title.toUpperCase()} · PAGE SECTIONS 16:9`,
      aspectRatio: '16/9',
      alt: `${params.title} desktop section view`,
      layout: 'full',
    },
  ];

  return {
    slug: params.slug,
    category: 'websites',
    kind: params.kind,
    number: params.number,
    title: params.title,
    year: params.year,
    services: params.services,
    client: params.client,
    role: params.role,
    liveUrl: params.liveUrl,
    builtWith: params.builtWith,
    highlights: params.highlights,
    result: params.summary,
    summary: params.summary,
    isConcept: false,
    featured: params.featured ?? false,
    featuredOnHome: params.featured ?? false,
    href: `/work/websites/${params.slug}`,
    media: {
      ...heroSlot,
      hero: heroSlot,
      gallery: gallerySlots,
    },
  };
}

/**
 * Single source of truth for all studio projects across Branding, Websites, and Marketing.
 * Websites category contains 4 real websites built by Iséoluwa + 2 clearly labelled sample layouts.
 */
export const ALL_PROJECTS: ProjectItem[] = [
  // =========================================================================
  // 01 / BRANDING (4 Concept Projects)
  // =========================================================================
  createConceptProject({
    slug: 'ayo-roasters',
    category: 'branding',
    number: '01',
    title: 'Ayo Roasters',
    services: ['LOGO', 'PACKAGING', 'MENU', 'TOTE'],
    featured: true,
    hasVideoLoop: true,
    result: 'A tactile roast-date identity built for shelf clarity and café warmth.',
    summary:
      'Ayo Roasters is a specialty coffee roaster concept set in Victoria Island, Lagos. We designed a warm terracotta, deep espresso, and unbleached cream visual system spanning whole-bean pouches, café menus, and heavyweight canvas totes.',
    challenge:
      'Specialty coffee packaging often leans either overly clinical or cluttered with tasting jargon. Ayo needed a system that felt unmistakably rooted in Lagos hospitality while making origin, roast profile, and brew notes effortless to read at a glance.',
    approach:
      'We paired a geometric wordmark with colour-coded roast stamps in warm terracotta (#B85338), deep espresso (#1F1511), and cream (#F6EFE6). Every bag features a modular front label that slots cleanly into café menu boards and wholesale dispatch boxes.',
    outcome:
      'A cohesive identity system ready for retail shelves, espresso bar signage, and everyday customer touchpoints.',
    credits: [
      {
        photographer: 'Iseoluwa Studio Archive & Unsplash Coffee Editorial',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/specialty-coffee-packaging',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/specialty-coffee-roaster',
      },
    ],
  }),
  createConceptProject({
    slug: 'marlo-and-finch',
    category: 'branding',
    number: '02',
    title: 'Marlo & Finch',
    services: ['WORDMARK', 'BOOKMARKS', 'SIGNAGE', 'STAMP'],
    result: 'Quiet literary craft in forest ink, warm paper, and brushed brass.',
    summary:
      'Marlo & Finch is an independent bookshop and quiet reading room concept. The identity pairs an editorial wordmark with blind-debossed bookmarks, library ex-libris stamps, and understated street signage.',
    challenge:
      'An independent bookshop needs to feel timeless without looking dusty. The visual identity had to work equally well ink-stamped inside a paperback, foiled onto a membership card, or painted onto a timber shopfront.',
    approach:
      'We built the palette around forest ink (#143328), warm book paper (#F4EFE6), and muted brass (#C29B48). A custom ampersand monogram anchors the reading room passes, woven bookmarks, and curated staff-pick belly bands.',
    outcome:
      'An unhurried, tactile print and signage system that rewards close inspection across every paper stock.',
    credits: [
      {
        photographer: 'Iseoluwa Studio Archive & Unsplash Bookshop Editorial',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/independent-bookshop',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/independent-bookshop-interior',
      },
    ],
  }),
  createConceptProject({
    slug: 'northfield-legal',
    category: 'branding',
    number: '03',
    title: 'Northfield Legal',
    services: ['MONOGRAM', 'STATIONERY', 'PITCH DECK', 'GUIDELINES'],
    result: 'Composed authority for a modern commercial law practice.',
    summary:
      'Northfield Legal is a commercial law practice advising technology and infrastructure teams. We crafted a sharp architectural monogram, cotton-stock stationery, deal pitch decks, and a comprehensive brand manual.',
    challenge:
      'Traditional law firms rely on interchangeable crests and dense layouts, while newer firms often strip away too much gravitas. Northfield wanted calm, modern authority across boardroom decks and legal briefs.',
    approach:
      'Using deep navy (#0E1B2E), slate (#5B6778), and warm ivory (#F7F6F2), we structured a strict grid system for contracts, advisory memos, and presentation slides, anchored by a precision-cut NL ligature mark.',
    outcome:
      'A disciplined identity and document architecture that keeps complex commercial briefings clear and consistent.',
    credits: [
      {
        photographer: 'Iseoluwa Studio Archive & Unsplash Architectural Editorial',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/modern-architecture-minimal',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/minimal-office-stationery',
      },
    ],
  }),
  createConceptProject({
    slug: 'sol-skin',
    category: 'branding',
    number: '04',
    title: 'Sol Skin',
    services: ['BOTTLE LABELS', 'CARTON', 'BRAND BOOK', 'SOCIAL KIT'],
    result: 'Calm botanical formulation labels designed for bathroom counter clarity.',
    summary:
      'Sol Skin is a clean botanical skincare line formulated for humid climates. We developed apothecary-inspired bottle labels, fluted outer cartons, a formulation brand book, and a launch social kit.',
    challenge:
      'Skincare buyers want ingredient transparency and routine order without reading a wall of microscopic text. Each vessel needed to state its step number, active botanicals, and time of use immediately.',
    approach:
      'We combined muted sage (#4B6353), warm sand (#EFE9DF), and deep charcoal (#1A1B19) with a numbered routine grid (01 Cleanse, 02 Balance, 03 Barrier) across frosted glass droppers and embossed cartons.',
    outcome:
      'A serene packaging and digital storytelling system that brings apothecary order to daily skincare.',
    credits: [
      {
        photographer: 'Iseoluwa Studio Archive & Unsplash Botanical Skincare',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/botanical-skincare-bottle',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/minimal-skincare-packaging',
      },
    ],
  }),

  // =========================================================================
  // 02 / WEBSITES (4 Real Websites + 2 Sample Layouts)
  // =========================================================================
  createWebsiteProject({
    slug: 'icestein-grillz',
    kind: 'real',
    number: '01',
    title: 'Icestein Grillz',
    client: 'Icestein Grillz',
    role: 'Web Design & Development',
    services: ['E-COMMERCE', 'WEB DESIGN', 'WEB DEVELOPMENT'],
    liveUrl: 'https://www.icesteinjewelers.com/',
    featured: true,
    summary:
      'Online store and custom-order experience for a Houston custom grillz and fine-jewelry atelier.',
    highlights: [
      'Product catalog across custom grillz, chains, pendants, rings, and earrings with metal-purity options (10K, 14K, 18K, 22K gold, silver, platinum) and stone choices (VVS diamond, lab diamond, moissanite).',
      'Four-step order flow: choose design, free mold kit shipped to the customer, handcrafted in Houston, insured shipping.',
      'Direct custom-inquiry and appointment paths via phone, WhatsApp, and showroom details.',
    ],
    builtWith: [
      'Responsive storefront layout',
      'Custom product options',
      'Catalog filtering',
      'Direct inquiry flow',
    ],
  }),
  createWebsiteProject({
    slug: 'crtx-nutrition',
    kind: 'real',
    number: '02',
    title: 'CRTX Nutrition',
    client: 'CRTX Nutrition',
    role: 'Web Design & Development',
    services: ['E-COMMERCE', 'LANDING PAGE', 'PRODUCT STORE'],
    liveUrl: 'https://crtxnutrition.com/',
    summary:
      'Direct-to-consumer storefront for a single-SKU cognitive supplement, with product breakdown, ingredient story, and bundle ordering.',
    highlights: [
      'Focused single-product layout built around clarity, ingredient breakdown, and usage guidance.',
      'Multi-pack bundle selector (1-pack, 2-pack, 3-pack) with direct checkout.',
      'Structured FAQ, guarantee, and customer-review sections.',
    ],
    builtWith: [
      'Responsive single-product storefront',
      'Bundle pricing selector',
      'Conversion-focused product page',
    ],
  }),
  createWebsiteProject({
    slug: 'divathea',
    kind: 'real',
    number: '03',
    title: 'Divathea',
    client: 'Divathea',
    role: 'Web Design & Development',
    services: ['WEB DESIGN', 'WEB DEVELOPMENT'],
    liveUrl: 'https://divathea.com/',
    summary: 'A website designed and built for Divathea.',
    highlights: [],
    builtWith: [],
  }),
  createWebsiteProject({
    slug: 'richard-portfolio',
    kind: 'real',
    number: '04',
    title: 'Richard: Web Designer & Developer',
    client: 'Richard (Iséoluwa founder)',
    role: 'Design & Full-Stack Engineering',
    services: ['PORTFOLIO', 'INTERACTIVE WEB', 'FULL-STACK'],
    liveUrl: 'https://senpaididit.vercel.app/',
    summary:
      'Personal portfolio of Iséoluwa’s founder, showcasing full-stack web builds across React, Next.js, TypeScript, and WordPress.',
    highlights: [
      'Project showcase spanning e-commerce, hospitality, publishing, and service businesses.',
      'Interactive section layout with custom motion and live project previews.',
      'Direct contact flow with email, phone, and inquiry form.',
    ],
    builtWith: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion'],
  }),
  createWebsiteProject({
    slug: 'sample-wine-vineyard',
    kind: 'sample',
    number: '05',
    title: 'Wine and vineyard website',
    services: ['SAMPLE LAYOUT', 'E-COMMERCE', 'HOSPITALITY'],
    summary: 'A sample layout shown while real projects are being added.',
    highlights: [],
    builtWith: [],
  }),
  createWebsiteProject({
    slug: 'sample-fashion-store',
    kind: 'sample',
    number: '06',
    title: 'Fashion store website',
    services: ['SAMPLE LAYOUT', 'E-COMMERCE', 'RETAIL'],
    summary: 'A sample layout shown while real projects are being added.',
    highlights: [],
    builtWith: [],
  }),

  // =========================================================================
  // 03 / MARKETING (4 Concept Projects)
  // =========================================================================
  createConceptProject({
    slug: 'fresh-basket',
    category: 'marketing',
    number: '01',
    title: 'Fresh Basket',
    services: ['LAUNCH GRID', 'STORY ADS', 'OOH POSTER', 'REFERRAL CARD'],
    featured: true,
    hasVideoLoop: true,
    result: 'A coordinated neighbourhood launch system for same-day farm-to-door grocery delivery.',
    summary:
      'Fresh Basket is a same-day fresh produce delivery service launching across Lagos neighbourhoods. We created a 9-post social launch grid, vertical story ad templates, roadside OOH posters, and an in-bag neighbour referral card.',
    challenge:
      'Busy households ordering groceries online care most about produce freshness and reliable delivery windows. The campaign needed to feel harvest-fresh and local across Instagram, WhatsApp broadcasts, and street-level posters.',
    approach:
      'Built around market green (#1F7A4C), sun citrus (#F2B705), and warm cream (#FAF7F0), we designed a modular campaign system highlighting harvest-to-door time stamps, seasonal crate bundles, and a simple shareable referral code.',
    outcome:
      'A unified multi-channel launch kit that connects digital social ads directly to doorstep unboxing.',
    credits: [
      {
        photographer: 'Unsplash Fresh Produce & Market Editorial',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/fresh-vegetables-market',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/organic-produce-basket',
      },
    ],
  }),
  createConceptProject({
    slug: 'pulse-fitness',
    category: 'marketing',
    number: '02',
    title: 'Pulse Fitness',
    services: ['PAID SOCIAL', 'CLASS SCHEDULE', 'LANDING HERO', 'EMAIL HEADER'],
    result: 'High-energy new-year membership campaign built around structured strength and conditioning.',
    summary:
      'Pulse Fitness is a boutique strength and conditioning studio concept. We produced a new-year membership campaign spanning paid social carousels, weekly class schedule graphics, a conversion landing hero, and onboarding email headers.',
    challenge:
      'January gym campaigns often rely on guilt-driven clichés that fade by February. Pulse wanted an empowering, coach-led campaign focused on consistency, small-group programming, and clear class times.',
    approach:
      'Pairing pitch black (#0B0B0B), electric lime (#C6F91F), and crisp white (#FFFFFF), we built bold typographic motion frames, coach spotlight cards, and a direct 14-day trial pass funnel.',
    outcome:
      'A sharp, kinetic campaign kit that keeps paid ads, Instagram stories, and member emails visually locked together.',
    credits: [
      {
        photographer: 'Unsplash Athletic & Studio Training Collection',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/boutique-fitness-gym',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/strength-training-studio',
      },
    ],
  }),
  createConceptProject({
    slug: 'studio-rue',
    category: 'marketing',
    number: '03',
    title: 'Studio Rue',
    services: ['REEL COVERS', 'COUNTDOWN STORIES', 'LAUNCH EMAIL', 'PRESS KIT'],
    result: 'An editorial seasonal collection drop paced across Instagram, email, and press.',
    summary:
      'Studio Rue is a contemporary ready-to-wear fashion label. For their Autumn/Dry-Season capsule drop, we designed lookbook reel covers, 72-hour countdown stories, early-access newsletter dispatches, and a digital press card.',
    challenge:
      'Fashion drops lose momentum when social teasers, email lookbooks, and store links feel disconnected. Studio Rue needed a tightly paced 10-day rollout that preserved editorial restraint while driving waitlist sign-ups.',
    approach:
      'Using deep espresso (#231B17), warm stone (#EDE6DC), and burnt rust (#A44A2E), we sequenced numbered garment study frames, fabric close-up stories, and a private showroom RSVP pass.',
    outcome:
      'A cohesive capsule launch playbook that turns a seasonal lookbook into a paced multi-channel event.',
    credits: [
      {
        photographer: 'Unsplash Contemporary Fashion Lookbook',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/minimal-fashion-editorial',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/linen-fashion-lookbook',
      },
    ],
  }),
  createConceptProject({
    slug: 'brightpath-academy',
    category: 'marketing',
    number: '04',
    title: 'BrightPath Academy',
    services: ['STUDENT STORIES', 'CURRICULUM CAROUSEL', 'WEBINAR INVITE', 'AD VARIANTS'],
    result: 'A clear, outcome-focused cohort enrolment campaign for a tech skills school.',
    summary:
      'BrightPath Academy runs intensive product design and software engineering cohorts. We built their quarterly admissions campaign featuring student project spotlights, syllabus carousels, live Q&A invites, and paid ad variants.',
    challenge:
      'Prospective students are rightly sceptical of exaggerated bootcamp promises. BrightPath wanted a transparent campaign that showed real weekly syllabus milestones, mentor office hours, and capstone portfolios.',
    approach:
      'Set in deep blue (#102542), sky (#D9ECFF), and warm coral (#E85D4A), we structured week-by-week curriculum breakdowns, alumni project cards, and open-house registration assets.',
    outcome:
      'An honest, structured enrolment campaign that helps career switchers evaluate the programme with confidence.',
    credits: [
      {
        photographer: 'Unsplash Collaborative Learning & Tech Collection',
        source: 'Unsplash',
        url: 'https://unsplash.com/s/photos/design-workshop-team',
        unsplashSearchUrl: 'https://unsplash.com/s/photos/software-engineering-student',
      },
    ],
  }),
];

const KIND_PRIORITY: Record<ProjectKind, number> = {
  real: 0,
  concept: 1,
  sample: 2,
};

/**
 * Filters out `kind === "sample"` entries when `SHOW_SAMPLE_PROJECTS` is false,
 * and orders `kind === "real"` projects before `concept` and `sample`.
 */
export function getVisibleProjects(projects: ProjectItem[] = ALL_PROJECTS): ProjectItem[] {
  return projects
    .filter((p) => (p.kind === 'sample' ? SHOW_SAMPLE_PROJECTS : true))
    .slice()
    .sort((a, b) => KIND_PRIORITY[a.kind] - KIND_PRIORITY[b.kind]);
}

/**
 * All 4 real websites built by Iséoluwa (`kind === 'real'`).
 */
export const REAL_WEBSITE_PROJECTS: ProjectItem[] = ALL_PROJECTS.filter(
  (project) => project.category === 'websites' && project.kind === 'real',
);

/**
 * Featured projects shown on the Home page Selected Work section,
 * derived from `ALL_PROJECTS` (`ayo-roasters`, `icestein-grillz`, `fresh-basket`).
 */
export const PROJECTS_CONTENT: ProjectItem[] = ALL_PROJECTS.filter(
  (project) => project.featured,
).map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, '0'),
}));

function normalizeCategorySlug(slug: string): string {
  if (slug === 'web-design') return 'websites';
  if (slug === 'digital-marketing') return 'marketing';
  return slug;
}

export function getCategoryBySlug(slug: string): WorkCategory | undefined {
  const normalized = normalizeCategorySlug(slug);
  return WORK_CATEGORIES.find((cat) => cat.slug === normalized);
}

export function getProjectsByCategory(category: WorkCategorySlug | string): ProjectItem[] {
  const normalized = normalizeCategorySlug(category);
  const filtered = ALL_PROJECTS.filter((project) => project.category === normalized);
  return getVisibleProjects(filtered).map((project, idx) => ({
    ...project,
    number: String(idx + 1).padStart(2, '0'),
  }));
}

export function getProjectBySlug(
  category: WorkCategorySlug | string,
  slug: string,
): ProjectItem | undefined {
  const normalized = normalizeCategorySlug(category);
  const found = ALL_PROJECTS.find(
    (project) => project.category === normalized && project.slug === slug,
  );
  if (found && found.kind === 'sample' && !SHOW_SAMPLE_PROJECTS) {
    return undefined;
  }
  return found;
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
