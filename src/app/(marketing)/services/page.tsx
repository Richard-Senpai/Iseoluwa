import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { SITE_CONTENT } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

const stub = NAVIGATION_CONTENT.stubs.services;

export const metadata: Metadata = buildMetadata({
  title: `${stub.title} | ${SITE_CONTENT.plainName}`,
  description: stub.description,
  path: '/services',
});

export default function ServicesPage() {
  return (
    <section className="flex min-h-[70vh] items-center pt-32 pb-24">
      <Container className="space-y-8">
        <Label>{stub.label}</Label>
        <h1 className="text-display-xl text-ink">{stub.title}</h1>
        <p className="text-body-l max-w-[54ch] text-ink-muted">{stub.description}</p>
        <div className="pt-4">
          <Button href="/" variant="secondary">
            {stub.backHomeLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
