#!/usr/bin/env node

import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT_DIR = process.cwd();
const ORIGINALS_ROOT = path.resolve(ROOT_DIR, 'assets/originals/sites');
const SYSTEM_CHROMIUM = fsSync.existsSync('/usr/bin/chromium')
  ? '/usr/bin/chromium'
  : undefined;

const SITES_TO_CAPTURE = [
  {
    slug: 'icestein-grillz',
    title: 'Icestein Grillz',
    url: 'https://www.icesteinjewelers.com/',
    kind: 'real',
    displayHost: 'icesteinjewelers.com',
  },
  {
    slug: 'crtx-nutrition',
    title: 'CRTX Nutrition',
    url: 'https://crtxnutrition.com/',
    kind: 'real',
    displayHost: 'crtxnutrition.com',
  },
  {
    slug: 'divathea',
    title: 'Divathea',
    url: 'https://divathea.com/',
    kind: 'real',
    displayHost: 'divathea.com',
  },
  {
    slug: 'richard-portfolio',
    title: 'Richard: Web Designer & Developer',
    url: 'https://senpaididit.vercel.app/',
    kind: 'real',
    displayHost: 'senpaididit.vercel.app',
  },
  {
    slug: 'sample-wine-vineyard',
    title: 'Wine and vineyard website',
    url: 'https://preview.themeforest.net/item/vineso-wine-vineyard-wordpress-theme/full_screen_preview/61415625',
    kind: 'sample',
    displayHost: 'sample-layout',
  },
  {
    slug: 'sample-fashion-store',
    title: 'Fashion store website',
    url: 'https://preview.themeforest.net/item/clotya-fashion-store-ecommerce-theme/full_screen_preview/38493181',
    kind: 'sample',
    displayHost: 'sample-layout',
  },
];

const POPUP_CSS = `
  [id*="cookie" i], [class*="cookie" i],
  [id*="consent" i], [class*="consent" i],
  [id*="klaviyo" i], [class*="klaviyo" i],
  [id*="privy" i], [class*="privy" i],
  [id*="intercom" i], [class*="intercom" i],
  [id*="crisp" i], [class*="crisp" i],
  [id*="tidio" i], [class*="tidio" i],
  [id*="tawk" i], [class*="tawk" i],
  .preview__header, #preview-bar {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function hasCompleteSet(dir) {
  const required = [
    'desktop-hero.png',
    'desktop-section-1.png',
    'desktop-section-2.png',
    'mobile-hero.png',
    'mobile-section-1.png',
  ];
  for (const name of required) {
    if (!(await fileExists(path.join(dir, name)))) return false;
  }
  return true;
}

async function isBotOrErrorPage(page) {
  try {
    const text = (await page.evaluate(() => document.body?.innerText || '')).toLowerCase();
    const title = (await page.title()).toLowerCase();
    const botMarkers = [
      'just a moment...',
      'verify you are human',
      'attention required! | cloudflare',
      'checking your browser',
      'enable javascript and cookies to continue',
      'cf-browser-verification',
    ];
    for (const marker of botMarkers) {
      if (text.includes(marker) || title.includes(marker)) {
        return true;
      }
    }
    return false;
  } catch {
    return true;
  }
}

async function resolveTargetFrameOrPage(page, url) {
  if (!url.includes('preview.themeforest.net')) {
    return page;
  }
  try {
    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector('iframe.full-screen-preview__frame, iframe');
      return iframe ? iframe.getAttribute('src') : null;
    });
    if (iframeSrc && iframeSrc.startsWith('http')) {
      await page.goto(iframeSrc, { waitUntil: 'domcontentloaded', timeout: 20000 });
    }
  } catch {
    // Keep current page if iframe extraction fails
  }
  return page;
}

async function captureSite(browser, site, skipExisting) {
  const outDir = path.join(ORIGINALS_ROOT, site.slug);
  await fs.mkdir(outDir, { recursive: true });

  if (skipExisting && (await hasCompleteSet(outDir))) {
    console.log(`  ↷ Skipping ${site.slug} (--skip-existing: all 5 PNGs already present)`);
    return { slug: site.slug, status: 'skipped' };
  }

  // 1. Desktop captures (1440x900 @2x)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });
  const desktopPage = await desktopContext.newPage();

  try {
    const response = await desktopPage.goto(site.url, {
      waitUntil: 'domcontentloaded',
      timeout: 22000,
    });
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response ? response.status() : 'NO_RESPONSE'}`);
    }

    await resolveTargetFrameOrPage(desktopPage, site.url);
    await desktopPage.waitForTimeout(1500);

    if (await isBotOrErrorPage(desktopPage)) {
      throw new Error('Blocked by anti-bot challenge or verification screen');
    }

    await desktopPage.addStyleTag({ content: POPUP_CSS }).catch(() => {});

    await desktopPage.evaluate(() => window.scrollTo(0, 0));
    await desktopPage.waitForTimeout(400);
    const heroPath = path.join(outDir, 'desktop-hero.png');
    await desktopPage.screenshot({
      path: heroPath,
      type: 'png',
    });

    // Check if the rendered page is a blank white/solid bot wall (e.g. Cloudflare empty body)
    const { default: sharp } = await import('sharp');
    const heroStats = await sharp(heroPath).stats();
    const maxStdev = Math.max(...heroStats.channels.map((c) => c.stdev));
    if (maxStdev < 2) {
      await fs.unlink(heroPath).catch(() => {});
      throw new Error('Rendered page is blank (blocked by bot protection)');
    }

    await desktopPage.evaluate(() => window.scrollTo(0, 900));
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({
      path: path.join(outDir, 'desktop-section-1.png'),
      type: 'png',
    });

    await desktopPage.evaluate(() => window.scrollTo(0, 1800));
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({
      path: path.join(outDir, 'desktop-section-2.png'),
      type: 'png',
    });
  } finally {
    await desktopContext.close();
  }

  // 2. Mobile captures (390x844 @2x)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    ignoreHTTPSErrors: true,
  });
  const mobilePage = await mobileContext.newPage();

  try {
    await mobilePage.goto(site.url, {
      waitUntil: 'domcontentloaded',
      timeout: 22000,
    });
    await resolveTargetFrameOrPage(mobilePage, site.url);
    await mobilePage.waitForTimeout(1500);
    await mobilePage.addStyleTag({ content: POPUP_CSS }).catch(() => {});

    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    await mobilePage.waitForTimeout(400);
    await mobilePage.screenshot({
      path: path.join(outDir, 'mobile-hero.png'),
      type: 'png',
    });

    await mobilePage.evaluate(() => window.scrollTo(0, 844));
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({
      path: path.join(outDir, 'mobile-section-1.png'),
      type: 'png',
    });
  } finally {
    await mobileContext.close();
  }

  console.log(`  ✓ Captured live screenshots for ${site.slug} (${site.url})`);
  return { slug: site.slug, status: 'captured' };
}

async function main() {
  const skipExisting = process.argv.includes('--skip-existing');
  console.log(
    `[sites:capture] Capturing website screenshots into assets/originals/sites/<slug>/ (skipExisting=${skipExisting})...`,
  );
  await fs.mkdir(ORIGINALS_ROOT, { recursive: true });

  const browser = await chromium.launch(
    SYSTEM_CHROMIUM
      ? {
          executablePath: SYSTEM_CHROMIUM,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : undefined,
  );

  const results = [];

  try {
    for (const site of SITES_TO_CAPTURE) {
      try {
        const res = await captureSite(browser, site, skipExisting);
        results.push(res);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(
          `  ⚠ Could not capture live URL for ${site.slug} (${site.url}): ${msg}.`,
        );
        console.warn(
          `    Place manual screenshots in assets/originals/sites/${site.slug}/ or run pnpm sites:export to render showcase frames.`,
        );
        results.push({ slug: site.slug, status: 'unreachable', reason: msg });
      }
    }
  } finally {
    await browser.close();
  }

  console.log('[sites:capture] Summary:', JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('[sites:capture] Fatal error:', err);
  process.exit(1);
});
