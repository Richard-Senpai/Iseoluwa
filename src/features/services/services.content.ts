export interface StickyNavSectionItem {
  id: 'branding' | 'web' | 'marketing' | 'process' | 'packages' | 'faq';
  label: string;
  targetId: string;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
}

export interface CommunicationPromiseItem {
  id: string;
  title: string;
  detail: string;
}

export interface SharedFaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Shared 8-item FAQ data used by `/services` and `/faq` so answers stay consistent.
 */
export const SERVICES_FAQ_ITEMS: readonly SharedFaqItem[] = [
  {
    id: 'cost',
    question: 'How much does a project cost?',
    answer:
      'Single-service projects start from $800 (₦400k) for Brand-Only and $1,200 (₦450k) for Build-Only. Our complete Launch Starter package starts from $1,500 (₦750k), Launch Plus starts from $3,500 (₦1.8M), Care Plans start at $120 / month (₦180k / month), and Growth Retainers start from $600 / month (₦400k / month). Every project is quoted at a fixed price before we begin.',
  },
  {
    id: 'timeline',
    question: 'How long does a project take?',
    answer:
      'Brand-Only projects typically take 2–3 weeks, Launch Starter takes 3–4 weeks, and Launch Plus takes 6–8 weeks. Build-Only timelines depend on scope. You receive a clear schedule with review checkpoints before work starts.',
  },
  {
    id: 'payments',
    question: 'How do payments work?',
    // TODO: confirm payment split policy
    answer:
      'A 50% deposit starts the work and the remaining 50% is due on final delivery before launch. For larger scopes, we can split payments into three agreed milestones (25% / 50% / 25%). We accept both USD and NGN.',
  },
  {
    id: 'revisions',
    question: 'How many revisions do I get?',
    // TODO: confirm revision count policy
    answer:
      'Every project works through clear checkpoints — strategy, design, and build — and includes two rounds of revisions at each stage so your feedback is folded in cleanly before we move forward.',
  },
  {
    id: 'ownership',
    question: 'Will I own my files and website?',
    answer:
      'Yes. Once the final invoice is paid in full, you own 100% of your final brand files, guidelines, website design, and code.',
  },
  {
    id: 'international',
    question: 'Do you work with clients outside Nigeria?',
    answer:
      'Yes. We work with businesses across Africa, Europe, and the Americas through video calls, shared project boards, and email, scheduling check-ins around your time zone.',
  },
  {
    id: 'existing-brand-or-site',
    question: 'Can you help if I already have a brand or website?',
    answer:
      'Yes. If you already have a strong brand identity, choose Build-Only or a Growth Retainer. If you already have a website and need a brand refresh, marketing, or a Care Plan, we meet you where you are.',
  },
  {
    id: 'not-sure-which-package',
    question: 'What if I am not sure which package I need?',
    answer:
      'Choose the Custom Package or use the "Find your fit" matcher above, and we will recommend the right scope and price on a free 20-minute call.',
  },
] as const;

export const SERVICES_CONTENT = {
  seo: {
    title: 'Branding, Web Design and Marketing Services | Iseoluwa',
    description:
      'Branding, full-stack web design and development, and marketing from one team. Fixed-price packages, clear timelines, and a free 20-minute call.',
    path: '/services',
  },

  hero: {
    label: 'SERVICES',
    headline: 'Everything you need to launch and grow, in one place.',
    body: 'Choose one service or combine them. Every project has a fixed scope, a clear timeline, and a price you agree before we begin.',
    primaryCta: {
      label: 'Start a project',
      href: '/contact?source=services-hero',
    },
    secondaryCta: {
      label: 'See packages',
      href: '#packages',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },

  stickyNav: {
    ariaLabel: 'Services page sections',
    items: [
      { id: 'branding', label: 'BRANDING', targetId: 'service-branding' },
      { id: 'web', label: 'WEB', targetId: 'service-web' },
      { id: 'marketing', label: 'MARKETING', targetId: 'service-marketing' },
      { id: 'process', label: 'PROCESS', targetId: 'process' },
      { id: 'packages', label: 'PACKAGES', targetId: 'packages' },
      { id: 'faq', label: 'FAQ', targetId: 'services-faq' },
    ] satisfies StickyNavSectionItem[],
    introStatement:
      'Brand, web, and marketing from one team means your identity, your website, and your growth all pull in the same direction.',
  },

  process: {
    sectionLabel: '04 / PROCESS',
    headline: 'A clear process, so you always know what happens next.',
    steps: [
      {
        number: '01',
        title: 'Discovery call.',
        description: 'We learn about your business, goals, and budget.',
      },
      {
        number: '02',
        title: 'Proposal and deposit.',
        description:
          'You receive a fixed scope, price, and timeline. A 50% deposit starts the work.',
      },
      {
        number: '03',
        title: 'Strategy and brand.',
        description: 'We define your positioning and visual direction.',
      },
      {
        number: '04',
        title: 'Design.',
        description: 'You review designs and approve them at set checkpoints.',
      },
      {
        number: '05',
        title: 'Build and test.',
        description: 'We develop, test, and refine on every device.',
      },
      {
        number: '06',
        title: 'Launch.',
        description: 'We go live and check everything together.',
      },
      {
        number: '07',
        title: 'Handover and support.',
        description:
          'You get training and files, and can join a Care Plan or Growth Retainer.',
      },
    ] satisfies ProcessStepItem[],
    communication: {
      label: 'HOW WE COMMUNICATE',
      headline: 'Calm, structured collaboration.',
      items: [
        {
          id: 'single-lead',
          title: 'One project lead',
          detail: 'Your single point of contact from kickoff to launch.',
        },
        {
          id: 'project-board',
          title: 'Shared project board',
          detail: 'See every task, milestone, and file in one place.',
        },
        {
          id: 'weekly-update',
          title: 'Weekly progress update',
          detail: 'A clear written or video summary every week.',
        },
        {
          id: 'checkpoints',
          title: 'Agreed checkpoints',
          detail: 'Nothing moves to the next stage without your sign-off.',
        },
        {
          id: 'fast-replies',
          title: 'One-business-day replies',
          detail: 'We reply to every message within one business day.',
        },
      ] satisfies CommunicationPromiseItem[],
    },
  },

  packagesSection: {
    sectionLabel: '05 / PACKAGES',
    headline: 'Clear packages. Clear prices.',
    subtitle:
      'Every package has a fixed starting price, a clear timeline, and an honest list of what is included.',
    groups: [
      {
        id: 'launch-and-custom',
        label: 'LAUNCH & CUSTOM PACKAGES',
        title: 'Complete launch packages & custom scope',
      },
      {
        id: 'single-and-ongoing',
        label: 'SINGLE SERVICES & ONGOING CARE',
        title: 'Focused single services & monthly retainers',
      },
    ],
    bestForLabel: 'BEST FOR',
    includesLabel: 'WHAT IS INCLUDED',
    seeEverythingLabel: 'See everything included',
    hideExtraLabel: 'Show fewer items',
    matrix: {
      label: 'COMPARE PACKAGES',
      headline: 'What each package includes, side by side.',
      featureColumnHeader: 'Feature / Deliverable',
      includedSrLabel: 'Included',
      notIncludedSrLabel: 'Not included',
      notIncludedSymbol: '—',
    },
    addOns: {
      label: 'ADD-ONS',
      headline: 'Need a little more? Add only what your project requires.',
    },
    terms: {
      label: 'PLAIN-LANGUAGE TERMS',
      headline: 'How payments, revisions, and ownership work.',
      termsLinkLabel: 'Read full Terms of Service',
      termsLinkHref: '/terms',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },

  faq: {
    sectionLabel: '06 / QUESTIONS',
    headline: 'Common questions about our services and packages.',
    seeAllLabel: 'See all questions',
    seeAllHref: '/faq',
    items: SERVICES_FAQ_ITEMS,
  },
} as const;
