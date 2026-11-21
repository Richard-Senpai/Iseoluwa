import fs from 'node:fs';
import path from 'node:path';
import type { SiteCaptureEntry } from '../../../scripts/sites.config';
import { SITES_TO_CAPTURE } from '../../../scripts/sites.config';

export type SiteShowcaseFrameId = 'hero' | 'gallery-1' | 'gallery-2';

export interface SiteShowcaseProps {
  site: SiteCaptureEntry;
  frame: SiteShowcaseFrameId;
}

export function getSiteEntryBySlug(slug: string): SiteCaptureEntry | undefined {
  return SITES_TO_CAPTURE.find((entry: SiteCaptureEntry) => entry.slug === slug);
}

function readCapturedPngDataUrl(slug: string, filename: string): string | null {
  try {
    const filePath = path.resolve(process.cwd(), 'assets/originals/sites', slug, filename);
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    if (stat.size < 4500) return null; // guard against blank/empty PNGs
    const buf = fs.readFileSync(filePath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

interface FallbackVisualSpec {
  canvasBg: string;
  chromeBg: string;
  chromeInk: string;
  accentHex: string;
  eyebrow: string;
  headline: string;
  subline: string;
  navItems: string[];
  cards: Array<{ tag: string; title: string; meta: string }>;
}

const FALLBACK_SPECS: Record<string, FallbackVisualSpec> = {
  divathea: {
    canvasBg: '#121210',
    chromeBg: '#FAF8F5',
    chromeInk: '#141413',
    accentHex: '#19E37A',
    eyebrow: 'DIVATHEA · LIVE WEBSITE',
    headline: 'A website designed and built for Divathea.',
    subline: 'Designed and engineered by Iséoluwa.',
    navItems: ['HOME', 'COLLECTIONS', 'STORY', 'CONTACT'],
    cards: [
      { tag: '01', title: 'Editorial Storefront', meta: 'divathea.com' },
      { tag: '02', title: 'Responsive Layout', meta: 'Desktop & Mobile' },
      { tag: '03', title: 'Direct Experience', meta: 'Built by Iséoluwa' },
    ],
  },
  'sample-wine-vineyard': {
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
  'sample-fashion-store': {
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
};

function getFallbackSpec(site: SiteCaptureEntry): FallbackVisualSpec {
  return (
    FALLBACK_SPECS[site.slug] ?? {
      canvasBg: '#0E0E0E',
      chromeBg: '#F8F8F6',
      chromeInk: '#111111',
      accentHex: '#19E37A',
      eyebrow: site.kind === 'sample' ? 'SAMPLE LAYOUT' : 'LIVE SITE',
      headline: site.title,
      subline:
        site.kind === 'sample'
          ? 'A sample layout shown while real projects are being added.'
          : `A website designed and built for ${site.title}.`,
      navItems: ['OVERVIEW', 'FEATURES', 'GALLERY', 'CONTACT'],
      cards: [
        { tag: '01', title: 'Primary View', meta: site.displayHost },
        { tag: '02', title: 'Responsive Interface', meta: 'Desktop & Mobile' },
        { tag: '03', title: 'Full-Stack Build', meta: 'Iséoluwa' },
      ],
    }
  );
}

/**
 * `<SiteShowcase />` composition component (`src/features/concepts/SiteShowcase.tsx`)
 * Renders the 3 portfolio frames for each of the 6 website entries:
 * - `hero`: 16:9 (`1200x675` @2x -> `2400x1350`) desktop browser window showing the real captured hero screenshot.
 * - `gallery-1`: 4:5 (`800x1000` @2x -> `1600x2000`) two mobile device frames side by side (`mobile-hero.png` + `mobile-section-1.png`).
 * - `gallery-2`: 16:9 (`1200x675` @2x -> `2400x1350`) mid-page desktop view (`desktop-section-1.png`).
 */
export function SiteShowcase({ site, frame }: SiteShowcaseProps) {
  const spec = getFallbackSpec(site);
  const badgeLabel = site.kind === 'sample' ? 'SAMPLE LAYOUT' : 'LIVE SITE';
  const urlBarLabel = site.kind === 'sample' ? 'sample-layout' : site.displayHost;

  if (frame === 'gallery-1') {
    const mobileHeroDataUrl = readCapturedPngDataUrl(site.slug, 'mobile-hero.png');
    const mobileSectionDataUrl = readCapturedPngDataUrl(site.slug, 'mobile-section-1.png');

    return (
      <div
        data-site-frame={`${site.slug}-${frame}`}
        style={{ backgroundColor: '#111211', color: '#F5F5F3' }}
        className="relative flex h-[1000px] w-[800px] flex-col justify-between overflow-hidden p-11 font-sans"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 font-mono text-xs uppercase tracking-[0.08em]">
          <span>{site.title} · MOBILE EXPERIENCE</span>
          <span className="rounded-full border border-white/20 px-3 py-0.5 text-[11px]">
            {badgeLabel}
          </span>
        </div>

        {/* Two Mobile Device Frames side by side */}
        <div className="my-auto grid grid-cols-2 items-center gap-8 py-4">
          {[
            { src: mobileHeroDataUrl, label: '01 / MOBILE HERO', offsetClass: '-translate-y-3' },
            {
              src: mobileSectionDataUrl,
              label: '02 / MOBILE SECTION',
              offsetClass: 'translate-y-3',
            },
          ].map((phone, idx) => (
            <div
              key={phone.label}
              className={`flex flex-col items-center gap-3 ${phone.offsetClass}`}
            >
              <div
                style={{ backgroundColor: spec.chromeBg, color: spec.chromeInk }}
                className="relative flex h-[700px] w-[332px] flex-col overflow-hidden rounded-[28px] border-[5px] border-white/20 shadow-2xl"
              >
                {/* Mobile status bar */}
                <div className="flex h-8 shrink-0 items-center justify-between border-b border-black/10 px-4 font-mono text-[10px]">
                  <span>9:41</span>
                  <span className="h-2 w-12 rounded-full bg-black/15" />
                  <span>{urlBarLabel}</span>
                </div>

                {phone.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={phone.src}
                    alt={`${site.title} mobile capture ${idx + 1}`}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-2 border-b border-black/10 pb-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-65">
                        {spec.eyebrow}
                      </span>
                      <p className="text-base font-medium">{site.title}</p>
                    </div>

                    <div className="my-auto space-y-4">
                      <h2 className="text-2xl font-medium leading-tight tracking-[-0.02em]">
                        { idx === 0 ? spec.headline : spec.cards[0]?.title }
                      </h2>
                      <p className="text-xs leading-relaxed opacity-75">{spec.subline}</p>
                      <div className="space-y-2 pt-2">
                        {spec.cards.map((c) => (
                          <div
                            key={c.title}
                            className="flex items-center justify-between rounded border border-black/15 px-3 py-2.5"
                          >
                            <span className="text-xs font-medium">{c.title}</span>
                            <span className="font-mono text-[10px] opacity-65">{c.meta}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{ backgroundColor: spec.chromeInk, color: spec.chromeBg }}
                      className="flex items-center justify-between rounded-full px-4 py-2.5 font-mono text-[10px] uppercase"
                    >
                      <span>{spec.navItems[0]}</span>
                      <span>→</span>
                    </div>
                  </div>
                )}
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/60">
                {phone.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-white/15 pt-4 font-mono text-xs uppercase tracking-[0.08em] text-white/70">
          <span>RESPONSIVE MOBILE VIEWPORTS</span>
          <span>{urlBarLabel}</span>
        </div>
      </div>
    );
  }

  // 16:9 Landscape Browser Window (`hero` or `gallery-2`, 1200x675 @2x -> 2400x1350)
  const screenshotFilename = frame === 'hero' ? 'desktop-hero.png' : 'desktop-section-1.png';
  const desktopDataUrl = readCapturedPngDataUrl(site.slug, screenshotFilename);

  return (
    <div
      data-site-frame={`${site.slug}-${frame}`}
      style={{ backgroundColor: spec.canvasBg, color: '#F5F5F3' }}
      className="relative flex h-[675px] w-[1200px] flex-col justify-between overflow-hidden p-7 font-sans"
    >
      {/* Clean Neutral Browser Chrome */}
      <div
        style={{
          backgroundColor: spec.chromeBg,
          color: spec.chromeInk,
        }}
        className="flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-white/15 shadow-2xl"
      >
        {/* Browser Top Bar */}
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/10 bg-[#141414] px-5 text-[#F5F5F3]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-1 font-mono text-[11px] tracking-[0.04em] text-white/85">
            {site.kind === 'real' && (
              <span className="h-2 w-2 rounded-full bg-[#19E37A]" />
            )}
            <span>{urlBarLabel}</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/70">
            {badgeLabel}
          </div>
        </div>

        {/* Viewport Content */}
        {desktopDataUrl ? (
          <div className="relative flex-1 overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={desktopDataUrl}
              alt={`${site.title} ${frame}`}
              className="h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between p-11">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-black/12 pb-5">
              <div className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: spec.accentHex, color: '#FFFFFF' }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium"
                >
                  {site.title.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-lg font-medium tracking-tight">{site.title}</span>
              </div>
              <div className="flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.06em] opacity-75">
                {spec.navItems.map((nav) => (
                  <span key={nav}>{nav}</span>
                ))}
              </div>
              <span className="rounded-full border border-black/20 px-4 py-1.5 font-mono text-[11px] uppercase">
                {badgeLabel}
              </span>
            </div>

            {/* Body */}
            {frame === 'hero' ? (
              <div className="my-auto grid grid-cols-12 items-center gap-10 py-6">
                <div className="col-span-7 space-y-5">
                  <span className="inline-block rounded-full border border-black/20 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em]">
                    {spec.eyebrow}
                  </span>
                  <h1 className="text-5xl font-medium leading-[1.05] tracking-[-0.03em]">
                    {spec.headline}
                  </h1>
                  <p className="max-w-[48ch] text-base leading-relaxed opacity-75">
                    {spec.subline}
                  </p>
                </div>
                <div className="col-span-5 space-y-3">
                  {spec.cards.map((card) => (
                    <div
                      key={card.title}
                      className="flex items-center justify-between rounded-[8px] border border-black/15 bg-black/[0.03] p-5"
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-60">
                          {card.tag}
                        </span>
                        <p className="text-lg font-medium">{card.title}</p>
                      </div>
                      <span className="font-mono text-xs opacity-70">{card.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="my-auto space-y-6 py-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] opacity-60">
                      02 / FEATURED SECTIONS
                    </span>
                    <h2 className="text-3xl font-medium tracking-[-0.025em]">
                      {site.title}
                    </h2>
                  </div>
                  <span className="font-mono text-xs opacity-70">{spec.subline}</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {spec.cards.map((card, idx) => (
                    <div
                      key={card.title}
                      className="flex h-64 flex-col justify-between rounded-[8px] border border-black/15 bg-black/[0.03] p-6"
                    >
                      <div className="flex items-center justify-between font-mono text-xs opacity-65">
                        <span>{card.tag}</span>
                        <span>0{idx + 1}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-medium leading-snug">{card.title}</p>
                        <p className="font-mono text-xs opacity-70">{card.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer line */}
            <div className="flex items-center justify-between border-t border-black/12 pt-4 font-mono text-[11px] uppercase tracking-[0.08em] opacity-65">
              <span>{site.title}</span>
              <span>{urlBarLabel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
