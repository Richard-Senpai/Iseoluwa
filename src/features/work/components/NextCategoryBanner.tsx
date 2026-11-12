'use client';

import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { TagList } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/media/Media';
import type { WorkCategory } from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useZoomStore } from '@/store/zoom';
import { track } from '@/lib/analytics';

export interface NextCategoryBannerProps {
  currentCategorySlug: string;
  nextCategory: WorkCategory;
}

/**
 * End-of-category retention banner (Work Prompt Section 6):
 * Large zoom link to the next category with mono `NEXT`, Display L title, and preview frame.
 */
export function NextCategoryBanner({
  currentCategorySlug,
  nextCategory,
}: NextCategoryBannerProps) {
  const router = useRouter();
  const { shouldSimplifyMotion } = useMotionPreference();
  const saveOrigin = useZoomStore((s) => s.saveOrigin);
  const startZoom = useZoomStore((s) => s.startZoom);
  const { stage2 } = WORK_CONTENT;

  const targetHref = `/work/${nextCategory.slug}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track('work_next_category_clicked', {
      fromCategory: currentCategorySlug,
      toCategory: nextCategory.slug,
    });

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const previewEl = event.currentTarget.querySelector<HTMLElement>(
      '[data-next-category-preview="true"]',
    );
    const rect = previewEl?.getBoundingClientRect();
    const originKey = `category:${nextCategory.slug}`;
    const zoomRect = rect
      ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      : null;

    if (zoomRect) {
      saveOrigin(originKey, zoomRect, `${nextCategory.title.toUpperCase()} · PROJECT MEDIA 16:9`);
    }

    if (shouldSimplifyMotion || !zoomRect) {
      router.push(targetHref);
      return;
    }

    startZoom({
      direction: 'in',
      targetHref,
      originKey,
      fromRect: zoomRect,
      label: `${nextCategory.title.toUpperCase()} · PROJECT MEDIA 16:9`,
      title: nextCategory.title,
    });
  };

  return (
    <section className="border-t border-line py-[var(--section-pad-y)]">
      <Container>
        <a
          href={targetHref}
          data-testid="next-category-link"
          onClick={handleClick}
          className="group grid grid-cols-1 items-center gap-10 rounded-card border border-line bg-surface p-6 transition-colors hover:border-line-accent md:p-12 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-6">
            <Label muted={false} className="text-line-accent">
              {stage2.nextCategoryLabel} · {nextCategory.number}
            </Label>
            <div className="flex items-baseline gap-4">
              <h2 className="text-display-l text-ink transition-colors group-hover:text-line-accent">
                {nextCategory.title}
              </h2>
              <Icon
                name="arrow_outward"
                size={24}
                className="text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
            <p className="text-body-l max-w-[44ch] text-ink-muted">{nextCategory.tagline}</p>
            <TagList items={nextCategory.tags} />
          </div>

          <div
            data-next-category-preview="true"
            className="overflow-hidden rounded-card lg:col-span-6"
          >
            <Media
              type="placeholder"
              alt={`${nextCategory.title} category preview`}
              label={`${nextCategory.title.toUpperCase()} · PROJECT MEDIA 16:9`}
              aspectRatio="16/9"
            />
          </div>
        </a>
      </Container>
    </section>
  );
}
