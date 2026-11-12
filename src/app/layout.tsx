import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { getFontVariables } from '@/lib/fonts';
import { buildMetadata, buildOrganizationJsonLd } from '@/lib/seo';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { ThemeReveal } from '@/components/motion/ThemeReveal';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { PageTransition } from '@/components/motion/PageTransition';
import { Cursor } from '@/components/motion/Cursor';
import { Header } from '@/components/layout/Header';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { Footer } from '@/components/layout/Footer';
import { FooterReveal } from '@/components/motion/FooterReveal';

export const metadata: Metadata = buildMetadata();

/**
 * WCAG 2.2 AA & Design System Section 10:
 * Never block pinch-zoom (no `maximumScale: 1` or `userScalable: false`).
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html lang="en" suppressHydrationWarning className={getFontVariables()}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="text-label-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-pill focus:bg-inverse-bg focus:px-5 focus:py-3 focus:text-inverse-ink"
        >
          {NAVIGATION_CONTENT.skipToContent}
        </a>

        <ThemeReveal>
          <SmoothScroll>
            <PageTransition>
              <Cursor />
              <Header />
              <MenuOverlay />
              <main id="main-content" className="relative z-10 bg-bg">
                {children}
              </main>
              <FooterReveal>
                <Footer />
              </FooterReveal>
            </PageTransition>
          </SmoothScroll>
        </ThemeReveal>
      </body>
    </html>
  );
}
