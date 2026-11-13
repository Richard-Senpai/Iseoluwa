export type ConceptFrameId = 'hero' | 'gallery-01' | 'gallery-02';

export interface ConceptBrandConfig {
  slug: string;
  kind: 'branding' | 'websites' | 'marketing';
  name: string;
  subtitle: string;
  location: string;
  year: string;
  palette: {
    primary: { name: string; hex: string };
    secondary: { name: string; hex: string };
    surface: { name: string; hex: string };
    ink: string;
    surfaceInk: string;
  };
  deliverables: [string, string, string, string];
  monogram: string;
  specimenHeadline: string;
  specimenBody: string;
  referenceImage?: string;
  metricsOrBadges: [string, string, string];
  unsplashFallbackUrl: string;
}

export const CONCEPT_CONFIGS: readonly ConceptBrandConfig[] = [
  // =========================================================================
  // 01 / BRANDING
  // =========================================================================
  {
    slug: 'ayo-roasters',
    kind: 'branding',
    name: 'Ayo Roasters',
    subtitle: 'Specialty Coffee Roaster & Tasting Bar',
    location: 'Victoria Island, Lagos',
    year: '2026',
    palette: {
      primary: { name: 'Warm Terracotta', hex: '#B85338' },
      secondary: { name: 'Deep Espresso', hex: '#1F1511' },
      surface: { name: 'Unbleached Cream', hex: '#F6EFE6' },
      ink: '#F6EFE6',
      surfaceInk: '#1F1511',
    },
    deliverables: ['Logo', 'Packaging', 'Menu', 'Tote'],
    monogram: 'AR',
    specimenHeadline: 'Small-batch West African & East African single-origin roasts.',
    specimenBody:
      'Roasted weekly in Lagos. Whole-bean 250g valve pouches with harvest altitude, process method, and espresso calibration notes.',
    referenceImage: '/images/work/branding/branding-01.png',
    metricsOrBadges: ['LOT 04 · JOS PLATEAU', 'ROAST: MEDIUM-LIGHT', '250G WHOLE BEAN'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/specialty-coffee-roaster',
  },
  {
    slug: 'marlo-and-finch',
    kind: 'branding',
    name: 'Marlo & Finch',
    subtitle: 'Independent Bookshop & Reading Room',
    location: 'Ikoyi, Lagos · London',
    year: '2026',
    palette: {
      primary: { name: 'Forest Ink', hex: '#143328' },
      secondary: { name: 'Brushed Brass', hex: '#C29B48' },
      surface: { name: 'Warm Paper', hex: '#F4EFE6' },
      ink: '#F4EFE6',
      surfaceInk: '#143328',
    },
    deliverables: ['Wordmark', 'Bookmarks', 'Signage', 'Stamp'],
    monogram: 'M&F',
    specimenHeadline: 'Literature, essays, architecture monographs, and quiet tables.',
    specimenBody:
      'Blind-debossed cotton bookmarks, brass reading room desk lamps, and custom ex-libris stamps pressed into every edition.',
    referenceImage: '/images/work/branding/branding-02.png',
    metricsOrBadges: ['EX-LIBRIS NO. 108', 'READING ROOM PASS', 'CURATED EDITIONS'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/independent-bookshop-interior',
  },
  {
    slug: 'northfield-legal',
    kind: 'branding',
    name: 'Northfield Legal',
    subtitle: 'Modern Commercial & Infrastructure Law',
    location: 'Lagos · London · Nairobi',
    year: '2026',
    palette: {
      primary: { name: 'Deep Navy', hex: '#0E1B2E' },
      secondary: { name: 'Architectural Slate', hex: '#5B6778' },
      surface: { name: 'Warm Ivory', hex: '#F7F6F2' },
      ink: '#F7F6F2',
      surfaceInk: '#0E1B2E',
    },
    deliverables: ['Monogram', 'Stationery', 'Pitch Deck', 'Guidelines'],
    monogram: 'NL',
    specimenHeadline: 'Clear commercial counsel for cross-border ventures and energy infrastructure.',
    specimenBody:
      'Structured brief templates, engraved cotton correspondence cards, and boardroom transaction decks.',
    referenceImage: '/images/work/branding/branding-03.png',
    metricsOrBadges: ['ADVISORY BRIEF 01', 'CROSS-BORDER M&A', 'GRID SYSTEM 12-COL'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/minimal-office-stationery',
  },
  {
    slug: 'sol-skin',
    kind: 'branding',
    name: 'Sol Skin',
    subtitle: 'Clean Botanical Skincare Formulations',
    location: 'Lagos · Accra',
    year: '2026',
    palette: {
      primary: { name: 'Botanical Sage', hex: '#4B6353' },
      secondary: { name: 'Deep Charcoal', hex: '#1A1B19' },
      surface: { name: 'Warm Sand', hex: '#EFE9DF' },
      ink: '#EFE9DF',
      surfaceInk: '#1A1B19',
    },
    deliverables: ['Bottle Labels', 'Carton', 'Brand Book', 'Social Kit'],
    monogram: 'SOL',
    specimenHeadline: 'Step-numbered botanical formulations balanced for humid climates.',
    specimenBody:
      '01 Cloud Gel Cleanser · 02 Niacinamide + Hibiscus Mist · 03 Baobab Barrier Serum. UV-shielded amber and sage vessels.',
    referenceImage: '/images/work/branding/branding-04.png',
    metricsOrBadges: ['STEP 03 · BARRIER SERUM', 'PH 5.2 BALANCED', '50ML AMBER GLASS'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/minimal-skincare-packaging',
  },

  // =========================================================================
  // 02 / WEBSITES
  // =========================================================================
  {
    slug: 'haven-stays',
    kind: 'websites',
    name: 'Haven Stays',
    subtitle: 'Design-Led Short-Stay Apartments',
    location: 'havenstays.co',
    year: '2026',
    palette: {
      primary: { name: 'Deep Olive', hex: '#3B523E' },
      secondary: { name: 'Charcoal', hex: '#151514' },
      surface: { name: 'Warm Stone', hex: '#F5F2EC' },
      ink: '#F5F2EC',
      surfaceInk: '#151514',
    },
    deliverables: ['Hero Search', 'Listing Grid', 'Apartment Detail', 'Date Picker'],
    monogram: 'HS',
    specimenHeadline: 'Sunlit apartments in Ikoyi, Victoria Island, and Maitama.',
    specimenBody:
      'Instant availability, verified 24/7 solar-inverter power, high-speed fibre, and transparent nightly rates with zero hidden fees.',
    metricsOrBadges: ['IKOYI PENTHOUSE · $185/NIGHT', '24/7 SOLAR + FIBRE', 'INSTANT BOOKING'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/minimalist-apartment-living-room',
  },
  {
    slug: 'adire-atelier',
    kind: 'websites',
    name: 'Adire Atelier',
    subtitle: 'Contemporary Hand-Dyed Indigo Textiles',
    location: 'adireatelier.com',
    year: '2026',
    palette: {
      primary: { name: 'Deep Indigo', hex: '#162647' },
      secondary: { name: 'Earth Ochre', hex: '#C78A3B' },
      surface: { name: 'Warm Bone', hex: '#F6F3EC' },
      ink: '#F6F3EC',
      surfaceInk: '#162647',
    },
    deliverables: ['Editorial Lookbook Hero', 'Product Page', 'Fabric Story', 'Cart Drawer'],
    monogram: 'AA',
    specimenHeadline: 'Cassava-resist indigo textiles dyed by hand in Abeokuta.',
    specimenBody:
      'Limited-edition silk and organic cotton resort silhouettes, complete with artisan dye-vat provenance and dual NGN/USD checkout.',
    metricsOrBadges: ['COLLECTION 04 · ODO', '100% ABEOKUTA INDIGO', 'WORLDWIDE DHL EXPRESS'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/hand-dyed-indigo-fabric',
  },
  {
    slug: 'ledgerly',
    kind: 'websites',
    name: 'Ledgerly',
    subtitle: 'Invoicing & Multi-Currency Cashflow for African SMEs',
    location: 'useledgerly.com',
    year: '2026',
    palette: {
      primary: { name: 'Near-Black', hex: '#0D1110' },
      secondary: { name: 'Signal Mint', hex: '#19E37A' },
      surface: { name: 'Off-White', hex: '#F5F5F3' },
      ink: '#F5F5F3',
      surfaceInk: '#0D1110',
    },
    deliverables: ['Marketing Hero', 'Live Dashboard Preview', 'Pricing Table', 'Mobile View'],
    monogram: 'LG',
    specimenHeadline: 'Send NGN & USD invoices, reconcile payouts, and forecast runway.',
    specimenBody:
      'Automated bank reconciliation, instant virtual accounts, and scheduled vendor payouts built for finance teams across Africa.',
    metricsOrBadges: ['NET CASHFLOW · ₦18.4M', 'USD RECEIVABLES · $24,800', 'T+0 SETTLEMENT'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/minimal-desk-laptop',
  },
  {
    slug: 'lumen-dental',
    kind: 'websites',
    name: 'Lumen Dental',
    subtitle: 'Calm Preventative & Cosmetic Dentistry',
    location: 'lumendental.clinic',
    year: '2026',
    palette: {
      primary: { name: 'Deep Teal', hex: '#133B3A' },
      secondary: { name: 'Warm Grey', hex: '#6E6D68' },
      surface: { name: 'Soft Alabaster', hex: '#F7F6F2' },
      ink: '#F7F6F2',
      surfaceInk: '#133B3A',
    },
    deliverables: ['Online Booking Hero', 'Treatments List', 'Doctor Bios', 'Patient FAQ'],
    monogram: 'LD',
    specimenHeadline: 'Unhurried dental care designed around patient comfort.',
    specimenBody:
      'Transparent pricing bands, gentle airflow hygiene, digital 3D scans, and online slot booking in under two minutes.',
    metricsOrBadges: ['NEXT SLOT · TOMORROW 10:30', 'DIGITAL 3D SCAN', 'UPFRONT PRICING'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/minimal-wellness-clinic',
  },

  // =========================================================================
  // 03 / MARKETING
  // =========================================================================
  {
    slug: 'fresh-basket',
    kind: 'marketing',
    name: 'Fresh Basket',
    subtitle: 'Same-Day Farm-to-Door Grocery Delivery Launch',
    location: 'Lagos Neighbourhood Rollout',
    year: '2026',
    palette: {
      primary: { name: 'Fresh Green', hex: '#1F7A4C' },
      secondary: { name: 'Sun Citrus', hex: '#F2B705' },
      surface: { name: 'Market Cream', hex: '#FAF7F0' },
      ink: '#FAF7F0',
      surfaceInk: '#1F7A4C',
    },
    deliverables: ['9-Post Launch Grid', 'Story Ads', 'Neighbourhood OOH Poster', 'Referral Card'],
    monogram: 'FB',
    specimenHeadline: 'Picked at dawn. On your kitchen counter before 2pm.',
    specimenBody:
      'Coordinated Instagram launch grid, vertical story ad variants, Lekki/Yaba street posters, and a neighbour-to-neighbour crate referral card.',
    metricsOrBadges: ['HARVEST TO DOOR < 6 HRS', 'LEKKI · YABA · IKEJA', 'CRATE REFERRAL KIT'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/organic-produce-basket',
  },
  {
    slug: 'pulse-fitness',
    kind: 'marketing',
    name: 'Pulse Fitness',
    subtitle: 'New-Year Strength & Conditioning Campaign',
    location: 'Boutique Training Studio',
    year: '2026',
    palette: {
      primary: { name: 'Pitch Black', hex: '#0B0B0B' },
      secondary: { name: 'Electric Lime', hex: '#C6F91F' },
      surface: { name: 'Pure White', hex: '#FFFFFF' },
      ink: '#FFFFFF',
      surfaceInk: '#0B0B0B',
    },
    deliverables: ['Paid Social Carousel', 'Class Schedule Posts', 'Landing Hero', 'Email Header'],
    monogram: 'PF',
    specimenHeadline: 'Built on progressive overload, not January hype.',
    specimenBody:
      'Small-group strength blocks, 6am–8pm coach-led sessions, paid social motion carousels, and a 14-day foundation pass funnel.',
    metricsOrBadges: ['14-DAY FOUNDATION PASS', 'MAX 12 ATHLETES / CLASS', 'STRENGTH · METCON · MOBILITY'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/strength-training-studio',
  },
  {
    slug: 'studio-rue',
    kind: 'marketing',
    name: 'Studio Rue',
    subtitle: 'Seasonal Capsule Collection Drop',
    location: 'Contemporary Ready-to-Wear',
    year: '2026',
    palette: {
      primary: { name: 'Deep Espresso', hex: '#231B17' },
      secondary: { name: 'Burnt Rust', hex: '#A44A2E' },
      surface: { name: 'Warm Stone', hex: '#EDE6DC' },
      ink: '#EDE6DC',
      surfaceInk: '#231B17',
    },
    deliverables: ['Lookbook Reel Covers', 'Countdown Stories', 'Launch Email', 'Press Kit Card'],
    monogram: 'SR',
    specimenHeadline: 'Capsule 07 — Raw linen, tailored wool, and sun-baked rust.',
    specimenBody:
      'Ten-day rollout calendar spanning numbered garment study reels, 72-hour waitlist countdown stories, and private showroom invitations.',
    metricsOrBadges: ['CAPSULE 07 · DRY SEASON', '72-HR WAITLIST ACCESS', 'SHOWROOM RSVP PASS'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/linen-fashion-lookbook',
  },
  {
    slug: 'brightpath-academy',
    kind: 'marketing',
    name: 'BrightPath Academy',
    subtitle: 'Cohort Enrolment Campaign for Tech Skills School',
    location: 'Product Design & Engineering Cohorts',
    year: '2026',
    palette: {
      primary: { name: 'Deep Blue', hex: '#102542' },
      secondary: { name: 'Warm Coral', hex: '#E85D4A' },
      surface: { name: 'Soft Sky', hex: '#D9ECFF' },
      ink: '#FFFFFF',
      surfaceInk: '#102542',
    },
    deliverables: ['Student Story Cards', 'Curriculum Carousel', 'Webinar Invite', 'Paid Ad Variants'],
    monogram: 'BP',
    specimenHeadline: 'Twelve weeks of live studio critiques, code reviews, and shipped capstones.',
    specimenBody:
      'Transparent week-by-week syllabus carousels, alumni portfolio spotlights, live Q&A session invites, and admissions ad variants.',
    metricsOrBadges: ['COHORT 09 · ADMISSIONS', '12-WEEK LIVE STUDIO', 'SHIPPED CAPSTONE PORTFOLIO'],
    unsplashFallbackUrl: 'https://unsplash.com/s/photos/software-engineering-student',
  },
];

export function getConceptConfigBySlug(slug: string): ConceptBrandConfig | undefined {
  return CONCEPT_CONFIGS.find((c) => c.slug === slug);
}
