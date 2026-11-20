import type { Metadata } from 'next';
import { SERVICES } from '@/content/services';
import {
  SERVICES_CONTENT,
  SERVICES_FAQ_ITEMS,
  ServicesHero,
  ServicesStickyNav,
  ServiceSection,
  ServicesProcess,
  ServicesPackages,
  ServicesFaq,
} from '@/features/services';
import { Testimonials } from '@/features/home/sections/Testimonials';
import { ClosingCta } from '@/features/home/sections/ClosingCta';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildMetadata,
  buildPackagesOfferCatalogJsonLd,
  buildServicesJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: SERVICES_CONTENT.seo.title,
  description: SERVICES_CONTENT.seo.description,
  path: SERVICES_CONTENT.seo.path,
});

export default function ServicesPage() {
  const servicesJsonLd = buildServicesJsonLd();
  const offerCatalogJsonLd = buildPackagesOfferCatalogJsonLd();
  const faqJsonLd = buildFaqPageJsonLd(SERVICES_FAQ_ITEMS);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  return (
    <>
      {servicesJsonLd.map((serviceSchema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Hero (with thick FlowingLine #1) */}
      <ServicesHero />

      {/* 2. Sticky Service Navigation and Intro Statement */}
      <ServicesStickyNav />

      {/* 3–5. Three Service Sections: 01 Branding (Light), 02 Web (.surface-inverse), 03 Marketing (Light) */}
      {SERVICES.map((service) => (
        <ServiceSection key={service.slug} service={service} />
      ))}

      {/* 6. How We Work — 04 / PROCESS (with thick FlowingLine #2 + How we communicate) */}
      <ServicesProcess />

      {/* 7. Packages — 05 / PACKAGES (7 packages, comparison table, add-ons, terms, matcher) */}
      <ServicesPackages />

      {/* 8. FAQ — 06 / QUESTIONS (8 items + link to /faq) */}
      <ServicesFaq />

      {/* 9. Testimonials (renders nothing while empty) */}
      <Testimonials />

      {/* 10. Closing Call to Action & Rising Tide Footer Transition (with thick FlowingLine #3) */}
      <ClosingCta />
    </>
  );
}
