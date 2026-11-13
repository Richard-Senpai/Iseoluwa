import type { Metadata } from 'next';
import { CONTACT_CONTENT, ContactView } from '@/features/contact';
import { buildBreadcrumbJsonLd, buildContactPageJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: CONTACT_CONTENT.seo.title,
  description: CONTACT_CONTENT.seo.description,
  path: CONTACT_CONTENT.seo.path,
});

interface ContactPageProps {
  searchParams: Promise<{
    package?: string;
    source?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;
  const contactJsonLd = buildContactPageJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ContactView
        initialPackageSlug={resolvedParams.package ?? null}
        initialSource={resolvedParams.source ?? null}
      />
    </>
  );
}
