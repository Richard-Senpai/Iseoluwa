export interface ServiceRowItem {
  number: string;
  title: string;
  headline: string;
  description: string;
  tags: string[];
  previewLabel: string;
  previewSrc?: string;
}

export interface WhyReasonItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  company: string;
  country: string;
}

export interface HomeContent {
  hero: {
    status: string;
    eyebrow: string[];
    headline: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    reassurance: string;
    bottomLeftTagline: string;
    scrollCue: string;
    regionsLine: string;
    rippleHintAria: string;
  };
  statement: {
    text: string;
  };
  soundFamiliar: {
    sectionLabel: string;
    headline: string;
    problems: string[];
    closingStatement: string;
  };
  whatWeDo: {
    sectionLabel: string;
    headline: string;
    services: ServiceRowItem[];
    exploreLink: { label: string; href: string };
  };
  selectedWork: {
    sectionLabel: string;
    headline: string;
    cursorLabel: string;
    viewAllCta: { label: string; href: string };
    startProjectCta: { label: string; href: string };
    reassurance: string;
  };
  whyIseoluwa: {
    sectionLabel: string;
    headline: string;
    reasons: WhyReasonItem[];
  };
  howItWorks: {
    sectionLabel: string;
    headline: string;
    steps: ProcessStepItem[];
    cta: { label: string; href: string };
    reassurance: string;
  };
  faq: {
    sectionLabel: string;
    headline: string;
    items: FaqItem[];
    seeAllLink: { label: string; href: string };
  };
  testimonials: {
    sectionLabel: string;
    headline: string;
    items: TestimonialItem[];
  };
  closingCta: {
    sectionLabel: string;
    headline: string;
    cursorLabel: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    whatsappCta: { label: string };
    reassurance: string;
  };
}

export const HOME_CONTENT: HomeContent = {
  hero: {
    status: 'Available for new projects',
    eyebrow: ['BRAND', 'BUILD', 'GROW'],
    headline: 'One team for your brand, website, and growth.',
    subheadline:
      'We help businesses launch and grow online with a clear identity, a website that works, and marketing that brings in customers. One brief. One team. One invoice.',
    primaryCta: {
      label: 'Start a project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'See our work',
      href: '#selected-work',
    },
    reassurance: 'Free 20-minute call. No obligation.',
    bottomLeftTagline: 'Every detail. Done with excellence.',
    scrollCue: 'Scroll to explore',
    regionsLine: 'Working with clients in Africa, Europe, and the Americas.',
    rippleHintAria: 'Interactive wave canvas',
  },
  statement: {
    text: 'Most businesses spend months juggling a designer, a developer, and a marketer who never speak to each other. We put all three in one team, so your brand, your website, and your growth finally work as one.',
  },
  soundFamiliar: {
    sectionLabel: '01 / THE PROBLEM',
    headline: 'Sound familiar?',
    problems: [
      'Your designer, developer, and marketer have never spoken to each other.',
      'Your brand looks different on your website, your social pages, and your invoices.',
      'Deadlines slip and nobody takes responsibility.',
      'You paid for a website, then nobody helped you get customers.',
    ],
    closingStatement: 'There is a better way. Put everything in one set of capable hands.',
  },
  whatWeDo: {
    sectionLabel: '02 / WHAT WE DO',
    headline: 'Three services. One team.',
    services: [
      {
        number: '01',
        title: 'Brand',
        headline: 'Look like the business you want to be',
        description:
          'Strategy, logo, and a complete visual identity that people remember and trust.',
        tags: ['STRATEGY', 'IDENTITY', 'GUIDELINES'],
        previewLabel: 'BRAND PREVIEW 4:5',
        previewSrc: '/images/work/branding/branding-01.png',
      },
      {
        number: '02',
        title: 'Build',
        headline: 'A website built to work as hard as you do',
        description:
          'Fast, beautiful, full-stack websites and web apps, designed and built by the same team.',
        tags: ['UI/UX', 'WEB DEVELOPMENT', 'E-COMMERCE'],
        previewLabel: 'BUILD PREVIEW 4:5',
      },
      {
        number: '03',
        title: 'Grow',
        headline: 'Turn attention into customers',
        description:
          'Social media, SEO, ads, and email that bring the right people to your door.',
        tags: ['SOCIAL', 'SEO', 'ADS', 'EMAIL'],
        previewLabel: 'GROW PREVIEW 4:5',
      },
    ],
    exploreLink: {
      label: 'Explore all services',
      href: '/services',
    },
  },
  selectedWork: {
    sectionLabel: '03 / SELECTED WORK',
    headline: 'Work we are proud of.',
    cursorLabel: 'View',
    viewAllCta: {
      label: 'View all work',
      href: '/work',
    },
    startProjectCta: {
      label: 'Start a project',
      href: '/contact',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },
  whyIseoluwa: {
    sectionLabel: '04 / WHY ISÉOLUWA',
    headline: 'Why work with us.',
    reasons: [
      {
        number: '01',
        title: 'One team, one invoice.',
        description: 'Brand, web, and marketing working together, not in separate silos.',
      },
      {
        number: '02',
        title: 'Fixed prices, clear timelines.',
        description: 'You know the cost and the date before we start.',
      },
      {
        number: '03',
        title: 'Built by an engineer and designer.',
        description: 'The people who design your site are the same people who build it.',
      },
      {
        number: '04',
        title: 'Support after launch.',
        description: 'We stay and help you grow.',
      },
      {
        number: '05',
        title: 'Care in every detail.',
        description: 'If it is not right, it is not done.',
      },
    ],
  },
  howItWorks: {
    sectionLabel: '05 / HOW IT WORKS',
    headline: 'A clear process, so you always know what happens next.',
    steps: [
      {
        number: '01',
        title: 'Talk.',
        description: 'A free 20-minute call to understand your business and goals.',
      },
      {
        number: '02',
        title: 'Plan.',
        description: 'A fixed scope, price, and timeline. A 50% deposit starts the work.',
      },
      {
        number: '03',
        title: 'Create.',
        description: 'Strategy, design, and build, with your approval at every checkpoint.',
      },
      {
        number: '04',
        title: 'Launch and grow.',
        description: 'We go live together, then stay to help you grow.',
      },
    ],
    cta: {
      label: 'Book a free call',
      href: '/contact?intent=call',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },
  faq: {
    sectionLabel: '07 / QUESTIONS',
    headline: 'Questions we often hear.',
    items: [
      {
        id: 'cost',
        question: 'How much does a project cost?',
        answer:
          'Our packages start from $800 for branding and $1,200 for a website, with Launch Starter at $1,500. The final price depends on scope, and you will see a fixed quote before you pay anything.',
      },
      {
        id: 'timeline',
        question: 'How long does a project take?',
        answer:
          'Brand-only projects take about 2-3 weeks. Launch Starter takes 3-4 weeks and Launch Plus 6-8 weeks. We confirm the date in your proposal.',
      },
      {
        id: 'international',
        question: 'Do you work with clients outside Nigeria?',
        answer:
          'Yes. We work with clients worldwide through video calls, shared project boards, and email, and agree meeting times that suit your time zone.',
      },
      {
        id: 'ownership',
        question: 'Will I own my files and website?',
        answer:
          'Yes. Once the project is paid in full, the brand files and website are yours.',
      },
    ],
    seeAllLink: {
      label: 'See all questions',
      href: '/faq',
    },
  },
  testimonials: {
    sectionLabel: '08 / CLIENT WORDS',
    headline: 'What our clients say.',
    // Empty until real client quotes exist — section renders nothing when empty.
    items: [],
  },
  closingCta: {
    sectionLabel: "08 / LET'S TALK",
    headline: "Let's build something excellent.",
    cursorLabel: 'Talk',
    body: 'Tell us about your project. We reply within one business day.',
    primaryCta: {
      label: 'Start a project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Book a free 20-minute call',
      href: '/contact?intent=call',
    },
    whatsappCta: {
      label: 'Message us on WhatsApp',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },
};
