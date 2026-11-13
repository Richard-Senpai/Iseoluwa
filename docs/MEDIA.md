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
