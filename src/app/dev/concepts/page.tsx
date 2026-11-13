import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandBoard } from '@/features/concepts/BrandBoard';
import { BrowserFrame } from '@/features/concepts/BrowserFrame';
import { SocialGrid } from '@/features/concepts/SocialGrid';
import {
  CONCEPT_CONFIGS,
  getConceptConfigBySlug,
  type ConceptBrandConfig,
  type ConceptFrameId,
} from '@/features/concepts/concepts.config';

export const metadata: Metadata = {
  title: 'Concept Compositions (Dev Only) | Iseoluwa',
  robots: {
    index: false,
    follow: false,
  },
};

const VALID_FRAMES: readonly ConceptFrameId[] = ['hero', 'gallery-01', 'gallery-02'];

function renderConceptFrame(config: ConceptBrandConfig, frame: ConceptFrameId) {
  if (config.kind === 'branding') {
    return <BrandBoard config={config} frame={frame} />;
  }
  if (config.kind === 'websites') {
    return <BrowserFrame config={config} frame={frame} />;
  }
  return <SocialGrid config={config} frame={frame} />;
}

export interface DevConceptsPageProps {
  searchParams: Promise<{
    slug?: string;
    frame?: string;
  }>;
}

export default async function DevConceptsPage({ searchParams }: DevConceptsPageProps) {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_CONCEPTS_EXPORT !== '1'
  ) {
    notFound();
  }

  const params = await searchParams;
  const slugParam = params.slug;
  const frameParam = params.frame as ConceptFrameId | undefined;

  if (slugParam && frameParam && VALID_FRAMES.includes(frameParam)) {
    const config = getConceptConfigBySlug(slugParam);
    if (!config) {
      notFound();
    }
    return (
      <div className="inline-block bg-black p-0">
        {renderConceptFrame(config, frameParam)}
      </div>
    );
  }

  return (
    <div className="space-y-16 bg-bg py-28 px-8 text-ink">
      <div className="mx-auto max-w-[1200px] space-y-2 border-b border-line pb-6">
        <p className="text-label-mono text-ink-muted">DEV-ONLY ROUTE · /DEV/CONCEPTS</p>
        <h1 className="text-display-l">12 Studio Concept Projects (36 Frames)</h1>
      </div>

      <div className="mx-auto max-w-[1200px] space-y-20">
        {CONCEPT_CONFIGS.map((config) => (
          <section key={config.slug} className="space-y-8 border-b border-line pb-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-heading-m">{config.name}</h2>
              <span className="text-label-mono text-ink-muted">
                {config.kind.toUpperCase()} · {config.slug}
              </span>
            </div>
            <div className="space-y-8 overflow-x-auto">
              {renderConceptFrame(config, 'hero')}
              {renderConceptFrame(config, 'gallery-01')}
              {renderConceptFrame(config, 'gallery-02')}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
