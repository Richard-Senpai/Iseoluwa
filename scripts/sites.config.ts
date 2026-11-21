export interface SiteCaptureEntry {
  slug: string;
  title: string;
  url: string;
  kind: 'real' | 'sample';
  displayHost: string;
}

export const SITES_TO_CAPTURE: SiteCaptureEntry[] = [
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
