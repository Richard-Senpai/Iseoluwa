'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { FooterReveal } from '@/components/motion/FooterReveal';

/**
 * Renders the global Footer with `FooterReveal` on all routes except `/work` (Stage 1),
 * which is a strict `100dvh` full-screen swipe selector with no vertical page scroll.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/work') {
    return null;
  }

  return (
    <FooterReveal>
      <Footer />
    </FooterReveal>
  );
}
