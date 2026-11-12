export interface SocialLink {
  id: 'instagram' | 'linkedin' | 'x' | 'github' | 'whatsapp';
  label: string;
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
    whatsappNumber: string;
    whatsappHref: string;
    workingHours: string;
    copiedLabel: string;
    copyPromptLabel: string;
  };
  socials: SocialLink[];
  founder: FounderDetails;
}

/**
 * Global studio details, founder profile, and brand copy.
 * NOTE: Contact details (email, WhatsApp number, portfolio URL, booking link, and social handles)
 * are placeholders marked with TODO. Replace the `[add ...]` values below before launch.
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
    // TODO: Replace `[add number]` with full international WhatsApp number
    whatsappNumber: '[add number]',
    whatsappHref: 'https://wa.me/',
    // TODO: Replace with studio working hours
    workingHours: 'MON – FRI · 09:00 – 18:00 WAT / GMT [add]',
    copiedLabel: 'Copied',
    copyPromptLabel: 'Copy email',
  },
  socials: [
    // TODO: Replace `[add]` handles and URLs with live studio profiles
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '[add]',
      href: 'https://instagram.com',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: '[add]',
      href: 'https://linkedin.com',
    },
    {
      id: 'x',
      label: 'X',
      handle: '[add]',
      href: 'https://x.com',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      handle: '[add number]',
      href: 'https://wa.me/',
    },
  ],
  founder: {
    fullName: 'Ojedayo Richard Iseoluwa',
    displayName: 'Iséoluwa',
    plainName: 'Iseoluwa',
    title: 'Founder',
    roles: ['Software Engineer', 'Full-Stack Developer', 'Product Designer', 'Brand Manager'],
    // TODO: Replace `[Base city, country]` with founder's base location
    base: '[Base city, country]',
    portfolioUrl: 'http://senpaididit.vercel.app/',
    // TODO: Replace with founder's direct email if different from studio email
    email: 'hello@iseoluwa.com',
    // TODO: Replace `[add number]` with founder's direct WhatsApp number
    whatsapp: '[add number]',
    whatsappHref: 'https://wa.me/',
    // TODO: Replace `[add booking link]` or `/contact` with Cal.com / Calendly booking URL
    bookingUrl: '/contact#book-call',
    socials: [
      // TODO: Replace `[add]` handles and URLs with founder's personal social profiles
      {
        id: 'linkedin',
        label: 'LinkedIn',
        handle: '[add]',
        href: 'https://linkedin.com',
      },
      {
        id: 'x',
        label: 'X',
        handle: '[add]',
        href: 'https://x.com',
      },
      {
        id: 'github',
        label: 'GitHub',
        handle: '[add]',
        href: 'https://github.com/Richard-Senpai',
      },
      {
        id: 'instagram',
        label: 'Instagram',
        handle: '[add]',
        href: 'https://instagram.com',
      },
    ],
  },
};
