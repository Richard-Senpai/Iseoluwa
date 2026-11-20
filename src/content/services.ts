import type { ServiceItem } from '@/types/services';

/**
 * Single source of truth for the three core services (`src/content/services.ts`).
 * Copy, offerings, deliverables, outcomes, and mini FAQs live here — never inside components.
 */
export const SERVICES: readonly ServiceItem[] = [
  {
    slug: 'branding',
    number: '01',
    sectionLabel: '01 / BRANDING',
    title: 'Branding',
    tagline: 'Look like the business you want to be.',
    intro:
      'Your brand is how people recognise, remember, and trust you. We build it from strategy outward, so every logo, colour, and word has a reason.',
    forWhoLabel: 'FOR WHOM',
    forWho:
      'New businesses, businesses about to launch, and established businesses that have outgrown their look.',
    offeringsHeading: 'WHAT WE DELIVER',
    deliverablesHeading: 'DELIVERABLES',
    offerings: [
      {
        id: 'branding-strategy',
        title: 'Brand strategy and positioning',
        description:
          'Who you serve, what makes you different, and how you should sound across every touchpoint.',
        // TODO: confirm with the team
        deliverables: ['Positioning statement', 'Audience summary', 'Voice and tone notes'],
        previewImage: '/media/concepts/ayo-roasters/hero.webp',
        previewAlt: 'Ayo Roasters brand strategy and identity board',
      },
      {
        id: 'branding-identity',
        title: 'Logo and visual identity',
        description:
          'A distinct, flexible visual identity system designed to work cleanly at every size and medium.',
        // TODO: confirm with the team
        deliverables: [
          'Primary logo and variations',
          'Colour palette',
          'Typography',
          'Simple supporting graphics',
        ],
        previewImage: '/media/concepts/marlo-and-finch/hero.webp',
        previewAlt: 'Marlo & Finch logo and visual identity system',
      },
      {
        id: 'branding-guidelines',
        title: 'Brand guidelines',
        description: 'A clear guide so anyone can use your brand correctly.',
        // TODO: confirm with the team
        deliverables: [
          'Guideline document covering logo use',
          'Colours and contrast rules',
          'Type hierarchy',
          'Tone of voice',
        ],
        previewImage: '/media/concepts/northfield-legal/hero.webp',
        previewAlt: 'Northfield Legal brand guidelines specimen',
      },
      {
        id: 'branding-collateral',
        title: 'Brand collateral',
        description:
          'Ready-to-use everyday assets so your launch looks coherent from day one.',
        // TODO: confirm with the team
        deliverables: ['Social media templates', 'Business cards', 'Pitch deck design'],
        previewImage: '/media/concepts/sol-skin/hero.webp',
        previewAlt: 'Sol Skin packaging and brand collateral system',
      },
    ],
    outcomesHeading: 'WHAT YOU CAN EXPECT',
    outcomes: [
      'A brand you can use consistently everywhere, from social media to packaging and pitch decks.',
      'Source files and plain-language guidelines your whole team can follow without guesswork.',
      'An identity built around your business positioning, not generic templates.',
    ],
    relatedWorkHeading: 'RELATED BRANDING WORK',
    relatedCategory: 'branding',
    seeAllProjectsLabel: 'See all branding projects',
    seeAllProjectsHref: '/work/branding',
    faqHeading: 'BRANDING QUESTIONS',
    faq: [
      {
        id: 'branding-faq-files',
        question: 'Which logo and brand files do we receive at handover?',
        answer:
          'You receive vector masters (SVG, EPS, PDF), web-ready PNG and WebP files in light and dark variants, font details, and your full brand guidelines document.',
      },
      {
        id: 'branding-faq-refresh',
        question: 'Can you refresh our existing brand without throwing everything away?',
        answer:
          'Yes. If your name or core mark already has recognition, we can refine your typography, colour palette, and guidelines while keeping what customers already know.',
      },
    ],
    bestMatchingPackageSlug: 'brand-only',
    ctaLabel: 'Start a branding project',
    ctaHref: '/contact?package=brand-only&source=services-branding',
    bookCallLabel: 'Book a free call',
    bookCallHref: '/contact#book-call',
    reassurance: 'Free 20-minute call. No obligation.',
    isInverse: false,
  },
  {
    slug: 'web',
    number: '02',
    sectionLabel: '02 / WEB',
    title: 'Web Design and Development',
    tagline: 'A website built to work as hard as you do.',
    intro:
      'A website should be fast, easy to use, and built to convert. We design and build it ourselves, so nothing is lost between design and code.',
    forWhoLabel: 'FOR WHOM',
    forWho:
      'Businesses that need a first website, a rebuild, an online store, or a web application.',
    offeringsHeading: 'WHAT WE DELIVER',
    deliverablesHeading: 'DELIVERABLES',
    offerings: [
      {
        id: 'web-ui-ux',
        title: 'UI/UX design and prototyping',
        description:
          'Clear structure, thoughtful user journeys, and interactive prototypes you can test before code begins.',
        // TODO: confirm with the team
        deliverables: ['Page layouts', 'Clickable prototype', 'Mobile and desktop designs'],
        previewImage: '/media/concepts/haven-stays/hero.webp',
        previewAlt: 'Haven Stays UI/UX design and booking flow',
      },
      {
        id: 'web-marketing-sites',
        title: 'Marketing websites and landing pages',
        description:
          'Fast, editorial websites engineered to explain your value clearly and turn visitors into enquiries.',
        // TODO: confirm with the team
        deliverables: ['Responsive pages', 'Contact forms', 'Analytics setup'],
        previewImage: '/media/concepts/lumen-dental/hero.webp',
        previewAlt: 'Lumen Dental marketing website design',
      },
      {
        id: 'web-apps',
        title: 'Web applications and dashboards',
        description: 'Full-stack builds tailored to your product or internal workflow.',
        // TODO: confirm with the team
        deliverables: [
          'Frontend application',
          'Backend API and database',
          'Authentication where needed',
          'Production deployment',
        ],
        previewImage: '/media/concepts/ledgerly/hero.webp',
        previewAlt: 'Ledgerly web application and dashboard interface',
      },
      {
        id: 'web-ecommerce',
        title: 'E-commerce stores',
        description:
          'Online storefronts designed for smooth browsing, mobile checkout, and reliable payments.',
        // TODO: confirm with the team
        deliverables: ['Product catalogue', 'Cart and checkout', 'Payment integration'],
        previewImage: '/media/concepts/adire-atelier/hero.webp',
        previewAlt: 'Adire Atelier e-commerce storefront and product page',
      },
      {
        id: 'web-cms-seo',
        title: 'CMS, hosting, performance, and SEO foundations',
        description:
          'A clean content setup so your team can publish updates easily without breaking the design.',
        // TODO: confirm with the team
        deliverables: [
          'Easy-to-edit content system',
          'Fast hosting setup',
          'Technical SEO basics',
        ],
        previewImage: '/media/concepts/haven-stays/gallery-01.webp',
        previewAlt: 'CMS and technical performance foundation preview',
      },
      {
        id: 'web-care',
        title: 'Maintenance and support',
        description:
          'Ongoing technical care after launch so your website stays fast, secure, and current.',
        // TODO: confirm with the team
        deliverables: [
          'Software updates',
          'Scheduled backups',
          'Security checks',
          'Minor edits (the Care Plan)',
        ],
        previewImage: '/media/concepts/ledgerly/gallery-01.webp',
        previewAlt: 'Website maintenance and support overview',
      },
    ],
    outcomesHeading: 'WHAT YOU CAN EXPECT',
    outcomes: [
      'A site that loads quickly and reads cleanly on phones, tablets, and desktops.',
      'Design and engineering handled by the same team, so the live site matches the approved design.',
      'Full ownership of your codebase, domain setup, and content system once launched.',
    ],
    relatedWorkHeading: 'RELATED WEB WORK',
    relatedCategory: 'websites',
    seeAllProjectsLabel: 'See all website projects',
    seeAllProjectsHref: '/work/websites',
    faqHeading: 'WEB DESIGN & BUILD QUESTIONS',
    faq: [
      {
        id: 'web-faq-edit',
        question: 'Will we be able to edit text and images ourselves after launch?',
        answer:
          'Yes. When your project includes a CMS, we set up clean editing fields and walk your team through how to update pages, posts, or products safely.',
      },
      {
        id: 'web-faq-hosting',
        question: 'Can you help with domain, hosting, and post-launch care?',
        answer:
          'Yes. We handle deployment and domain connection at launch, and you can either manage hosting yourself or join our monthly Care Plan.',
      },
    ],
    bestMatchingPackageSlug: 'build-only',
    ctaLabel: 'Start a web project',
    ctaHref: '/contact?package=build-only&source=services-web',
    bookCallLabel: 'Book a free call',
    bookCallHref: '/contact#book-call',
    reassurance: 'Free 20-minute call. No obligation.',
    isInverse: true,
  },
  {
    slug: 'marketing',
    number: '03',
    sectionLabel: '03 / MARKETING',
    title: 'Marketing',
    tagline: 'Turn attention into customers.',
    intro:
      'Great design deserves an audience. We help the right people find you and give them a reason to act.',
    forWhoLabel: 'FOR WHOM',
    forWho:
      'Businesses launching something new, or those with a good product and too few customers.',
    offeringsHeading: 'WHAT WE DELIVER',
    deliverablesHeading: 'DELIVERABLES',
    offerings: [
      {
        id: 'marketing-gtm',
        title: 'Go-to-market and launch strategy',
        description:
          'A structured plan for introducing your brand, product, or campaign to the right audience.',
        // TODO: confirm with the team
        deliverables: ['Launch plan', 'Audience and channel plan', 'Content calendar'],
        previewImage: '/media/concepts/fresh-basket/hero.webp',
        previewAlt: 'Fresh Basket launch strategy and campaign board',
      },
      {
        id: 'marketing-social',
        title: 'Social media setup and content strategy',
        description:
          'Cohesive social channels and repeatable content formats that sound and look like your brand.',
        // TODO: confirm with the team
        deliverables: ['Profile setup', 'Content pillars', 'Post formats', 'Posting plan'],
        previewImage: '/media/concepts/pulse-fitness/hero.webp',
        previewAlt: 'Pulse Fitness social media grid and content pillars',
      },
      {
        id: 'marketing-seo',
        title: 'SEO and content marketing',
        description:
          'Search-focused pages and articles that help customers find you when they are looking for what you offer.',
        // TODO: confirm with the team
        deliverables: ['Keyword focus', 'On-page improvements', 'Article plan'],
        previewImage: '/media/concepts/brightpath-academy/hero.webp',
        previewAlt: 'BrightPath Academy content and search growth plan',
      },
      {
        id: 'marketing-paid-ads',
        title: 'Paid advertising on Meta and Google',
        description:
          'Targeted ad campaigns built around clear creative, disciplined testing, and real enquiries.',
        // TODO: confirm with the team
        deliverables: [
          'Campaign setup',
          'Ad creative',
          'Audience targeting',
          'Ongoing optimisation',
        ],
        previewImage: '/media/concepts/studio-rue/hero.webp',
        previewAlt: 'Studio Rue paid campaign creative',
      },
      {
        id: 'marketing-email',
        title: 'Email marketing and automation',
        description:
          'Direct communication with customers who have already shown interest in your business.',
        // TODO: confirm with the team
        deliverables: [
          'List setup',
          'Branded email templates',
          'Welcome and follow-up sequences',
        ],
        previewImage: '/media/concepts/fresh-basket/gallery-01.webp',
        previewAlt: 'Email marketing template and campaign flow',
      },
      {
        id: 'marketing-analytics',
        title: 'Analytics and reporting',
        description:
          'Clear tracking so you know which channels are working and what we are improving next.',
        // TODO: confirm with the team
        deliverables: ['Monthly report with plain-language insights and next steps'],
        previewImage: '/media/concepts/pulse-fitness/gallery-01.webp',
        previewAlt: 'Marketing performance and campaign review',
      },
    ],
    outcomesHeading: 'WHAT YOU CAN EXPECT',
    outcomes: [
      'A clear monthly plan so you always know what content and campaigns are going out.',
      'Visuals and copy created by the same studio that knows your brand and website.',
      'Plain-language monthly reporting focused on real enquiries and next steps, not vanity jargon.',
    ],
    relatedWorkHeading: 'RELATED MARKETING WORK',
    relatedCategory: 'marketing',
    seeAllProjectsLabel: 'See all marketing projects',
    seeAllProjectsHref: '/work/marketing',
    faqHeading: 'MARKETING QUESTIONS',
    faq: [
      {
        id: 'marketing-faq-ad-spend',
        question: 'Is paid ad spend included in the Growth Retainer price?',
        answer:
          'No. Our fee covers strategy, creative, campaign setup, and management. Paid media spend on Meta or Google is billed directly to your ad account so you control the budget.',
      },
      {
        id: 'marketing-faq-standalone',
        question: 'Can you run marketing for us if you did not build our website?',
        answer:
          'Yes. We review your current website and landing pages first so we can make sure traffic has a clear place to convert.',
      },
    ],
    bestMatchingPackageSlug: 'growth-retainer',
    ctaLabel: 'Start a marketing project',
    ctaHref: '/contact?package=growth-retainer&source=services-marketing',
    bookCallLabel: 'Book a free call',
    bookCallHref: '/contact#book-call',
    reassurance: 'Free 20-minute call. No obligation.',
    isInverse: false,
  },
] as const;

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
