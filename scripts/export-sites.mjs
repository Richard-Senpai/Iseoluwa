#!/usr/bin/env node

import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.CONCEPTS_BASE_URL || '';
const OUTPUT_ROOT = path.resolve(process.cwd(), 'public/media/projects');
const ORIGINALS_ROOT = path.resolve(process.cwd(), 'assets/originals/sites');
const SYSTEM_CHROMIUM = fsSync.existsSync('/usr/bin/chromium')
  ? '/usr/bin/chromium'
  : undefined;

const SITES = [
  {
    slug: 'icestein-grillz',
    title: 'Icestein Grillz',
    kind: 'real',
    displayHost: 'icesteinjewelers.com',
    canvasBg: '#0E0D0C',
    chromeBg: '#121211',
    chromeInk: '#F5F5F3',
    accentHex: '#D4AF37',
    eyebrow: 'ICESTEIN GRILLZ · HOUSTON ATELIER',
    headline: 'Custom grillz and fine jewelry handcrafted in Houston.',
    subline: 'Online store and custom-order experience for a Houston custom grillz and fine-jewelry atelier.',
    navItems: ['GRILLZ', 'CHAINS', 'PENDANTS', 'RINGS', 'MOLD KIT'],
    cards: [
      { tag: 'CUSTOM GRILLZ', title: '10K–22K Gold & VVS Diamond', meta: 'Free Mold Kit' },
      { tag: 'ORDER FLOW', title: '4-Step Handcrafted Process', meta: 'Insured Shipping' },
      { tag: 'SHOWROOM', title: 'Direct Inquiry & Appointments', meta: 'Houston, TX' },
    ],
  },
  {
    slug: 'crtx-nutrition',
    title: 'CRTX Nutrition',
    kind: 'real',
    displayHost: 'crtxnutrition.com',
    canvasBg: '#0A0D12',
    chromeBg: '#0D1117',
    chromeInk: '#F5F7FA',
    accentHex: '#1D7AFC',
    eyebrow: 'CRTX NUTRITION · SINGLE-SKU STOREFRONT',
    headline: 'Focused single-product storefront and bundle ordering.',
    subline: 'Direct-to-consumer storefront for a single-SKU cognitive supplement, with product breakdown, ingredient story, and bundle ordering.',
    navItems: ['THE FORMULA', 'INGREDIENTS', 'BUNDLES', 'FAQ'],
    cards: [
      { tag: '01 / FORMULA', title: 'Structured Ingredient Breakdown', meta: '90 Capsules' },
      { tag: '02 / BUNDLES', title: '1-Pack, 2-Pack & 3-Pack Selector', meta: 'Direct Checkout' },
      { tag: '03 / CLARITY', title: 'Usage Guidance & Customer FAQ', meta: 'crtxnutrition.com' },
    ],
  },
  {
    slug: 'divathea',
    title: 'Divathea',
    kind: 'real',
    displayHost: 'divathea.com',
    canvasBg: '#121210',
    chromeBg: '#FAF8F5',
    chromeInk: '#141413',
    accentHex: '#19E37A',
    eyebrow: 'DIVATHEA · LIVE WEBSITE',
    headline: 'A website designed and built for Divathea.',
    subline: 'Designed and engineered by Iséoluwa.',
    navItems: ['HOME', 'COLLECTIONS', 'ABOUT', 'CONTACT'],
    cards: [
      { tag: '01 / STOREFRONT', title: 'Divathea Digital Flagship', meta: 'divathea.com' },
      { tag: '02 / INTERFACE', title: 'Responsive Desktop & Mobile', meta: 'Web Design' },
      { tag: '03 / ENGINEERING', title: 'Production Web Build', meta: 'Iséoluwa' },
    ],
  },
  {
    slug: 'richard-portfolio',
    title: 'Richard: Web Designer & Developer',
    kind: 'real',
    displayHost: 'senpaididit.vercel.app',
    canvasBg: '#0B0D0B',
    chromeBg: '#101210',
    chromeInk: '#F5F5F3',
    accentHex: '#7CE83A',
    eyebrow: 'FOUNDER PORTFOLIO · FULL-STACK WEB',
    headline: 'Design that earns attention, code that keeps it.',
    subline: 'Personal portfolio of Iséoluwa’s founder, showcasing full-stack web builds across React, Next.js, TypeScript, and WordPress.',
    navItems: ['HOME', 'ABOUT', 'WORK', 'SERVICES', 'TECH', 'CONTACT'],
    cards: [
      { tag: '01 / PROJECTS', title: 'E-Commerce & Brand Builds', meta: 'Next.js & React' },
      { tag: '02 / MOTION', title: 'Interactive Section Architecture', meta: 'TypeScript' },
      { tag: '03 / DIRECT', title: 'Direct Inquiry & Consultation', meta: 'Ibadan, NG' },
    ],
  },
  {
    slug: 'sample-wine-vineyard',
    title: 'Wine and vineyard website',
    kind: 'sample',
    displayHost: 'sample-layout',
    canvasBg: '#161311',
    chromeBg: '#F6F1E9',
    chromeInk: '#1F1815',
    accentHex: '#7A2E2E',
    eyebrow: 'SAMPLE LAYOUT · VINEYARD & CELLAR',
    headline: 'Estate wines shaped by hillside soil and slow cellar aging.',
    subline: 'A sample layout shown while real projects are being added.',
    navItems: ['WINES', 'VINEYARD', 'TASTING ROOM', 'CELLAR CLUB'],
    cards: [
      { tag: 'RESERVE', title: 'Cabernet Sauvignon', meta: 'Estate Bottled' },
      { tag: 'CELLAR', title: 'Pinot Noir Cuvée', meta: 'Small Lot' },
      { tag: 'TASTING', title: 'Vineyard Terrace Visit', meta: 'Private Booking' },
    ],
  },
  {
    slug: 'sample-fashion-store',
    title: 'Fashion store website',
    kind: 'sample',
    displayHost: 'sample-layout',
    canvasBg: '#111214',
    chromeBg: '#F7F6F2',
    chromeInk: '#121212',
    accentHex: '#1E1E1E',
    eyebrow: 'SAMPLE LAYOUT · READY-TO-WEAR STORE',
    headline: 'Tailored silhouettes and seasonal essentials for everyday wear.',
    subline: 'A sample layout shown while real projects are being added.',
    navItems: ['NEW ARRIVALS', 'WOMENSWEAR', 'MENSWEAR', 'LOOKBOOK'],
    cards: [
      { tag: 'COLLECTION 01', title: 'Structured Wool Coat', meta: 'Tailored Fit' },
      { tag: 'COLLECTION 02', title: 'Relaxed Linen Shirt', meta: 'Natural Weave' },
      { tag: 'COLLECTION 03', title: 'Pleated Wide Trouser', meta: 'Core Wardrobe' },
    ],
  },
];

const FRAMES = [
  { id: 'hero', width: 1200, height: 675, maxBytes: 300 * 1024 }, // @2x -> 2400x1350 (16:9)
  { id: 'gallery-1', width: 800, height: 1000, maxBytes: 250 * 1024 }, // @2x -> 1600x2000 (4:5)
  { id: 'gallery-2', width: 1200, height: 675, maxBytes: 250 * 1024 }, // @2x -> 2400x1350 (16:9)
];

async function readCapturedDataUrl(slug, filename) {
  try {
    const filePath = path.join(ORIGINALS_ROOT, slug, filename);
    const stat = await fs.stat(filePath);
    if (stat.size < 4500) return null;
    const buf = await fs.readFile(filePath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function buildStandaloneHtml(site, frameId, assets) {
  const badgeLabel = site.kind === 'sample' ? 'SAMPLE LAYOUT' : 'LIVE SITE';
  const urlBarLabel = site.kind === 'sample' ? 'sample-layout' : site.displayHost;

  const baseCss = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: #000;
      overflow: hidden;
    }
    .mono {
      font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  `;

  if (frameId === 'gallery-1') {
    const renderPhoneBody = (dataUrl, idx) => {
      if (dataUrl) {
        return `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;object-position:top;" />`;
      }
      return `
        <div style="display:flex;flex:1;flex-direction:column;justify-content:space-between;padding:22px;">
          <div style="border-bottom:1px solid rgba(128,128,128,0.2);padding-bottom:12px;">
            <div class="mono" style="font-size:10px;opacity:0.65;margin-bottom:4px;">${site.eyebrow}</div>
            <div style="font-size:15px;font-weight:600;">${site.title}</div>
          </div>
          <div style="margin:auto 0;display:flex;flex-direction:column;gap:14px;">
            <div style="font-size:22px;font-weight:600;line-height:1.15;letter-spacing:-0.02em;">
              ${idx === 0 ? site.headline : site.cards[0].title}
            </div>
            <div style="font-size:12px;line-height:1.5;opacity:0.75;">${site.subline}</div>
            <div style="display:flex;flex-direction:column;gap:8px;padding-top:6px;">
              ${site.cards
                .map(
                  (c) => `
                <div style="display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(128,128,128,0.25);border-radius:6px;padding:10px 12px;">
                  <span style="font-size:12px;font-weight:500;">${c.title}</span>
                  <span class="mono" style="font-size:9px;opacity:0.65;">${c.meta}</span>
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <div class="mono" style="display:flex;align-items:center;justify-content:space-between;border-radius:999px;background:${site.chromeInk};color:${site.chromeBg};padding:10px 16px;font-size:10px;">
            <span>${site.navItems[0]}</span>
            <span>→</span>
          </div>
        </div>
      `;
    };

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseCss}</style></head><body>
      <div data-site-frame="${site.slug}-${frameId}" style="width:800px;height:1000px;background:#111211;color:#F5F5F3;display:flex;flex-direction:column;justify-content:space-between;padding:44px;overflow:hidden;">
        <div class="mono" style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:16px;font-size:12px;">
          <span>${site.title} · MOBILE EXPERIENCE</span>
          <span style="border:1px solid rgba(255,255,255,0.25);border-radius:999px;padding:3px 12px;font-size:11px;">${badgeLabel}</span>
        </div>

        <div style="margin:auto 0;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;transform:translateY(-10px);">
            <div style="width:332px;height:700px;background:${site.chromeBg};color:${site.chromeInk};border-radius:28px;border:5px solid rgba(255,255,255,0.2);overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 48px rgba(0,0,0,0.45);">
              <div class="mono" style="height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid rgba(128,128,128,0.18);font-size:10px;">
                <span>9:41</span>
                <span style="width:48px;height:7px;border-radius:99px;background:rgba(128,128,128,0.25);"></span>
                <span>${urlBarLabel}</span>
              </div>
              <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
                ${renderPhoneBody(assets.mobileHero, 0)}
              </div>
            </div>
            <span class="mono" style="font-size:11px;color:rgba(255,255,255,0.65);">01 / MOBILE HERO</span>
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;transform:translateY(10px);">
            <div style="width:332px;height:700px;background:${site.chromeBg};color:${site.chromeInk};border-radius:28px;border:5px solid rgba(255,255,255,0.2);overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 48px rgba(0,0,0,0.45);">
              <div class="mono" style="height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid rgba(128,128,128,0.18);font-size:10px;">
                <span>9:41</span>
                <span style="width:48px;height:7px;border-radius:99px;background:rgba(128,128,128,0.25);"></span>
                <span>${urlBarLabel}</span>
              </div>
              <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
                ${renderPhoneBody(assets.mobileSection, 1)}
              </div>
            </div>
            <span class="mono" style="font-size:11px;color:rgba(255,255,255,0.65);">02 / MOBILE SECTION</span>
          </div>
        </div>

        <div class="mono" style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.15);padding-top:16px;font-size:12px;color:rgba(255,255,255,0.7);">
          <span>RESPONSIVE MOBILE VIEWPORTS</span>
          <span>${urlBarLabel}</span>
        </div>
      </div>
    </body></html>`;
  }

  const desktopImg = frameId === 'hero' ? assets.desktopHero : assets.desktopSection;

  const fallbackBody =
    frameId === 'hero'
      ? `
        <div style="margin:auto 0;display:grid;grid-template-columns:7fr 5fr;gap:40px;align-items:center;">
          <div style="display:flex;flex-direction:column;gap:20px;align-items:flex-start;">
            <span class="mono" style="border:1px solid rgba(128,128,128,0.3);border-radius:999px;padding:5px 14px;font-size:11px;">
              ${site.eyebrow}
            </span>
            <h1 style="font-size:46px;font-weight:600;line-height:1.05;letter-spacing:-0.03em;">
              ${site.headline}
            </h1>
            <p style="font-size:16px;line-height:1.55;opacity:0.78;max-width:48ch;">
              ${site.subline}
            </p>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${site.cards
              .map(
                (card) => `
              <div style="display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(128,128,128,0.22);border-radius:8px;padding:18px 20px;background:rgba(128,128,128,0.05);">
                <div>
                  <div class="mono" style="font-size:10px;opacity:0.65;margin-bottom:4px;">${card.tag}</div>
                  <div style="font-size:17px;font-weight:600;">${card.title}</div>
                </div>
                <span class="mono" style="font-size:11px;opacity:0.75;">${card.meta}</span>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `
      : `
        <div style="margin:auto 0;display:flex;flex-direction:column;gap:24px;">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;">
            <div>
              <div class="mono" style="font-size:11px;opacity:0.65;margin-bottom:6px;">02 / FEATURED SECTIONS</div>
              <h2 style="font-size:32px;font-weight:600;letter-spacing:-0.025em;">${site.title}</h2>
            </div>
            <span class="mono" style="font-size:11px;opacity:0.75;">${site.subline}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;">
            ${site.cards
              .map(
                (card, idx) => `
              <div style="height:245px;display:flex;flex-direction:column;justify-content:space-between;border:1px solid rgba(128,128,128,0.22);border-radius:8px;padding:24px;background:rgba(128,128,128,0.05);">
                <div class="mono" style="display:flex;align-items:center;justify-content:space-between;font-size:11px;opacity:0.65;">
                  <span>${card.tag}</span>
                  <span>0${idx + 1}</span>
                </div>
                <div>
                  <div style="font-size:22px;font-weight:600;line-height:1.25;margin-bottom:8px;">${card.title}</div>
                  <div class="mono" style="font-size:11px;opacity:0.75;">${card.meta}</div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseCss}</style></head><body>
    <div data-site-frame="${site.slug}-${frameId}" style="width:1200px;height:675px;background:${site.canvasBg};padding:28px;display:flex;flex-direction:column;overflow:hidden;">
      <div style="flex:1;background:${site.chromeBg};color:${site.chromeInk};border-radius:10px;border:1px solid rgba(255,255,255,0.16);overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 56px rgba(0,0,0,0.45);">
        <div style="height:44px;flex-shrink:0;background:#141414;color:#F5F5F3;display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:99px;background:rgba(255,255,255,0.25);"></span>
            <span style="width:10px;height:10px;border-radius:99px;background:rgba(255,255,255,0.25);"></span>
            <span style="width:10px;height:10px;border-radius:99px;background:rgba(255,255,255,0.25);"></span>
          </div>
          <div class="mono" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border-radius:999px;padding:4px 18px;font-size:11px;color:rgba(255,255,255,0.88);">
            ${site.kind === 'real' ? '<span style="width:7px;height:7px;border-radius:99px;background:#19E37A;"></span>' : ''}
            <span>${urlBarLabel}</span>
          </div>
          <div class="mono" style="font-size:10px;color:rgba(255,255,255,0.7);">${badgeLabel}</div>
        </div>

        ${
          desktopImg
            ? `<div style="flex:1;overflow:hidden;background:#000;"><img src="${desktopImg}" style="width:100%;height:100%;object-fit:cover;object-position:top;" /></div>`
            : `<div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:40px 44px;">
                <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(128,128,128,0.2);padding-bottom:18px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <span class="mono" style="width:32px;height:32px;border-radius:99px;background:${site.accentHex};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">
                      ${site.title.slice(0, 2).toUpperCase()}
                    </span>
                    <span style="font-size:18px;font-weight:600;">${site.title}</span>
                  </div>
                  <div class="mono" style="display:flex;align-items:center;gap:24px;font-size:11px;opacity:0.75;">
                    ${site.navItems.map((n) => `<span>${n}</span>`).join('')}
                  </div>
                  <span class="mono" style="border:1px solid rgba(128,128,128,0.3);border-radius:999px;padding:5px 14px;font-size:11px;">
                    ${badgeLabel}
                  </span>
                </div>
                ${fallbackBody}
                <div class="mono" style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(128,128,128,0.2);padding-top:14px;font-size:11px;opacity:0.65;">
                  <span>${site.title}</span>
                  <span>${urlBarLabel}</span>
                </div>
              </div>`
        }
      </div>
    </div>
  </body></html>`;
}

async function encodeWebpUnderCap(pngBuf, targetW, targetH, maxBytes) {
  let quality = 84;
  let webpBuf = await sharp(pngBuf)
    .resize(targetW, targetH, { fit: 'cover' })
    .webp({ quality })
    .toBuffer();

  while (webpBuf.byteLength > maxBytes && quality >= 50) {
    quality -= 6;
    webpBuf = await sharp(pngBuf)
      .resize(targetW, targetH, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();
  }

  return webpBuf;
}

async function main() {
  console.log('[sites:export] Exporting 6 website project showcases (18 WebP frames) into public/media/projects/<slug>/...');
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const browser = await chromium.launch(
    SYSTEM_CHROMIUM
      ? {
          executablePath: SYSTEM_CHROMIUM,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : undefined,
  );

  try {
    const context = await browser.newContext({
      deviceScaleFactor: 2,
      viewport: { width: 1200, height: 1000 },
    });
    const page = await context.newPage();

    for (const site of SITES) {
      const projectDir = path.join(OUTPUT_ROOT, site.slug);
      await fs.mkdir(projectDir, { recursive: true });

      const assets = {
        desktopHero: await readCapturedDataUrl(site.slug, 'desktop-hero.png'),
        desktopSection: await readCapturedDataUrl(site.slug, 'desktop-section-1.png'),
        mobileHero: await readCapturedDataUrl(site.slug, 'mobile-hero.png'),
        mobileSection: await readCapturedDataUrl(site.slug, 'mobile-section-1.png'),
      };

      for (const frame of FRAMES) {
        await page.setViewportSize({ width: frame.width, height: frame.height });

        if (BASE_URL) {
          const url = `${BASE_URL}/dev/concepts?slug=${site.slug}&frame=${frame.id}`;
          await page.goto(url, { waitUntil: 'networkidle' });
        } else {
          const html = buildStandaloneHtml(site, frame.id, assets);
          await page.setContent(html, { waitUntil: 'load' });
        }

        const locator = page.locator(`[data-site-frame="${site.slug}-${frame.id}"]`);
        await locator.waitFor({ state: 'visible' });

        const pngBuf = await locator.screenshot({ type: 'png' });
        const targetW = frame.width * 2;
        const targetH = frame.height * 2;
        const webpBuf = await encodeWebpUnderCap(pngBuf, targetW, targetH, frame.maxBytes);

        const outPath = path.join(projectDir, `${frame.id}.webp`);
        await fs.writeFile(outPath, webpBuf);
        const kb = Math.round(webpBuf.byteLength / 1024);
        console.log(
          `  ✓ ${site.slug}/${frame.id}.webp (${targetW}x${targetH}, ${kb} KB, captured=${Boolean(assets.desktopHero)})`,
        );
      }
    }

    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[sites:export] Fatal error:', err);
  process.exit(1);
});
