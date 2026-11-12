import type { MetadataRoute } from 'next';
import { SITE_CONTENT } from '@/content/site';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { ALL_PROJECTS, WORK_CATEGORIES } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONTENT.seo.siteUrl;
  const now = new Date();

  const mainEntries: MetadataRoute.Sitemap = NAVIGATION_CONTENT.mainLinks.map((item) => ({
    url: `${baseUrl}${item.href === '/' ? '' : item.href}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: item.href === '/' ? 1 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = WORK_CATEGORIES.map((category) => ({
    url: `${baseUrl}/work/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const projectEntries: MetadataRoute.Sitemap = ALL_PROJECTS.map((project) => ({
    url: `${baseUrl}${project.href}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...mainEntries, ...categoryEntries, ...projectEntries];
}
