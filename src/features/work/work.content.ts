export interface WorkPageContent {
  seo: {
    title: string;
    description: string;
    categoryTitleSuffix: string;
  };
  stage1: {
    topLabel: string;
    projectsCountSuffix: string;
    enterPrefix: string;
    dragHint: string;
    cursorDragLabel: string;
    cursorEnterLabel: string;
    carouselAriaLabel: string;
    carouselRoleDescription: string;
    freeCallPrefix: string;
    freeCallLinkLabel: string;
    freeCallHref: string;
  };
  stage2: {
    breadcrumbPrefix: string;
    backToAllWorkLabel: string;
    indexOpenLabel: string;
    indexCloseLabel: string;
    indexDialogTitle: string;
    projectsCountSuffix: string;
    cursorViewLabel: string;
    nextCategoryLabel: string;
  };
  stage3: {
    backToCategoryPrefix: string;
    metaLabels: {
      client: string;
      year: string;
      services: string;
      role: string;
    };
    sections: {
      overview: string;
      challenge: string;
      approach: string;
      result: string;
      gallery: string;
      testimonial: string;
      nextProject: string;
    };
  };
  closingCta: {
    sectionLabel: string;
    headline: string;
    cursorLabel: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    reassurance: string;
  };
}

export const WORK_CONTENT: WorkPageContent = {
  seo: {
    title: 'Our Work | Iseoluwa',
    description:
      'Branding, websites, and marketing projects by Iseoluwa. Browse our work and see how we help businesses launch and grow.',
    categoryTitleSuffix: 'Projects | Iseoluwa',
  },
  stage1: {
    topLabel: 'WORK',
    projectsCountSuffix: 'PROJECTS',
    enterPrefix: 'Enter',
    dragHint: 'DRAG TO EXPLORE',
    cursorDragLabel: 'Drag',
    cursorEnterLabel: 'Enter',
    carouselAriaLabel: 'Work categories',
    carouselRoleDescription: 'carousel',
    freeCallPrefix: 'Not sure where to start?',
    freeCallLinkLabel: 'Book a free 20-minute call.',
    freeCallHref: '/contact?intent=call',
  },
  stage2: {
    breadcrumbPrefix: 'WORK /',
    backToAllWorkLabel: 'All work',
    indexOpenLabel: 'Index',
    indexCloseLabel: 'Close index',
    indexDialogTitle: 'Category project index',
    projectsCountSuffix: 'PROJECTS',
    cursorViewLabel: 'View',
    nextCategoryLabel: 'NEXT',
  },
  stage3: {
    backToCategoryPrefix: 'Back to',
    metaLabels: {
      client: 'CLIENT',
      year: 'YEAR',
      services: 'SERVICES',
      role: 'ROLE',
    },
    sections: {
      overview: '01 / OVERVIEW',
      challenge: '02 / THE CHALLENGE',
      approach: '03 / WHAT WE DID',
      result: '04 / THE RESULT',
      gallery: '05 / PROJECT GALLERY',
      testimonial: '06 / CLIENT WORDS',
      nextProject: 'NEXT PROJECT',
    },
  },
  closingCta: {
    sectionLabel: 'START SOMETHING',
    headline: "Have a project like this? Let's build something excellent.",
    cursorLabel: 'Talk',
    primaryCta: {
      label: 'Start a project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Book a free 20-minute call',
      href: '/contact?intent=call',
    },
    reassurance: 'Free 20-minute call. No obligation.',
  },
};
