import { SITE_CONTENT } from '@/content/site';
import type {
  BrandingScopeItem,
  BrandingStartingPoint,
  BudgetRangeDefinition,
  ContactPackageInterest,
  DecisionMakerOption,
  MarketingAim,
  MarketingChannelItem,
  PreferredContactMethod,
  ProjectMainGoal,
  ProjectServiceNeed,
  ReferralSourceOption,
  StartTimelineOption,
  WebsiteFeatureItem,
  WebsiteKind,
} from '@/types/contact';

export const BUDGET_RANGES: readonly BudgetRangeDefinition[] = [
  {
    id: 'range-1',
    stepIndex: 1,
    labels: {
      USD: 'Under $800',
      NGN: 'Under ₦400k',
    },
    minUsd: 0,
  },
  {
    id: 'range-2',
    stepIndex: 2,
    labels: {
      USD: '$800 – $1,500',
      NGN: '₦400k – ₦750k',
    },
    minUsd: 800,
  },
  {
    id: 'range-3',
    stepIndex: 3,
    labels: {
      USD: '$1,500 – $3,500',
      NGN: '₦750k – ₦1.8M',
    },
    minUsd: 1500,
  },
  {
    id: 'range-4',
    stepIndex: 4,
    labels: {
      USD: '$3,500 – $7,500',
      NGN: '₦1.8M – ₦4M',
    },
    minUsd: 3500,
  },
  {
    id: 'range-5',
    stepIndex: 5,
    labels: {
      USD: '$7,500 – $15,000',
      NGN: '₦4M – ₦8M',
    },
    minUsd: 7500,
  },
  {
    id: 'range-6',
    stepIndex: 6,
    labels: {
      USD: '$15,000 and above',
      NGN: '₦8M and above',
    },
    minUsd: 15000,
  },
] as const;

export const CONTACT_CONTENT = {
  seo: {
    title: 'Contact Iseoluwa | Start a Project',
    description:
      'Tell us about your project and budget. We reply within one business day. Branding, websites, and marketing for growing businesses.',
    path: '/contact',
  },

  thankYouSeo: {
    title: 'Thank You | Iseoluwa',
    description: 'We have received your project request and will reply within one business day.',
    path: '/contact/thank-you',
  },

  header: {
    label: 'CONTACT',
    headline: 'Let\u2019s build something excellent.',
    body: 'Tell us about your project and your budget. We reply within one business day.',
    reassurance: SITE_CONTENT.reassuranceText,
  },

  leftColumn: {
    preferToTalkHeading: 'Prefer to talk?',
    bookCallCta: {
      label: 'Book a free 20-minute call',
      href: SITE_CONTENT.founder.bookingUrl,
    },
    whatsappCta: {
      label: 'Message us on WhatsApp',
      href: SITE_CONTENT.contact.whatsappHref,
    },
    emailLabel: 'EMAIL',
    emailAddress: SITE_CONTENT.contact.email,
    copyLabel: SITE_CONTENT.contact.copyPromptLabel,
    copiedLabel: SITE_CONTENT.contact.copiedLabel,
    replyTimeLabel: 'REPLY TIME',
    replyTimeText: 'We reply within one business day.',
    // TODO: Replace `[Mon-Fri, 9:00-18:00 WAT / overlaps with Europe and the Americas]` with final hours if needed
    workingHoursMono: '[Mon-Fri, 9:00-18:00 WAT / overlaps with Europe and the Americas]',
    whatHappensNextHeading: 'WHAT HAPPENS NEXT',
    whatHappensNextSteps: [
      {
        number: '01',
        text: 'We review your request within one business day.',
      },
      {
        number: '02',
        text: 'We book a free 20-minute call to align on goals.',
      },
      {
        number: '03',
        text: 'You receive a fixed scope, price, and timeline.',
      },
    ],
    socialsLabel: 'FOLLOW',
    miniFaqHeading: 'COMMON QUESTIONS',
    miniFaqs: [
      {
        id: 'contact-faq-cost',
        question: 'How much does a project cost?',
        answer:
          'Brand-only projects start from $800 (₦400k), websites from $1,200 (₦450k), and our complete Launch Starter package starts from $1,500 (₦750k). Not sure which package fits? Choose the Custom Package and tell us your budget.',
      },
      {
        id: 'contact-faq-timeline',
        question: 'How long does a project take?',
        answer:
          'Launch Starter takes 3–4 weeks and Launch Plus takes 6–8 weeks. Every project begins with a fixed delivery date agreed before we start.',
      },
      {
        id: 'contact-faq-global',
        question: 'Do you work with clients outside Nigeria?',
        answer:
          'Yes. We work with businesses across Africa, Europe, and the Americas via video calls, shared project boards, and email in your time zone.',
      },
    ],
    seeAllQuestionsCta: {
      label: 'See all questions',
      href: '/faq',
    },
    privacyMonoLine: 'Your details stay private and are only used to reply to you.',
  },

  form: {
    steps: [
      { number: '01', title: 'About you' },
      { number: '02', title: 'Your project' },
      { number: '03', title: 'Budget and timing' },
      { number: '04', title: 'Review' },
    ],
    stepCounterPrefix: 'STEP',
    navigation: {
      backLabel: 'Back',
      nextLabel: 'Next',
      submitLabel: 'Send my request',
      submittingLabel: 'Sending your request...',
      submitReassurance: 'We reply within one business day.',
    },

    step1: {
      heading: 'Tell us about you.',
      fields: {
        fullName: {
          label: 'Full name',
          required: true,
        },
        email: {
          label: 'Email',
          required: true,
        },
        company: {
          label: 'Company or brand name',
          helper: 'Write "Personal project" if you are building something independent.',
          required: true,
        },
        role: {
          label: 'Your role (optional)',
          required: false,
        },
        country: {
          label: 'Country',
          searchPlaceholder: 'Filter or select your country',
          selectPrompt: 'Select your country',
          required: true,
        },
        phone: {
          label: 'Phone or WhatsApp (optional)',
          helper: 'Include your country code (for example +234 or +44) if you prefer WhatsApp.',
          required: false,
        },
        preferredContact: {
          label: 'Best way to reach you',
          options: [
            { value: 'email' as PreferredContactMethod, label: 'Email' },
            { value: 'whatsapp' as PreferredContactMethod, label: 'WhatsApp' },
            { value: 'video-call' as PreferredContactMethod, label: 'Video call' },
          ],
        },
      },
    },

    step2: {
      heading: 'Tell us about your project.',
      selectedPackageSummary: {
        badge: 'SELECTED PACKAGE',
        changeLabel: 'Change',
        timelinePrefix: 'Timeline:',
      },
      packageInterest: {
        label: 'Which package interests you?',
        options: [
          { value: 'launch-starter' as ContactPackageInterest, label: 'Launch Starter' },
          { value: 'launch-plus' as ContactPackageInterest, label: 'Launch Plus' },
          { value: 'brand-only' as ContactPackageInterest, label: 'Brand-Only' },
          { value: 'build-only' as ContactPackageInterest, label: 'Build-Only' },
          { value: 'care-plan' as ContactPackageInterest, label: 'Care Plan' },
          { value: 'growth-retainer' as ContactPackageInterest, label: 'Growth Retainer' },
          { value: 'custom' as ContactPackageInterest, label: 'Custom Package' },
          { value: 'not-sure' as ContactPackageInterest, label: 'Not sure yet' },
        ],
      },
      servicesNeeded: {
        label: 'What do you need?',
        helper: 'Select all that apply.',
        options: [
          { value: 'branding' as ProjectServiceNeed, label: 'Branding' },
          { value: 'website' as ProjectServiceNeed, label: 'Website or web app' },
          { value: 'marketing' as ProjectServiceNeed, label: 'Marketing' },
          { value: 'not-sure' as ProjectServiceNeed, label: 'I am not sure yet' },
        ],
      },
      projectDescription: {
        label: 'Tell us about your project',
        helper: 'What are you building, who is it for, and what should it achieve?',
        charactersSuffix: 'characters minimum',
      },
      mainGoal: {
        label: 'What is the main goal?',
        options: [
          { value: 'launch-new' as ProjectMainGoal, label: 'Launch something new' },
          { value: 'rebrand-refresh' as ProjectMainGoal, label: 'Rebrand or refresh' },
          { value: 'get-customers' as ProjectMainGoal, label: 'Get more customers' },
          { value: 'sell-online' as ProjectMainGoal, label: 'Sell online' },
          {
            value: 'improve-existing' as ProjectMainGoal,
            label: 'Improve what I already have',
          },
          { value: 'something-else' as ProjectMainGoal, label: 'Something else' },
        ],
      },
      existingMaterialsLinks: {
        label: 'Do you have existing materials or inspiration? (optional)',
        helper: 'Paste links to anything useful. File uploads can come later.',
      },
      conditionalBranding: {
        sectionLabel: 'BRANDING DETAILS',
        needsLabel: 'What do you need for your brand?',
        needsOptions: [
          { value: 'strategy' as BrandingScopeItem, label: 'Brand strategy' },
          { value: 'logo' as BrandingScopeItem, label: 'Logo' },
          { value: 'identity' as BrandingScopeItem, label: 'Full visual identity' },
          { value: 'guidelines' as BrandingScopeItem, label: 'Brand guidelines' },
          { value: 'templates' as BrandingScopeItem, label: 'Social and print templates' },
          { value: 'not-sure' as BrandingScopeItem, label: 'Not sure' },
        ],
        startingPointLabel: 'Starting point?',
        startingPointOptions: [
          { value: 'scratch' as BrandingStartingPoint, label: 'From scratch' },
          { value: 'refresh' as BrandingStartingPoint, label: 'Refresh an existing brand' },
          { value: 'evolve' as BrandingStartingPoint, label: 'Evolve an existing brand' },
        ],
      },
      conditionalWebsite: {
        sectionLabel: 'WEBSITE DETAILS',
        kindLabel: 'What kind of website or app?',
        kindOptions: [
          { value: 'marketing-site' as WebsiteKind, label: 'Marketing website' },
          { value: 'ecommerce' as WebsiteKind, label: 'E-commerce store' },
          {
            value: 'web-app' as WebsiteKind,
            label: 'Web application or dashboard',
          },
          { value: 'landing-page' as WebsiteKind, label: 'Landing page' },
          {
            value: 'redesign' as WebsiteKind,
            label: 'Redesign of an existing site',
          },
        ],
        featuresLabel: 'Key features?',
        featuresOptions: [
          { value: 'payments' as WebsiteFeatureItem, label: 'Online payments' },
          { value: 'bookings' as WebsiteFeatureItem, label: 'Bookings' },
          { value: 'accounts' as WebsiteFeatureItem, label: 'User accounts and login' },
          { value: 'cms' as WebsiteFeatureItem, label: 'Blog or CMS' },
          { value: 'multilingual' as WebsiteFeatureItem, label: 'Multiple languages' },
          {
            value: 'integrations' as WebsiteFeatureItem,
            label: 'Integrations (CRM, email, other)',
          },
          { value: 'not-sure' as WebsiteFeatureItem, label: 'Not sure' },
        ],
        existingUrlLabel: 'Existing site address? (optional)',
      },
      conditionalMarketing: {
        sectionLabel: 'MARKETING DETAILS',
        channelsLabel: 'Which channels?',
        channelsOptions: [
          { value: 'social' as MarketingChannelItem, label: 'Social media' },
          { value: 'seo' as MarketingChannelItem, label: 'SEO' },
          { value: 'paid-ads' as MarketingChannelItem, label: 'Paid ads' },
          { value: 'email' as MarketingChannelItem, label: 'Email marketing' },
          { value: 'content' as MarketingChannelItem, label: 'Content creation' },
          { value: 'not-sure' as MarketingChannelItem, label: 'Not sure' },
        ],
        aimLabel: 'Main aim?',
        aimOptions: [
          { value: 'awareness' as MarketingAim, label: 'Awareness' },
          { value: 'leads' as MarketingAim, label: 'Leads' },
          { value: 'sales' as MarketingAim, label: 'Sales' },
          { value: 'launch' as MarketingAim, label: 'Product launch' },
        ],
        existingAccountsLabel: 'Existing audience or accounts? (optional)',
      },
    },

    step3: {
      heading: 'Budget and timing.',
      budgetPicker: {
        label: 'Estimated budget',
        currencyLabel: 'Currency',
        unselectedDisplay: 'Select a budget range',
        adviseDisplay: 'Not sure yet — please advise me',
        adviseCheckboxLabel: 'Not sure yet. Please advise me.',
        sliderAriaLabel: 'Select project budget range',
        gentleFitNote:
          'Our projects usually start from $800 for branding and $1,200 for a website. You can still send your request, and we will advise on the best way to start.',
      },
      startTimeline: {
        label: 'When would you like to start?',
        options: [
          { value: 'asap' as StartTimelineOption, label: 'As soon as possible' },
          { value: 'within-month' as StartTimelineOption, label: 'Within a month' },
          { value: 'two-three-months' as StartTimelineOption, label: 'In 2-3 months' },
          { value: 'exploring' as StartTimelineOption, label: 'Just exploring' },
        ],
      },
      deadlineDate: {
        label: 'Is there a deadline or event date? (optional)',
        helper: 'For example a product launch, conference, or campaign date.',
      },
      decisionMaker: {
        label: 'Who makes the final decision? (optional)',
        options: [
          { value: 'just-me' as DecisionMakerOption, label: 'Just me' },
          {
            value: 'me-and-team' as DecisionMakerOption,
            label: 'Me and a partner or team',
          },
          { value: 'someone-else' as DecisionMakerOption, label: 'Someone else' },
        ],
      },
    },

    step4: {
      heading: 'Review and send.',
      editStepLabel: 'Edit',
      groups: {
        step1: '01 / About you',
        step2: '02 / Your project',
        step3: '03 / Budget and timing',
      },
      heardAboutUs: {
        label: 'How did you hear about us? (optional)',
        options: [
          { value: 'search' as ReferralSourceOption, label: 'Search' },
          { value: 'social' as ReferralSourceOption, label: 'Social media' },
          { value: 'referral' as ReferralSourceOption, label: 'Referral' },
          { value: 'portfolio' as ReferralSourceOption, label: 'Portfolio or past work' },
          { value: 'other' as ReferralSourceOption, label: 'Other' },
        ],
      },
      consent: {
        prefix: 'I agree to Iséoluwa contacting me about this request, in line with the ',
        privacyLinkLabel: 'Privacy Policy',
        privacyHref: '/privacy',
        suffix: '.',
      },
      honeypotLabel: 'Leave this field empty',
      errorBanner: {
        heading: 'We could not send your request right now.',
        body: 'Your answers are saved on this page. Please try again, or reach us directly:',
        emailPrefix: 'Email us at',
        whatsappLabel: 'Message us on WhatsApp',
      },
    },
  },

  thankYou: {
    label: 'REQUEST RECEIVED',
    headline: 'Thank you. We have your request.',
    body: 'We will reply within one business day. In the meantime, here is what happens next.',
    timelineHeading: 'WHAT HAPPENS NEXT',
    actions: {
      bookCall: {
        label: 'Book a free 20-minute call',
        href: SITE_CONTENT.founder.bookingUrl,
      },
      whatsapp: {
        label: 'Message us on WhatsApp',
        href: SITE_CONTENT.contact.whatsappHref,
      },
      seeWork: {
        label: 'See our work',
        href: '/work',
      },
      readFaq: {
        label: 'Read the FAQ',
        href: '/faq',
      },
    },
  },
} as const;

export function getBudgetRangeById(id?: string | null): BudgetRangeDefinition | undefined {
  if (!id) return undefined;
  return BUDGET_RANGES.find((r) => r.id === id);
}
