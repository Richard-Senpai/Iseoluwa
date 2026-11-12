import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import {
  Hero,
  Statement,
  SoundFamiliar,
  WhatWeDo,
  SelectedWork,
  WhyIseoluwa,
  HowItWorks,
  Packages,
  FaqTeaser,
  Testimonials,
  ClosingCta,
} from '@/features/home';

export const metadata: Metadata = buildMetadata({ path: '/' });

/**
 * Home Page route (Tech Stack Section 6 & 7: thin page composing sections from features/home).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <SoundFamiliar />
      <WhatWeDo />
      <SelectedWork />
      <WhyIseoluwa />
      <HowItWorks />
      <Packages />
      <FaqTeaser />
      <Testimonials />
      <ClosingCta />
    </>
  );
}
