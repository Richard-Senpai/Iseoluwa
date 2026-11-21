# Iséoluwa Website — Media Assets & Concept Projects Guide

This document lists every media file in `public/media/concepts/<slug>/` and `public/images/`, its license/source, and step-by-step instructions for regenerating concept assets or replacing them with live client work.

---

## 1. Exporting / Regenerating Concept Project Media (`pnpm concepts:export`)

All 12 concept projects are composed as live React/Tailwind boards at the dev-only route `/dev/concepts` (`src/app/dev/concepts/page.tsx`) using three composition components:
- `<BrandBoard />` (`src/features/concepts/BrandBoard.tsx`) — Branding concept boards (`ayo-roasters`, `marlo-and-finch`, `northfield-legal`, `sol-skin`)
- `<BrowserFrame />` (`src/features/concepts/BrowserFrame.tsx`) — Web Design live mini-sites inside browser/mobile chrome (`haven-stays`, `adire-atelier`, `ledgerly`, `lumen-dental`)
- `<SocialGrid />` (`src/features/concepts/SocialGrid.tsx`) — Digital Marketing 9-post launch grids, story sequences, and OOH posters (`fresh-basket`, `pulse-fitness`, `studio-rue`, `brightpath-academy`)

To regenerate all 36 high-resolution WebP frames (`2400×1350` 16:9 and `1600×2000` 4:5) and the 3 WebM video loops (`loop.webm`):

```bash
# With the dev server running on http://localhost:3000 (or ALLOW_CONCEPTS_EXPORT=1 pnpm start):
pnpm concepts:export
```

---

## 2. Concept Project Media Inventory (`public/media/concepts/<slug>/`)

| Category | Slug | Project | Files Generated | Studio / Editorial Reference & License |
|---|---|---|---|---|
| **Branding** | `ayo-roasters` | **Ayo Roasters** *(Featured)* | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`), `loop.webm` | Incorporates studio branding asset `/images/work/branding/branding-01.png` + original vector identity board. Unsplash reference search: `https://unsplash.com/s/photos/specialty-coffee-roaster` (Unsplash License) |
| **Branding** | `marlo-and-finch` | **Marlo & Finch** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Incorporates studio branding asset `/images/work/branding/branding-02.png` + original vector identity board. Unsplash reference search: `https://unsplash.com/s/photos/independent-bookshop-interior` (Unsplash License) |
| **Branding** | `northfield-legal` | **Northfield Legal** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Incorporates studio branding asset `/images/work/branding/branding-03.png` + original vector identity board. Unsplash reference search: `https://unsplash.com/s/photos/minimal-office-stationery` (Unsplash License) |
| **Branding** | `sol-skin` | **Sol Skin** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Incorporates studio branding asset `/images/work/branding/branding-04.png` + original vector identity board. Unsplash reference search: `https://unsplash.com/s/photos/minimal-skincare-packaging` (Unsplash License) |
| **Websites** | `haven-stays` | **Haven Stays** *(Featured)* | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`), `loop.webm` | Original studio UI/UX composition (`<BrowserFrame />`). Optional editorial room photo search: `https://unsplash.com/s/photos/minimalist-apartment-living-room` (Unsplash License) |
| **Websites** | `adire-atelier` | **Adire Atelier** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio UI/UX composition (`<BrowserFrame />`). Optional textile photo search: `https://unsplash.com/s/photos/hand-dyed-indigo-fabric` (Unsplash License) |
| **Websites** | `ledgerly` | **Ledgerly** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio UI/UX composition (`<BrowserFrame />`). Optional workspace photo search: `https://unsplash.com/s/photos/minimal-desk-laptop` (Unsplash License) |
| **Websites** | `lumen-dental` | **Lumen Dental** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio UI/UX composition (`<BrowserFrame />`). Optional clinic photo search: `https://unsplash.com/s/photos/minimal-wellness-clinic` (Unsplash License) |
| **Marketing** | `fresh-basket` | **Fresh Basket** *(Featured)* | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`), `loop.webm` | Original studio campaign composition (`<SocialGrid />`). Optional produce photo search: `https://unsplash.com/s/photos/organic-produce-basket` (Unsplash License) |
| **Marketing** | `pulse-fitness` | **Pulse Fitness** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio campaign composition (`<SocialGrid />`). Optional studio photo search: `https://unsplash.com/s/photos/strength-training-studio` (Unsplash License) |
| **Marketing** | `studio-rue` | **Studio Rue** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio campaign composition (`<SocialGrid />`). Optional lookbook photo search: `https://unsplash.com/s/photos/linen-fashion-lookbook` (Unsplash License) |
| **Marketing** | `brightpath-academy` | **BrightPath Academy** | `hero.webp` (`2400×1350`), `gallery-01.webp` (`2400×1350`), `gallery-02.webp` (`1600×2000`) | Original studio campaign composition (`<SocialGrid />`). Optional cohort photo search: `https://unsplash.com/s/photos/software-engineering-student` (Unsplash License) |

---

## 3. Replacing a Concept Project with a Real Client Case Study

Swapping in real client work is a data-only change:
1. Place the client's exported WebP/AVIF images and `.webm`/`.mp4` loops under `public/media/work/<slug>/`.
2. In `src/content/projects.ts`, update the project entry's `slug`, `title`, `year`, `client`, `services`, `summary`, `challenge`, `approach`, `outcome`, `result`, and `media` paths, and set `isConcept: false`.
3. Once all concept projects are replaced (or whenever desired), flip `SHOW_CONCEPT_BADGE = false` and `SHOW_PHOTO_CREDITS = false` in `src/config/site.ts`.

---

## 4. Team Portraits (`public/media/team/` & `pnpm team:images`)

Original team portraits are stored in `assets/originals/team/` (outside `public/`, so they are never served raw) and processed into `public/media/team/` via `pnpm team:images` (`scripts/team-images.mjs` using `sharp`):

| # | Member | Role | Original File (`assets/originals/team/`) | Optimised Output (`public/media/team/`) | Focal Point | Status |
|---|---|---|---|---|---|---|
| 1 | **Ojedayo Richard Iseoluwa** | Founder | `iseoluwa-portrait.png` | `iseoluwa-portrait.{webp,avif}`, `-800.{webp,avif}`, `-1600.{webp,avif}` | `{ x: 0.5, y: 0.42 }` | Found & processed |
| 2 | **Daniel Oshinaike** | Co-Founder | `daniel-portrait.png` | `daniel-portrait.{webp,avif}`, `-800.{webp,avif}`, `-1600.{webp,avif}` | `{ x: 0.5, y: 0.48 }` | Found & processed |
| 3 | **Abdulmaleek Asimiyu** | Developer | `maleek-portrait.png` | `maleek-portrait.{webp,avif}`, `-800.{webp,avif}`, `-1600.{webp,avif}` | `{ x: 0.48, y: 0.44 }` | Found & processed |
| 4 | **Jessica Omotayo** | Marketer and Social Media Manager | `jessica-portrait.png` | `jessica-portrait.{webp,avif}`, `-800.{webp,avif}`, `-1600.{webp,avif}` | `{ x: 0.5, y: 0.38 }` | Found & processed |

To add or replace a team portrait:
1. Place the high-resolution source portrait in `assets/originals/team/<id>-portrait.png` (or `.jpg`/`.webp`).
2. Adjust the member's `focalPoint` in `scripts/team-images.mjs` and `src/content/team.ts` if needed.
3. Run `pnpm team:images` to regenerate the 4:5 cropped WebP and AVIF files (`1600×2000` and `800×1000`, capped at source resolution without upscaling) and update the base64 blur placeholders in `src/content/team-blur.ts`.

---

## 5. Name Section Scroll-Scrub Media (`public/media/scrub/name-section/` & `pnpm media:scrub`)

- **Original Video Location**: `assets/originals/name-section-source.mp4` (`19.22 MB`, `720×1280`, `19.970s @ 24 fps`, `h264`, audio track stripped during processing; never placed in `public/`).
- **Generated Output (`public/media/scrub/name-section/`)**:
  - `desktop/frame_0001.webp` .. `frame_0190.webp`: 190 frames (`720×1280`, WebP q=78) — **3.35 MB** (`3,516,092 bytes`, within the 8 MB budget).
  - `mobile/frame_0001.webp` .. `frame_0190.webp`: 190 frames (`720×1280`, WebP q=74) — **2.99 MB** (`3,139,984 bytes`, within the 5 MB budget).
  - `poster-first.webp` & `poster-last.webp`: Instant first-frame and reduced-motion/no-JS finished-frame posters.
  - `manifest.json`: Frame counts, dimensions, URL patterns, aspect ratio (`9 / 16`), corner-sampled background colour (`#101010`), and 20 px base64 `blurDataURL`.
- **Review Files**:
  - `docs/media-review/name-section-contact-sheet.jpg` (24 evenly spaced frames across the sequence)
  - `docs/media-review/name-section-report.md` (inspection details, cut analysis, and weights)

### Re-Running with Different `--start`, `--end`, or `--frames` Values
```bash
# Default run (full 0.00s – 19.97s range, 190 frames):
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section

# Example: Scrub only the first transformation (0.00s to 5.20s, black -> smooth white "i"):
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section --start 0 --end 5.2 --frames 120

# Example: Scrub the second transformation (5.20s to 19.97s, white -> sculpted stone "i"):
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section --start 5.2 --end 19.97 --frames 160
```

### Replacing the Animation with a New Video Later
1. Replace `assets/originals/name-section-source.mp4` with the new source video file.
2. Run `pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section`.
3. If the subject changed, update `ABOUT_CONTENT.nameSectionMedia.alt` in `src/features/about/about.content.ts`.

---

## 6. Real Websites & Sample Layouts (`pnpm sites:capture` & `pnpm sites:export`)

The **Websites** category (`src/content/projects.ts`) contains 4 real websites built by Iséoluwa (`kind: "real"`) and 2 clearly labelled sample layouts (`kind: "sample"`):

| # | Slug | Title | URL | Kind | Capture & Export Status |
|---|---|---|---|---|---|
| 1 | `icestein-grillz` | **Icestein Grillz** | `https://www.icesteinjewelers.com/` | `real` | Live desktop & mobile screenshots captured (`assets/originals/sites/icestein-grillz/`); exported to `public/media/projects/icestein-grillz/{hero,gallery-1,gallery-2}.webp` |
| 2 | `crtx-nutrition` | **CRTX Nutrition** | `https://crtxnutrition.com/` | `real` | Live desktop & mobile screenshots captured (`assets/originals/sites/crtx-nutrition/`); exported to `public/media/projects/crtx-nutrition/{hero,gallery-1,gallery-2}.webp` |
| 3 | `divathea` | **Divathea** | `https://divathea.com/` | `real` | Blocked by anti-bot challenge during automated headless capture; uses neutral factual copy (`"A website designed and built for Divathea."`) and clean browser-chrome showcase frames (`public/media/projects/divathea/{hero,gallery-1,gallery-2}.webp`) until manual screenshots are placed in `assets/originals/sites/divathea/` |
| 4 | `richard-portfolio` | **Richard: Web Designer & Developer** | `https://senpaididit.vercel.app/` | `real` | Live desktop & mobile screenshots captured (`assets/originals/sites/richard-portfolio/`); exported to `public/media/projects/richard-portfolio/{hero,gallery-1,gallery-2}.webp` |
| 5 | `sample-wine-vineyard` | **Wine and vineyard website** | ThemeForest preview (`61415625`) | `sample` | Clearly labelled `SAMPLE LAYOUT` (`noindex`, excluded from `sitemap.xml` and JSON-LD, no external live link) |
| 6 | `sample-fashion-store` | **Fashion store website** | ThemeForest preview (`38493181`) | `sample` | Clearly labelled `SAMPLE LAYOUT` (`noindex`, excluded from `sitemap.xml` and JSON-LD, no external live link) |

### Commands
```bash
# 1. Capture live desktop (1440x900 @2x) and mobile (390x844 @2x) screenshots into assets/originals/sites/<slug>/:
pnpm sites:capture

# Skip sites that already have all 5 PNGs in assets/originals/sites/<slug>/:
pnpm sites:capture -- --skip-existing

# 2. Compose and export 16:9 hero.webp (2400x1350, <= 300 KB), 4:5 gallery-1.webp (1600x2000, <= 250 KB),
#    and 16:9 gallery-2.webp (2400x1350, <= 250 KB) into public/media/projects/<slug>/:
pnpm sites:export
```

### Replacing Manual Screenshots or Hiding Sample Layouts
- **To supply manual screenshots for `divathea` (or any site behind a bot wall)**:
  1. Save `desktop-hero.png`, `desktop-section-1.png`, `desktop-section-2.png`, `mobile-hero.png`, and `mobile-section-1.png` into `assets/originals/sites/divathea/`.
  2. Run `pnpm sites:export` to regenerate `public/media/projects/divathea/{hero,gallery-1,gallery-2}.webp`.
- **To hide the two `SAMPLE LAYOUT` entries once more real client websites are ready**:
  - Flip `export const SHOW_SAMPLE_PROJECTS = false;` in `src/config/site.ts`.
