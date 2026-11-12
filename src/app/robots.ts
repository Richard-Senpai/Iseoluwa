import type { MetadataRoute } from 'next';
import { SITE_CONTENT } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_CONTENT.seo.siteUrl}/sitemap.xml`,
  };
}
