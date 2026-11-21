import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ALL_PROJECTS,
  getCategoryBySlug,
  getNextProjectInCategory,
  getProjectBySlug,
} from '@/content/projects';
import { CaseStudyView } from '@/features/work';
import { SITE_CONTENT } from '@/content/site';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({
    category: project.category,
    slug: project.slug,
  }));
}

interface CaseStudyPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const project = category ? getProjectBySlug(category.slug, slug) : undefined;
  if (!category || !project) return {};

  const baseMeta = buildMetadata({
    title: `${project.title} | ${category.title} | ${SITE_CONTENT.plainName}`,
    description: project.summary,
    path: project.href,
    image: project.media.hero.src,
  });

  if (project.kind === 'sample') {
    return {
      ...baseMeta,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return baseMeta;
}

/**
 * Stage 3 Route: `/work/[category]/[slug]`.
 */
export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const project = getProjectBySlug(category.slug, slug);
  if (!project) {
    notFound();
  }

  const nextProject = getNextProjectInCategory(category.slug, project.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: category.title, path: `/work/${category.slug}` },
    { name: project.title, path: project.href },
  ]);

  const creativeWorkJsonLd =
    project.kind === 'real'
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          url: project.liveUrl ?? `${SITE_CONTENT.seo.siteUrl}${project.href}`,
          image: project.media.hero.src
            ? `${SITE_CONTENT.seo.siteUrl}${project.media.hero.src}`
            : undefined,
          creator: {
            '@type': 'Organization',
            name: SITE_CONTENT.plainName,
            url: SITE_CONTENT.seo.siteUrl,
          },
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {creativeWorkJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        />
      )}
      <CaseStudyView
        category={category}
        project={project}
        nextProject={nextProject}
      />
    </>
  );
}
