import type { MetadataRoute } from 'next';
import { SITE_CONTENT } from '@/content/site';
import { NAVIGATION_CONTENT } from '@/content/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONTENT.seo.siteUrl;

  return NAVIGATION_CONTENT.mainLinks.map((item) => ({
    url: `${baseUrl}${item.href === '/' ? '' : item.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: item.href === '/' ? 1 : 0.8,
  }));
}
