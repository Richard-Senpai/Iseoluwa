import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { PACKAGES_CONTENT } from '@/content/packages';
import { SITE_CONTENT } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

const stub = NAVIGATION_CONTENT.stubs.contact;

export const metadata: Metadata = buildMetadata({
  title: `${stub.title} | ${SITE_CONTENT.plainName}`,
  description: stub.description,
  path: '/contact',
});

interface ContactPageProps {
  searchParams: Promise<{ package?: string }>;
}

/**
 * Contact stub page (Home Prompt Section 4):
 * Reads optional `?package=` query parameter from the package matcher and displays it.
 */
export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;
  const packageSlug = resolvedParams.package;

  const matchedPackage =
    PACKAGES_CONTENT.packages.find((pkg) => pkg.slug === packageSlug)?.name ??
    Object.values(PACKAGES_CONTENT.singleServicePrices).find(
      (pkg) => pkg.slug === packageSlug,
    )?.name ??
    packageSlug;

  return (
    <section className="flex min-h-[70vh] items-center pt-32 pb-24">
      <Container className="space-y-8">
        <Label>{stub.label}</Label>
        <h1 className="text-display-xl text-ink">{stub.title}</h1>

        {matchedPackage && (
          <div
            id="contact-selected-package"
            className="inline-flex items-center gap-3 rounded-pill border border-line-accent bg-green-light px-4 py-2 text-[#0a0a0a] dark:bg-green-signal dark:text-[#0a0a0a]"
          >
            <span className="text-label-mono">
              {stub.selectedPackagePrefix} {matchedPackage}
            </span>
          </div>
        )}

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
