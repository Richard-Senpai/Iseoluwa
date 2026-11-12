export interface ProjectMediaSlot {
  type: 'placeholder' | 'image' | 'video';
  label: string;
  aspectRatio: '16/9' | '4/5' | '1/1';
  src?: string;
  poster?: string;
  alt: string;
}

export interface ProjectItem {
  slug: string;
  number: string;
  title: string;
  services: string[];
  year: string;
  result: string;
  href: string;
  media: ProjectMediaSlot;
}

/**
 * Selected work placeholder items (Design System Section 8 & Home Prompt Section 4.5).
 * Do not invent fake clients, logos, or statistics.
 * Swapping in real images or loop videos is a data-only change here (or via Sanity in Phase 4).
 */
export const PROJECTS_CONTENT: ProjectItem[] = [
  {
    slug: 'project-one',
    number: '01',
    title: '[Project name]',
    services: ['BRAND', 'WEB'],
    year: '[Year]',
    result: '[One-line result]',
    href: '/work',
    media: {
      type: 'placeholder',
      label: 'PROJECT MEDIA 16:9',
      aspectRatio: '16/9',
      alt: 'Project 01 media placeholder',
    },
  },
  {
    slug: 'project-two',
    number: '02',
    title: '[Project name]',
    services: ['BRAND', 'WEB', 'MARKETING'],
    year: '[Year]',
    result: '[One-line result]',
    href: '/work',
    media: {
      type: 'placeholder',
      label: 'PROJECT MEDIA 16:9',
      aspectRatio: '16/9',
      alt: 'Project 02 media placeholder',
    },
  },
  {
    slug: 'project-three',
    number: '03',
    title: '[Project name]',
    services: ['WEB', 'MARKETING'],
    year: '[Year]',
    result: '[One-line result]',
    href: '/work',
    media: {
      type: 'placeholder',
      label: 'PROJECT MEDIA 16:9',
      aspectRatio: '16/9',
      alt: 'Project 03 media placeholder',
    },
  },
];
