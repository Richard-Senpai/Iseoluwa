import type { Metadata } from 'next';
import { SITE_CONTENT } from '@/content/site';

export function buildMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = overrides?.title ?? SITE_CONTENT.seo.defaultTitle;
  const description = overrides?.description ?? SITE_CONTENT.seo.defaultDescription;
  const url = `${SITE_CONTENT.seo.siteUrl}${overrides?.path ?? ''}`;
  const images = overrides?.image ? [{ url: overrides.image, alt: title }] : undefined;

  return {
    metadataBase: new URL(SITE_CONTENT.seo.siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONTENT.plainName,
      locale: 'en_US',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: overrides?.image ? [overrides.image] : undefined,
    },
  };
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONTENT.plainName,
    alternateName: SITE_CONTENT.displayName,
    url: SITE_CONTENT.seo.siteUrl,
    email: SITE_CONTENT.contact.email,
    description: SITE_CONTENT.seo.defaultDescription,
    areaServed: ['Africa', 'Europe', 'Americas'],
    sameAs: SITE_CONTENT.socials.map((s) => s.href),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONTENT.seo.siteUrl}${item.path}`,
    })),
  };
}
