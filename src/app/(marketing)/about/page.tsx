import type { Metadata } from 'next';
import {
  ABOUT_CONTENT,
  AboutHero,
  TheName,
  MeetFounder,
  VisionMissionGoal,
  OurValues,
  WhyUs,
  WiderNetwork,
  WhereWeWork,
  TheStandard,
  AboutClosingCta,
} from '@/features/about';
import { Testimonials } from '@/features/home/sections/Testimonials';
import { buildBreadcrumbJsonLd, buildFounderPersonJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: ABOUT_CONTENT.seo.title,
  description: ABOUT_CONTENT.seo.description,
  path: ABOUT_CONTENT.seo.path,
});

export default function AboutPage() {
  const personJsonLd = buildFounderPersonJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Hero (with thick FlowingLine #1) */}
      <AboutHero />

      {/* 2. The Name — 01 / THE NAME */}
      <TheName />

      {/* 3. Meet Iséoluwa — 02 / THE FOUNDER (with thick FlowingLine #2 + Reach me block) */}
      <MeetFounder />

      {/* 4. Vision, Mission, and Goal — 03 / WHAT DRIVES US (inverse surface) */}
      <VisionMissionGoal />

      {/* 5. Our Values — 04 / OUR VALUES */}
      <OurValues />

      {/* 6. What Makes Us Different — 05 / WHY US */}
      <WhyUs />

      {/* 7. The Wider Team — 06 / THE NETWORK */}
      <WiderNetwork />

      {/* 8. Where We Work — 07 / REACH */}
      <WhereWeWork />

      {/* 9. The Standard — Slogan */}
      <TheStandard />

      {/* 10. Testimonials (reused from Home; renders nothing while empty) */}
      <Testimonials />

      {/* 11. Closing Call to Action + Surface Colour Transition into Footer (with thick FlowingLine #3) */}
      <AboutClosingCta />
    </>
  );
}
