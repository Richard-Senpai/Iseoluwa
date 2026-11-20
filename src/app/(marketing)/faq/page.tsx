import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { SITE_CONTENT } from '@/content/site';
import { SERVICES_FAQ_ITEMS } from '@/features/services/services.content';
import { buildFaqPageJsonLd, buildMetadata } from '@/lib/seo';

const stub = NAVIGATION_CONTENT.stubs.faq;

export const metadata: Metadata = buildMetadata({
  title: `${stub.title} | ${SITE_CONTENT.plainName}`,
  description: stub.description,
  path: '/faq',
});

export default function FaqPage() {
  const faqJsonLd = buildFaqPageJsonLd(SERVICES_FAQ_ITEMS);

  return (
    <section className="pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container className="space-y-12">
        <div className="space-y-6">
          <Label>{stub.label}</Label>
          <h1 className="text-display-xl text-ink">{stub.title}</h1>
          <p className="text-body-l max-w-[54ch] text-ink-muted">{stub.description}</p>
        </div>

        <Accordion items={SERVICES_FAQ_ITEMS} idPrefix="faq-page" />

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button href="/contact?source=faq" variant="primary">
            Start a project
          </Button>
          <Button href="/services" variant="secondary">
            Explore services & packages
          </Button>
        </div>
      </Container>
    </section>
  );
}
