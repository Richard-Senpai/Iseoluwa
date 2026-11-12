import type { Metadata } from 'next';
import { CategorySwiper } from '@/components/motion/CategorySwiper';
import { WORK_CATEGORIES } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: WORK_CONTENT.seo.title,
  description: WORK_CONTENT.seo.description,
  path: '/work',
});

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

/**
 * Stage 1 Route: `/work` (Work Prompt Section 2 & 4).
 * Thin page rendering the full-screen `CategorySwiper` and a `<noscript>` vertical fallback.
 */
export default async function WorkPage({ searchParams }: WorkPageProps) {
  const resolved = await searchParams;

  return (
    <>
      <CategorySwiper initialCategorySlug={resolved.category} />

      {/* No-JavaScript fallback: panels stack vertically as normal sections */}
      <noscript>
        <div className="mx-auto max-w-content space-y-12 px-6 py-24">
          {WORK_CATEGORIES.map((category) => (
            <section
              key={category.slug}
              className="rounded-card border border-line p-8"
            >
              <p className="text-label-mono text-ink-muted">{category.number}</p>
              <h2 className="text-display-l mt-2 text-ink">{category.title}</h2>
              <p className="text-body-l mt-3 text-ink-muted">{category.description}</p>
              <a
                href={`/work/${category.slug}`}
                className="text-btn mt-6 inline-block underline"
              >
                {`${WORK_CONTENT.stage1.enterPrefix} ${category.title}`}
              </a>
            </section>
          ))}
        </div>
      </noscript>
    </>
  );
}
