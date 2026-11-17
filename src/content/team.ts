import { SITE_CONTENT } from '@/content/site';
import { TEAM_PORTRAIT_BLUR } from '@/content/team-blur';
import type { TeamMember } from '@/types/team';

/**
 * Single source of truth for the Iséoluwa team (`src/content/team.ts`).
 * Order matters: Founder -> Co-Founder -> Developer -> Marketer and Social Media Manager.
 * All team copy lives here, never hard-coded in components.
 */
export const team: readonly TeamMember[] = [
  {
    id: 'iseoluwa',
    orderNumber: '01',
    firstName: 'Iséoluwa',
    name: 'Ojedayo Richard Iseoluwa',
    displayName: 'iséoluwa',
    role: 'Founder',
    sectionLabel: 'FOUNDER',
    railLabel: '01 ISÉOLUWA · FOUNDER',
    bio: [
      'Ojedayo Richard Iseoluwa is a software engineer, full-stack developer, product designer, and brand manager.',
      'He started Iséoluwa to give businesses what he found hard to get himself: one team that handles brand, build, and growth with equal care.',
    ],
    focus: ['FULL-STACK DEVELOPMENT', 'PRODUCT DESIGN', 'BRAND DIRECTION'],
    portrait: {
      src: '/media/team/iseoluwa-portrait.webp',
      avifSrc: '/media/team/iseoluwa-portrait.avif',
      srcSetWebp:
        '/media/team/iseoluwa-portrait-800.webp 800w, /media/team/iseoluwa-portrait-1600.webp 1600w',
      srcSetAvif:
        '/media/team/iseoluwa-portrait-800.avif 800w, /media/team/iseoluwa-portrait-1600.avif 1600w',
      blurDataURL: TEAM_PORTRAIT_BLUR.iseoluwa,
      alt: 'Portrait of Ojedayo Richard Iseoluwa, Founder at Iséoluwa',
      focalPoint: { x: 0.5, y: 0.42 },
      aspect: '4:5',
      placeholderLabel: 'PORTRAIT 4:5',
    },
    links: {
      // Personal links rendered only when populated; founder portfolio & studio contacts are also in Reach Me block
      portfolio: SITE_CONTENT.founder.portfolioUrl,
      // TODO: Add founder personal social links when ready
      email: '',
      linkedin: '',
      instagram: '',
      x: '',
      github: '',
      behance: '',
    },
    ctaLabel: 'Work with Iséoluwa',
    ctaHref: '/contact?source=about-iseoluwa',
    quickFacts: [
      { label: 'ROLE', value: SITE_CONTENT.founder.title },
      { label: 'FOCUS', value: 'Brand · Web · Growth' },
      { label: 'BASED', value: SITE_CONTENT.founder.base },
      { label: 'WORKS ACROSS', value: 'Africa, Europe, the Americas' },
      { label: 'STATUS', value: SITE_CONTENT.statusText, withStatusDot: true },
    ],
    chapters: [
      {
        marker: '01',
        label: 'The engineer',
        text: 'Richard builds websites end to end. He writes the code and shapes the experience, so what gets designed is exactly what gets built.',
      },
      {
        marker: '02',
        label: 'The designer',
        text: 'As a product designer, he turns ideas into interfaces that feel clear, calm, and easy to trust.',
      },
      {
        marker: '03',
        label: 'The brand manager',
        text: 'He has managed brands himself, so he knows what a good identity does for a business once it is out in the world.',
      },
      {
        marker: '04',
        label: 'Why Iseoluwa',
        text: 'He started Iseoluwa to give businesses what he found hard to get himself: one team that handles brand, build, and growth with equal care.',
      },
    ],
    note: {
      quote:
        '\u201CGood work is quiet. You notice it when everything fits and nothing gets in your way. That is what we build for every client.\u201D',
      authorName: SITE_CONTENT.founder.fullName,
      authorTitle: `${SITE_CONTENT.founder.title} · ${SITE_CONTENT.founder.roles.join(' · ')}`,
    },
  },
  {
    id: 'daniel',
    orderNumber: '02',
    firstName: 'Daniel',
    name: 'Daniel Oshinaike',
    displayName: 'Daniel',
    role: 'Co-Founder',
    sectionLabel: 'CO-FOUNDER',
    railLabel: '02 DANIEL · CO-FOUNDER',
    bio: [
      'Daniel Oshinaike is a Brand Architect, Strategic Brand Designer, and Creative Director with experience spanning brand identity development, visual communication, creative direction, and business branding.',
      // Draft paragraph for owner confirmation
      'At Iséoluwa, Daniel leads brand strategy and creative direction, shaping identities that businesses can grow into.',
    ],
    focus: [
      'BRAND IDENTITY',
      'VISUAL COMMUNICATION',
      'CREATIVE DIRECTION',
      'BUSINESS BRANDING',
    ],
    portrait: {
      src: '/media/team/daniel-portrait.webp',
      avifSrc: '/media/team/daniel-portrait.avif',
      srcSetWebp:
        '/media/team/daniel-portrait-800.webp 800w, /media/team/daniel-portrait-1600.webp 1600w',
      srcSetAvif:
        '/media/team/daniel-portrait-800.avif 800w, /media/team/daniel-portrait-1600.avif 1600w',
      blurDataURL: TEAM_PORTRAIT_BLUR.daniel,
      alt: 'Portrait of Daniel Oshinaike, Co-Founder at Iséoluwa',
      focalPoint: { x: 0.5, y: 0.48 },
      aspect: '4:5',
      placeholderLabel: 'PORTRAIT 4:5',
    },
    links: {
      // TODO: Add Daniel's personal links when ready
      portfolio: '',
      email: '',
      linkedin: '',
      instagram: '',
      x: '',
      github: '',
      behance: '',
    },
    ctaLabel: 'Work with Daniel',
    ctaHref: '/contact?source=about-daniel',
  },
  {
    id: 'maleek',
    orderNumber: '03',
    firstName: 'Maleek',
    name: 'Abdulmaleek Asimiyu',
    displayName: 'Maleek',
    role: 'Developer',
    sectionLabel: 'DEVELOPER',
    railLabel: '03 MALEEK · DEVELOPER',
    // TODO: confirm with the team member
    bio: [
      'Abdulmaleek Asimiyu is the developer at Iséoluwa. He turns approved designs into fast, reliable websites and web applications, and cares about code that is clean, secure, and easy to maintain.',
      'He works closely with the design team, so what is designed is exactly what gets built.',
    ],
    focus: ['WEBSITES', 'WEB APPLICATIONS', 'CLEAN CODE'],
    portrait: {
      src: '/media/team/maleek-portrait.webp',
      avifSrc: '/media/team/maleek-portrait.avif',
      srcSetWebp:
        '/media/team/maleek-portrait-800.webp 800w, /media/team/maleek-portrait-1600.webp 1600w',
      srcSetAvif:
        '/media/team/maleek-portrait-800.avif 800w, /media/team/maleek-portrait-1600.avif 1600w',
      blurDataURL: TEAM_PORTRAIT_BLUR.maleek,
      alt: 'Portrait of Abdulmaleek Asimiyu, Developer at Iséoluwa',
      focalPoint: { x: 0.48, y: 0.44 },
      aspect: '4:5',
      placeholderLabel: 'PORTRAIT 4:5',
    },
    links: {
      // TODO: Add Maleek's personal links when ready
      portfolio: '',
      email: '',
      linkedin: '',
      instagram: '',
      x: '',
      github: '',
      behance: '',
    },
    ctaLabel: 'Work with Maleek',
    ctaHref: '/contact?source=about-maleek',
  },
  {
    id: 'jessica',
    orderNumber: '04',
    firstName: 'Jessica',
    name: 'Jessica Omotayo',
    displayName: 'Jessica',
    role: 'Marketer and Social Media Manager',
    sectionLabel: 'MARKETING',
    railLabel: '04 JESSICA · MARKETING',
    // TODO: confirm with the team member
    bio: [
      "Jessica Omotayo is Iséoluwa's marketer and social media manager. Jessica helps brands find their audience, plan content people want to follow, and turn attention into customers through social media and campaigns.",
      'Jessica makes sure every brand we build is heard as clearly as it looks.',
    ],
    focus: ['SOCIAL MEDIA', 'CONTENT STRATEGY', 'CAMPAIGNS', 'AUDIENCE GROWTH'],
    portrait: {
      src: '/media/team/jessica-portrait.webp',
      avifSrc: '/media/team/jessica-portrait.avif',
      srcSetWebp:
        '/media/team/jessica-portrait-800.webp 800w, /media/team/jessica-portrait-1600.webp 1600w',
      srcSetAvif:
        '/media/team/jessica-portrait-800.avif 800w, /media/team/jessica-portrait-1600.avif 1600w',
      blurDataURL: TEAM_PORTRAIT_BLUR.jessica,
      alt: 'Portrait of Jessica Omotayo, Marketer and Social Media Manager at Iséoluwa',
      focalPoint: { x: 0.5, y: 0.38 },
      aspect: '4:5',
      placeholderLabel: 'PORTRAIT 4:5',
    },
    links: {
      // TODO: Add Jessica's personal links when ready
      portfolio: '',
      email: '',
      linkedin: '',
      instagram: '',
      x: '',
      github: '',
      behance: '',
    },
    ctaLabel: 'Work with Jessica',
    ctaHref: '/contact?source=about-jessica',
  },
] as const;

export const TEAM = team;

export const TEAM_STORY_CONTENT = {
  sectionIndexPrefix: '02 /',
  totalCountFormatted: '04',
  skipLabel: 'Skip team',
  skipTargetId: 'what-drives-us',
  cursorLabel: 'Hello',
  railAriaLabel: 'Team members',
  chaptersAriaLabel: 'Founder story chapters',
  focusHeadingLabel: 'FOCUS',
  founderHeadingPrefix: 'Meet',
  linkLabels: {
    portfolio: 'Portfolio',
    email: 'Email',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    x: 'X',
    github: 'GitHub',
    behance: 'Behance',
  },
} as const;
