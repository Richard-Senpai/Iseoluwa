import { IBM_Plex_Mono } from 'next/font/google';
// import localFont from 'next/font/local';

/**
 * IBM Plex Mono — loaded via next/font/google for labels, tags, counters, and small details.
 */
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * Aeonik — commercial typeface by CoType Foundry.
 *
 * Until the licensed WOFF2 files (Aeonik-Regular.woff2, Aeonik-Medium.woff2, and optionally
 * Aeonik-Light.woff2) are placed into `src/assets/fonts/`, `--font-sans` falls back to the
 * neutral system sans-serif stack defined in `src/styles/tokens.css`:
 *   system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif
 *
 * Once the WOFF2 files are added to `src/assets/fonts/`, uncomment the `localFont` block below
 * and include `aeonik.variable` in `getFontVariables()`.
 */
/*
export const aeonik = localFont({
  src: [
    {
      path: '../assets/fonts/Aeonik-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Aeonik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});
*/

export function getFontVariables(): string {
  return ibmPlexMono.variable;
}
