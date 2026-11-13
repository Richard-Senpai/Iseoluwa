'use client';

import { Container } from '@/components/ui/Container';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { CONTACT_CONTENT } from '../contact.content';
import { ContactInfoColumn } from './ContactInfoColumn';
import { ProjectRequestForm } from './ProjectRequestForm';

export interface ContactViewProps {
  initialPackageSlug?: string | null;
  initialSource?: string | null;
}

export function ContactView({ initialPackageSlug, initialSource }: ContactViewProps) {
  const { header } = CONTACT_CONTENT;

  return (
    <div className="bg-bg text-ink">
      {/* Header Section with single thick FlowingLine */}
      <section className="relative overflow-hidden border-b border-line pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 opacity-90 md:h-60">
          <FlowingLine path="loop" weight="hero" reactToPointer />
        </div>

        <Container className="relative z-10">
          <p className="text-label-mono text-ink-muted">{header.label}</p>
          <h1 className="text-display-xl mt-4 max-w-[15ch] text-ink">{header.headline}</h1>
          <p className="text-body-l mt-6 max-w-[54ch] text-ink-muted">{header.body}</p>
          <p className="text-label-mono mt-4 text-ink-muted">{header.reassurance}</p>
        </Container>
      </section>

      {/* Main 2-column content: On mobile, form is first (order-1) and contact info is second (order-2); on desktop, left column is order-1 and right form is order-2 */}
      <SurfaceTransition>
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
              <div className="order-2 lg:order-1 lg:col-span-5">
                <ContactInfoColumn />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-7">
                <ProjectRequestForm
                  initialPackageSlug={initialPackageSlug}
                  initialSource={initialSource}
                />
              </div>
            </div>
          </Container>
        </section>
      </SurfaceTransition>
    </div>
  );
}
