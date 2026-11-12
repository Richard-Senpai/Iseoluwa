import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  WORK_CATEGORIES,
  getCategoryBySlug,
  getNextCategory,
  getProjectsByCategory,
} from '@/content/projects';
import { CategoryView, WORK_CONTENT } from '@/features/work';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return WORK_CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.title} ${WORK_CONTENT.seo.categoryTitleSuffix}`,
    description: category.description,
    path: `/work/${category.slug}`,
  });
}

/**
 * Stage 2 Route: `/work/[category]` (Work Prompt Section 2 & 6).
 */
export default async function WorkCategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const projects = getProjectsByCategory(category.slug);
  const nextCategory = getNextCategory(category.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: category.title, path: `/work/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryView
        category={category}
        projects={projects}
        nextCategory={nextCategory}
      />
    </>
  );
}
