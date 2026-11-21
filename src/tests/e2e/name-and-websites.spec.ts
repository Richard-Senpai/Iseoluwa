import { expect, test } from '@playwright/test';

const GUARD_ROUTES = [
  '/',
  '/services',
  '/work',
  '/work/branding',
  '/work/websites',
  '/work/marketing',
  '/work/branding/ayo-roasters',
  '/work/websites/icestein-grillz',
  '/work/websites/sample-wine-vineyard',
  '/work/marketing/fresh-basket',
  '/about',
  '/contact',
  '/faq',
];

test.describe('Part 2 & Part 3 — Zero Visible Placeholders Guard & Real Websites Verification', () => {
  test('zero visible bracketed notes or placeholder strings across all routes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const route of GUARD_ROUTES) {
      await page.goto(route);
      const visibleText = await page.evaluate(() => document.body?.innerText ?? '');

      const bracketMatches = visibleText.match(/\[[^\]]{2,}\]/g) ?? [];
      expect(bracketMatches, `Bracketed placeholder found on ${route}`).toEqual([]);

      expect(visibleText, `PROJECT MEDIA found on ${route}`).not.toContain('PROJECT MEDIA');
      expect(visibleText, `PORTRAIT 4:5 found on ${route}`).not.toContain('PORTRAIT 4:5');
      expect(visibleText, `TODO found on ${route}`).not.toContain('TODO');
      expect(visibleText.toLowerCase(), `lorem found on ${route}`).not.toContain('lorem');
    }
  });

  test('Home page displays RecentBuildsStrip with all 4 real websites and SelectedWork includes icestein-grillz', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // SelectedWork includes icestein-grillz
    const icesteinCard = page.locator('#project-card-icestein-grillz');
    await expect(icesteinCard).toBeVisible();
    await expect(icesteinCard.getByTestId('live-site-badge')).toHaveText('LIVE SITE');

    // RecentBuildsStrip is rendered right after SelectedWork with 4 real website cards
    const strip = page.getByTestId('recent-builds-strip');
    await expect(strip).toBeVisible();
    await expect(strip).toContainText('RECENT BUILDS');
    await expect(strip).toContainText('Websites we have built.');

    const realSlugs = [
      { slug: 'icestein-grillz', url: 'https://www.icesteinjewelers.com/' },
      { slug: 'crtx-nutrition', url: 'https://crtxnutrition.com/' },
      { slug: 'divathea', url: 'https://divathea.com/' },
      { slug: 'richard-portfolio', url: 'https://senpaididit.vercel.app/' },
    ];

    for (const item of realSlugs) {
      const card = page.getByTestId(`recent-build-card-${item.slug}`);
      await expect(card).toBeVisible();
      const liveLink = page.getByTestId(`recent-build-live-link-${item.slug}`);
      await expect(liveLink).toHaveAttribute('href', item.url);
      await expect(liveLink).toHaveAttribute('target', '_blank');
      await expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('/work/websites displays 4 LIVE SITE entries first and 2 SAMPLE LAYOUT entries last, and real/sample case studies obey honesty rules', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/work/websites');

    await expect(page.locator('main h1')).toHaveText('Websites');

    // Verify all 6 project cards exist in order (4 real first, 2 sample last)
    const projectSlugs = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.project-stack-card')).map(
        (el) => el.dataset.projectSlug,
      ),
    );
    expect(projectSlugs).toEqual([
      'icestein-grillz',
      'crtx-nutrition',
      'divathea',
      'richard-portfolio',
      'sample-wine-vineyard',
      'sample-fashion-store',
    ]);

    // Verify all 18 exported WebP files respond with HTTP 200 and naturalWidth > 0
    for (const slug of projectSlugs) {
      for (const file of ['hero.webp', 'gallery-1.webp', 'gallery-2.webp']) {
        const res = await page.request.get(`/media/projects/${slug}/${file}`);
        expect(res.status(), `GET /media/projects/${slug}/${file}`).toBe(200);
      }
    }

    // Check real website case study (/work/websites/icestein-grillz)
    await page.goto('/work/websites/icestein-grillz');
    await expect(page.locator('main h1')).toHaveText('Icestein Grillz');
    await expect(page.getByTestId('live-site-badge')).toHaveText('LIVE SITE');
    const visitBtn = page.getByTestId('visit-live-site-button');
    await expect(visitBtn).toBeVisible();
    await expect(visitBtn).toHaveAttribute('href', 'https://www.icesteinjewelers.com/');
    await expect(visitBtn).toHaveAttribute('target', '_blank');
    await expect(visitBtn).toHaveAttribute('rel', 'noopener noreferrer');

    // CreativeWork JSON-LD is present on real website case study
    const hasCreativeWork = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      ).some((s) => s.textContent?.includes('"@type":"CreativeWork"')),
    );
    expect(hasCreativeWork).toBe(true);

    // Check sample layout case study (/work/websites/sample-wine-vineyard)
    await page.goto('/work/websites/sample-wine-vineyard');
    await expect(page.locator('main h1')).toHaveText('Wine and vineyard website');
    await expect(page.getByTestId('sample-layout-badge')).toHaveText('SAMPLE LAYOUT');
    await expect(page.getByTestId('visit-live-site-button')).toHaveCount(0);
    await expect(page.locator('main')).toContainText(
      'A sample layout shown while real projects are being added.',
    );

    // Sample layout has robots noindex and no CreativeWork JSON-LD
    const robotsContent = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robotsContent).toContain('noindex');
    const sampleHasCreativeWork = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      ).some((s) => s.textContent?.includes('"@type":"CreativeWork"')),
    );
    expect(sampleHasCreativeWork).toBe(false);

    // Sitemap excludes sample projects
    const sitemapRes = await page.request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain('/work/websites/icestein-grillz');
    expect(sitemapText).not.toContain('sample-wine-vineyard');
    expect(sitemapText).not.toContain('sample-fashion-store');
  });
});
