export interface SocialLink {
  id: 'instagram' | 'linkedin' | 'x' | 'github' | 'whatsapp';
  label: string;
  handle: string;
  href: string;
}

export interface WhatsAppDetails {
  local: string;
  display: string;
  e164: string;
  href: string;
  telHref: string;
}

export interface InstagramDetails {
  handle: string;
  href: string;
}

export interface FounderDetails {
  fullName: string;
  displayName: string;
  plainName: string;
  title: string;
  roles: string[];
  base: string;
  portfolioUrl: string;
  email: string;
  whatsapp: string;
  whatsappHref: string;
  bookingUrl: string;
  socials: SocialLink[];
}

export interface SiteContent {
  wordmark: string;
  displayName: string;
  plainName: string;
  statusText: string;
  taglineShort: string;
  sloganFull: string;
  regionsLine: string;
  reassuranceText: string;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    siteUrl: string;
  };
  contact: {
    email: string;
    whatsapp: WhatsAppDetails;
    instagram: InstagramDetails;
    whatsappNumber: string;
    whatsappHref: string;
    telHref: string;
    workingHours: string;
    copiedLabel: string;
    copyPromptLabel: string;
  };
  socials: SocialLink[];
  founder: FounderDetails;
}

const WHATSAPP_PREFILLED_MESSAGE = encodeURIComponent(
  "Hello Iséoluwa, I'd like to discuss a project.",
);

const WHATSAPP_E164 = '+2348133696869';
const WHATSAPP_DISPLAY = '+234 813 369 6869';
const WHATSAPP_LOCAL = '0813 369 6869';
const WHATSAPP_LINK = `https://wa.me/2348133696869?text=${WHATSAPP_PREFILLED_MESSAGE}`;
const WHATSAPP_TEL_LINK = `tel:${WHATSAPP_E164}`;

const INSTAGRAM_HANDLE = '@iseoluwahub';
const INSTAGRAM_URL = 'https://www.instagram.com/iseoluwahub/';

/**
 * Returns only social links that have a live configured URL and handle
 * (excludes unconfigured TODO placeholders).
 */
export function getActiveSocials(socials: readonly SocialLink[]): SocialLink[] {
  return socials.filter(
    (s) =>
      Boolean(s.href && s.href.trim().length > 0) &&
      !s.handle.startsWith('[add') &&
      !s.href.endsWith('//instagram.com') &&
      !s.href.endsWith('//linkedin.com') &&
      !s.href.endsWith('//x.com'),
  );
}

/**
 * Global studio details, founder profile, and brand copy.
 * Single source of truth for contact details and social profiles.
 */
export const SITE_CONTENT: SiteContent = {
  wordmark: 'iséoluwa',
  displayName: 'Iséoluwa',
  plainName: 'Iseoluwa',
  statusText: 'Available for new projects',
  taglineShort: 'Every detail. Done with excellence.',
  sloganFull:
    'We dot every i and cross every t. We iron out every rough edge and leave nothing untouched. We treat every project as work done unto the Lord.',
  regionsLine: 'Working with clients in Africa, Europe, and the Americas.',
  reassuranceText: 'Free 20-minute call. No obligation.',
  seo: {
    defaultTitle: 'Iseoluwa | Brand, Web and Marketing Studio',
    defaultDescription:
      'One team for your brand, website, and growth. Fixed prices, clear timelines, excellent work.',
    siteUrl: 'https://iseoluwa.com',
  },
  contact: {
    // TODO: Replace with final studio email if different
    email: 'hello@iseoluwa.com',
    whatsapp: {
      local: WHATSAPP_LOCAL,
      display: WHATSAPP_DISPLAY,
      e164: WHATSAPP_E164,
      href: WHATSAPP_LINK,
      telHref: WHATSAPP_TEL_LINK,
    },
    instagram: {
      handle: INSTAGRAM_HANDLE,
      href: INSTAGRAM_URL,
    },
    whatsappNumber: WHATSAPP_DISPLAY,
    whatsappHref: WHATSAPP_LINK,
    telHref: WHATSAPP_TEL_LINK,
    // TODO: Replace with studio working hours
    workingHours: 'MON – FRI · 09:00 – 18:00 WAT / GMT',
    copiedLabel: 'Copied',
    copyPromptLabel: 'Copy email',
  },
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: INSTAGRAM_HANDLE,
      href: INSTAGRAM_URL,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      handle: WHATSAPP_DISPLAY,
      href: WHATSAPP_LINK,
    },
    // TODO: Add LinkedIn URL when ready (kept empty so unconfigured social link does not render)
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: '[add]',
      href: '',
    },
    // TODO: Add X URL when ready (kept empty so unconfigured social link does not render)
    {
      id: 'x',
      label: 'X',
      handle: '[add]',
      href: '',
    },
  ],
  founder: {
    fullName: 'Ojedayo Richard Iseoluwa',
    displayName: 'Iséoluwa',
    plainName: 'Iseoluwa',
    title: 'Founder',
    roles: ['Software Engineer', 'Full-Stack Developer', 'Product Designer', 'Brand Manager'],
    // TODO: Replace `[Base city, country]` with founder's base location
    base: 'Lagos, Nigeria',
    portfolioUrl: 'http://senpaididit.vercel.app/',
    // TODO: Replace with founder's direct email if different from studio email
    email: 'hello@iseoluwa.com',
    whatsapp: WHATSAPP_DISPLAY,
    whatsappHref: WHATSAPP_LINK,
    // TODO: Replace `/contact#book-call` with Cal.com / Calendly booking URL when ready
    bookingUrl: '/contact#book-call',
    socials: [
      {
        id: 'instagram',
        label: 'Instagram',
        handle: INSTAGRAM_HANDLE,
        href: INSTAGRAM_URL,
      },
      // TODO: Add founder LinkedIn URL when ready
      {
        id: 'linkedin',
        label: 'LinkedIn',
        handle: '[add]',
        href: '',
      },
      // TODO: Add founder X URL when ready
      {
        id: 'x',
        label: 'X',
        handle: '[add]',
        href: '',
      },
      // TODO: Add founder GitHub URL when ready
      {
        id: 'github',
        label: 'GitHub',
        handle: '[add]',
        href: '',
      },
    ],
  },
};
