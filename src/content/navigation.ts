export interface NavItem {
  label: string;
  href: string;
  number: string;
}

export interface NavigationContent {
  skipToContent: string;
  header: {
    menuOpenLabel: string;
    menuCloseLabel: string;
    ctaLabel: string;
    ctaHref: string;
    themeToggleAriaLabel: string;
  };
  mainLinks: NavItem[];
  footer: {
    newsletter: {
      label: string;
      description: string;
      placeholder: string;
      submitLabel: string;
      submittingLabel: string;
      successMessage: string;
      errorMessage: string;
      invalidEmailMessage: string;
      honeypotLabel: string;
    };
    columnHeadings: {
      navigation: string;
      contact: string;
      social: string;
      hours: string;
    };
    legalLinks: Array<{ label: string; href: string }>;
    backToTopLabel: string;
    copyrightPrefix: string;
  };
  stubs: Record<
    'services' | 'work' | 'about' | 'faq' | 'contact',
    {
      label: string;
      title: string;
      description: string;
      backHomeLabel: string;
      selectedPackagePrefix?: string;
    }
  >;
}

export const NAVIGATION_CONTENT: NavigationContent = {
  skipToContent: 'Skip to main content',
  header: {
    menuOpenLabel: 'Menu',
    menuCloseLabel: 'Close',
    ctaLabel: "Let's talk",
    ctaHref: '/contact',
    themeToggleAriaLabel: 'Toggle colour theme',
  },
  mainLinks: [
    { number: '01', label: 'Home', href: '/' },
    { number: '02', label: 'Services', href: '/services' },
    { number: '03', label: 'Work', href: '/work' },
    { number: '04', label: 'About', href: '/about' },
    { number: '05', label: 'FAQ', href: '/faq' },
    { number: '06', label: 'Contact', href: '/contact' },
  ],
  footer: {
    newsletter: {
      label: 'STAY IN TOUCH',
      description: 'Notes on brand, web, and growth. No spam.',
      placeholder: 'Your email address',
      submitLabel: 'Subscribe',
      submittingLabel: 'Sending...',
      successMessage: 'Thank you for subscribing. We will be in touch.',
      errorMessage: 'Something went wrong. Please try again.',
      invalidEmailMessage: 'Please enter a valid email address.',
      honeypotLabel: 'Leave this field empty',
    },
    columnHeadings: {
      navigation: 'INDEX',
      contact: 'DIRECT',
      social: 'SOCIAL',
      hours: 'HOURS',
    },
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    backToTopLabel: 'Back to top',
    copyrightPrefix: '©',
  },
  stubs: {
    services: {
      label: '01 / SERVICES',
      title: 'Services & Packages',
      description: 'Detailed scope for Brand, Build, and Grow packages — coming soon.',
      backHomeLabel: 'Back to Home',
    },
    work: {
      label: '02 / WORK',
      title: 'Selected Work',
      description: 'Full case studies and project breakdowns — coming soon.',
      backHomeLabel: 'Back to Home',
    },
    about: {
      label: '03 / ABOUT',
      title: 'About Iséoluwa',
      description: 'Our story, principles, and how we work — coming soon.',
      backHomeLabel: 'Back to Home',
    },
    faq: {
      label: '04 / FAQ',
      title: 'Frequently Asked Questions',
      description: 'Everything you need to know about working with us — coming soon.',
      backHomeLabel: 'Back to Home',
    },
    contact: {
      label: '05 / CONTACT',
      title: 'Start a project',
      description: 'Full project brief and booking calendar — coming soon.',
      backHomeLabel: 'Back to Home',
      selectedPackagePrefix: 'Selected package:',
    },
  },
};
