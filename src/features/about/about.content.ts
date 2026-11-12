import { SITE_CONTENT } from '@/content/site';

export interface FounderChapter {
  marker: string;
  label: string;
  text: string;
  /** Optional portrait image source for this chapter pair */
  imageSrc?: string;
  imageAlt?: string;
}

export interface FounderQuickFact {
  label: string;
  value: string;
  withStatusDot?: boolean;
}

export interface DrivingPillar {
  id: 'vision' | 'mission' | 'goal';
  railLabel: string;
  title: string;
  statement: string;
}

export interface StudioValue {
  number: string;
  word: string;
  description: string;
}

export interface WhyUsStatement {
  number: string;
  headline: string;
  body: string;
}

export interface TeamMemberProfile {
  name: string;
  role: string;
  location?: string;
}

export interface ReachRegion {
  id: string;
  name: string;
  overlapHours: string;
}

export const ABOUT_CONTENT = {
  seo: {
    title: 'About Iseoluwa | Our Story, Vision and Founder',
    description:
      'Meet the studio that treats every project as work done with care. Learn our vision, mission, values, and the founder behind Iseoluwa.',
    path: '/about',
  },

  hero: {
    label: 'ABOUT',
    headline: 'Work done with care, from start to finish.',
    intro:
      'Iseoluwa is a brand, web, and marketing studio working with businesses in Africa, Europe, and the Americas. We exist for one reason: to give growing businesses a single, dependable team that does the work properly.',
    scrollCue: 'Scroll to explore',
  },

  theName: {
    sectionLabel: '01 / THE NAME',
    fullWordmark: 'iséoluwa',
    parts: [
      {
        part: 'isé',
        meaningPrefix: 'means',
        meaning: 'work.',
      },
      {
        part: 'oluwa',
        meaningPrefix: 'means',
        meaning: 'the Lord.',
      },
    ],
    statement:
      'Iseoluwa means "the work of God." It is the standard we hold ourselves to. We dot every i, cross every t, and iron out every rough edge, because we treat every project as work done unto the Lord.',
    // TODO: Confirm phonetic pronunciation with founder
    pronunciation: '[Pronunciation: ee-sheh-oh-loo-wah]',
  },

  founderSection: {
    sectionLabel: '02 / THE FOUNDER',
    heading: `Meet ${SITE_CONTENT.founder.displayName}`,
    backdropWordmark: 'iséoluwa',
    cursorLabel: 'Hello',
    portrait: {
      placeholderLabel: 'FOUNDER PORTRAIT 4:5',
      // TODO: Art direction note for founder portrait: natural light, plain neutral background, mid-shot, relaxed and confident.
      // Add up to 3 image paths below (`images: ['/images/founder-1.avif', ...]`) or `videoSrc` for a short silent LoopVideo.
      images: [] as string[],
      videoSrc: undefined as string | undefined,
      videoPoster: undefined as string | undefined,
    },
    quickFacts: [
      { label: 'ROLE', value: SITE_CONTENT.founder.title },
      { label: 'FOCUS', value: 'Brand · Web · Growth' },
      // TODO: Replace `[Base city, country]` in `src/content/site.ts`
      { label: 'BASED', value: SITE_CONTENT.founder.base },
      { label: 'WORKS ACROSS', value: 'Africa, Europe, the Americas' },
      { label: 'STATUS', value: SITE_CONTENT.statusText, withStatusDot: true },
    ] satisfies FounderQuickFact[],
    // Draft copy — starting point for the founder to edit in his own voice
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
    ] satisfies FounderChapter[],
    pullQuote: {
      // TODO: Draft quote to be edited by the founder in his own voice
      quote:
        '\u201CGood work is quiet. You notice it when everything fits and nothing gets in your way. That is what we build for every client.\u201D',
      authorName: SITE_CONTENT.founder.fullName,
      authorTitle: `${SITE_CONTENT.founder.title} · ${SITE_CONTENT.founder.roles.join(' · ')}`,
    },
    reachMe: {
      headline: 'Want to reach me directly?',
      portfolioCta: {
        label: 'View my portfolio',
        href: SITE_CONTENT.founder.portfolioUrl,
      },
      emailCta: {
        label: 'Email me',
        email: SITE_CONTENT.founder.email,
        copyLabel: 'Copy email',
        copiedLabel: 'Copied',
      },
      whatsappCta: {
        label: 'Message on WhatsApp',
        href: SITE_CONTENT.founder.whatsappHref,
      },
      bookingCta: {
        label: 'Book a call with me',
        href: SITE_CONTENT.founder.bookingUrl || '/contact',
      },
      reassurance: 'I reply within one business day.',
    },
  },

  whatDrivesUs: {
    sectionLabel: '03 / WHAT DRIVES US',
    railSeparator: '·',
    pillars: [
      {
        id: 'vision',
        railLabel: 'VISION',
        title: 'Vision',
        statement:
          'To become the most trusted one-stop multimedia partner for businesses across the world, bringing together digital and creative services under one roof, from brand and web to photography, video, and beyond.',
      },
      {
        id: 'mission',
        railLabel: 'MISSION',
        title: 'Mission',
        statement:
          'To help businesses launch and grow with confidence by delivering excellent brand, web, and marketing work through one coordinated team, at fair and transparent prices.',
      },
      {
        id: 'goal',
        railLabel: 'GOAL',
        title: 'Goal',
        statement:
          'To build a studio that clients return to and recommend. In the near term, that means delivering outstanding work for every client, growing a strong portfolio, and building recurring partnerships. Over time, we will add new services such as photography, videography, and cloud engineering as our clients need them.',
      },
    ] satisfies DrivingPillar[],
  },

  values: {
    sectionLabel: '04 / OUR VALUES',
    headline: 'How we work.',
    items: [
      {
        number: '01',
        word: 'Excellence',
        description: 'We finish work properly and check it twice.',
      },
      {
        number: '02',
        word: 'Integrity',
        description: 'Honest quotes, honest timelines, honest advice.',
      },
      {
        number: '03',
        word: 'Clarity',
        description: 'Plain language, clear scope, no surprises.',
      },
      {
        number: '04',
        word: 'Partnership',
        description: 'Your success is our success, so we stay involved after launch.',
      },
      {
        number: '05',
        word: 'Craft',
        description: 'Beautiful and functional are not opposites.',
      },
    ] satisfies StudioValue[],
  },

  whyUs: {
    sectionLabel: '05 / WHY US',
    headline: 'What makes us different.',
    items: [
      {
        number: '01',
        headline: 'One team, one invoice.',
        body: 'Brand, web, and marketing working together, not in separate silos.',
      },
      {
        number: '02',
        headline: 'Fixed prices, clear timelines.',
        body: 'You know the cost and the date before we start.',
      },
      {
        number: '03',
        headline: 'Built by an engineer and designer.',
        body: 'The people who design your site are the same people who build it.',
      },
      {
        number: '04',
        headline: 'Support after launch.',
        body: 'We stay and help you grow.',
      },
    ] satisfies WhyUsStatement[],
  },

  widerNetwork: {
    sectionLabel: '06 / THE NETWORK',
    headline: 'A small core, a trusted network.',
    body: 'We work with a vetted network of designers, developers, and marketers, which lets us deliver quickly without losing quality. Every project is led by the founder and checked against the same standard.',
    rolesLine: ['DESIGNERS', 'DEVELOPERS', 'MARKETERS', '[MORE SOON]'],
    // Do not invent team members. Render profile cards only when entries exist.
    team: [] as TeamMemberProfile[],
  },

  whereWeWork: {
    sectionLabel: '07 / REACH',
    body: 'We work with clients worldwide through video calls, shared project boards, and email, and we agree meeting times that suit your time zone.',
    regions: [
      // TODO: Replace `[Overlap hours]` placeholders with actual studio overlap hours per region
      {
        id: 'africa',
        name: 'Africa',
        overlapHours: '[Overlap hours: 09:00 – 18:00 WAT / CAT]',
      },
      {
        id: 'europe',
        name: 'Europe',
        overlapHours: '[Overlap hours: 09:00 – 18:00 GMT / CET]',
      },
      {
        id: 'americas',
        name: 'the Americas',
        overlapHours: '[Overlap hours: 08:00 – 14:00 EST / PST]',
      },
    ] satisfies ReachRegion[],
  },

  theStandard: {
    sectionLabel: '08 / THE STANDARD',
    slogan: SITE_CONTENT.sloganFull,
  },

  closingCta: {
    sectionLabel: '09 / LET\u2019S TALK',
    headline: 'Ready to build something excellent?',
    body: 'Tell us about your project. We reply within one business day.',
    primaryCta: {
      label: 'Start a project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Book a free 20-minute call',
      href: '/contact#book-call',
    },
    cursorLabel: 'Talk',
  },
} as const;
