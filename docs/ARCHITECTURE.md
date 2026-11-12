# Iséoluwa Website — Architecture & Engineering Rules

This document summarizes the folder structure, technology layers, font and icon licensing setup, motion architecture, and coding rules from `iseoluwa-tech-stack.md` and `iseoluwa-design-system.md`.

---

## 1. Three-Layer Architecture

| Layer | Responsibility | Tools |
|---|---|---|
| **1. Page & Content** | Structure, copy, SEO, routing, forms | Next.js (App Router), TypeScript (strict), Tailwind CSS + CSS variable tokens |
| **2. Motion** | Smooth scroll, scroll-driven reveals, project stack, flowing line, surface transitions, page transitions, custom cursor, category swiper, shared-element zoom | GSAP (`ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, `Flip`, `Draggable`, `InertiaPlugin`), `@gsap/react` (`useGSAP`), Lenis |
| **3. Selective WebGL (Phase 3)** | Optional lazy-loaded hover distortion on a single shared canvas | React Three Fiber, drei, custom GLSL (deferred until Phase 3) |

---

## 2. Folder Structure

```text
src/
├── app/                              # Thin route files & metadata only
│   ├── layout.tsx                    # Fonts, theme, smooth scroll, page transitions, header, footer
│   ├── page.tsx                      # Home route: composes sections from features/home
│   ├── (marketing)/
│   │   ├── work/
│   │   │   ├── layout.tsx            # Persistent ZoomTransition overlay across /work routes
│   │   │   ├── page.tsx              # Stage 1: Full-screen CategorySwiper (/work)
│   │   │   └── [category]/
│   │   │       ├── page.tsx          # Stage 2: Category project scroll (/work/[category])
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # Stage 3: Case study template (/work/[category]/[slug])
│   │   ├── services/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   ├── newsletter/route.ts       # Newsletter subscription endpoint (Zod + honeypot)
│   │   └── contact/route.ts          # Contact form endpoint (Phase 3)
│   ├── sitemap.ts                    # Includes main routes, 3 work categories, and 12 projects
│   └── robots.ts
├── components/
│   ├── ui/                           # Button, Icon, Container, Heading, Label, Tag, Accordion
│   ├── layout/                       # Header, MenuOverlay, Footer, ConditionalFooter, SloganBand, Wordmark, ThemeToggle
│   ├── motion/                       # SmoothScroll, Reveal, SplitReveal, ScrollText, StrikeList,
│   │                                 # FlowingLine, ProjectStack, SurfaceTransition, FooterReveal,
│   │                                 # PageTransition, TransitionLink, Cursor, Parallax, ThemeReveal,
│   │                                 # CategorySwiper, ZoomTransition
│   └── media/                        # Media (next/image wrapper), LoopVideo, VideoPlayer
├── features/
│   ├── home/
│   │   ├── sections/                 # Hero, Statement, SoundFamiliar, WhatWeDo, SelectedWork,
│   │   │                             # WhyIseoluwa, HowItWorks, Packages, FaqTeaser,
│   │   │                             # Testimonials, ClosingCta
│   │   ├── home.content.ts           # All Home copy, problem list, process steps, FAQs, matcher logic
│   │   └── index.ts                  # Exports Home sections in display order
│   ├── work/
│   │   ├── components/               # CategoryPanel, CategoryView, CaseStudyView,
│   │   │                             # ProjectIndexOverlay, NextCategoryBanner, WorkClosingCta
│   │   ├── work.content.ts           # All Work copy, labels, and section headings
│   │   └── index.ts                  # Exports Work components and content
│   └── about/
│       ├── sections/                 # AboutHero, TheName, MeetFounder, VisionMissionGoal,
│       │                             # OurValues, WhyUs, WiderNetwork, WhereWeWork,
│       │                             # TheStandard, AboutClosingCta
│       ├── about.content.ts          # All About copy, founder chapters, values, pillars, and reach data
│       └── index.ts                  # Exports About sections and content
├── content/
│   ├── site.ts                       # Studio name, tagline, slogan, contact placeholders, socials, founder profile
│   ├── navigation.ts                 # Header & menu links, footer columns
│   ├── packages.ts                   # Packages, USD/NGN pricing, and "Find your fit" matcher rules
│   └── projects.ts                   # Single source of truth for 3 categories and 12 projects
├── lib/
│   ├── animation/gsap.ts             # Single registration point for GSAP + plugins
│   ├── analytics.ts                  # Typed track(eventName, props?) helper
│   ├── fonts.ts                      # IBM Plex Mono (next/font/google) + Aeonik (next/font/local)
│   ├── seo.ts                        # Metadata, Organization, Person (founder), & BreadcrumbList JSON-LD
│   └── utils.ts                      # Class merging helpers
├── hooks/                            # useMotionPreference, useMediaQuery, useScrollVelocity
├── store/
│   ├── ui.store.ts                   # Cursor, menu, velocity, currency, footer dark zone
│   └── zoom.ts                       # Shared-element ZoomTransition origin rects & active request
├── config/                           # motion.ts (eases, durations, ribbon physics, swiper/zoom tokens), breakpoints.ts
├── styles/
│   ├── tokens.css                    # Light & dark CSS variables, green accents, --line-weight-hero, --line-weight-section
│   └── globals.css                   # Tailwind layers & fluid typography classes
├── assets/
│   ├── fonts/                        # Licensed Aeonik WOFF2 files (see instructions below)
│   └── icons/                        # Material Symbols (outlined, weight 300) SVGs
├── types/
│   ├── global.d.ts
│   └── work.ts                       # WorkCategory, ProjectItem, ProjectMediaSlot interfaces
└── tests/                            # Vitest unit tests & Playwright e2e tests
```

---

## 3. Motion Primitives (`src/components/motion/`)

All motion components use `useGSAP` with a scoped ref, import GSAP exclusively from `@/lib/animation/gsap`, read timing/ease tokens from `@/config/motion`, and respect `useMotionPreference()` for `prefers-reduced-motion`, touch, and low-power fallbacks:

- **`SmoothScroll`**: Single Lenis instance connected to `ScrollTrigger.update` and driven by `gsap.ticker`.
- **`Reveal`**: Fades and lifts content (`transform`, `opacity`) as it enters the viewport.
- **`SplitReveal`**: Line-by-line masked headline reveal using `SplitText`.
- **`ScrollText`**: Word-by-word scroll-scrubbed opacity reveal (`0.2` to `1`) for editorial statements and case study overviews.
- **`StrikeList`**: Problem statements that are progressively crossed out by a thick, tapered ribbon stroke (`<FlowingLine variant="strike" />`) and dimmed as each row passes the viewport center.
- **`FlowingLine`**: Thick, variable-width physical ribbon rendered on a 2D `<canvas>` (`--line-weight-hero = clamp(12px, 1.6vw, 28px)` and `--line-weight-section = clamp(8px, 1.1vw, 20px)`). Computes a spine of 36–48 points with per-point spring/damping physics (`stiffness: 0.08`, `damping: 0.84`), offsets left/right normals for tapered ends (`0.18` of base width) and mid-curve swell (`1.18` of base width) with rounded end caps, pushes aside under the pointer within `160px`, propagates travelling click/tap ripples, increases amplitude with scroll velocity, draws progressively on scroll (`ScrollTrigger` scrub), and renders a static tapered SVG path (`buildStaticTaperedRibbonSvgPath`) for reduced-motion or no-JS visitors. Managed by a singleton `RibbonTickerManager` subscribing once to `gsap.ticker`, capping active canvases at `2` (`IntersectionObserver` off-screen pause) and `devicePixelRatio` at `2`.
- **`ProjectStack`**: Generalised scroll-driven project showcase where incoming cards slide over outgoing cards (which scale to `0.94`, darken, and parallax), with inner media clip-path reveal, `01 / 04` counter updates, optional edge scroll-progress bar, and zoom trigger into case studies.
- **`CategorySwiper`**: Full-screen (`100dvh`) draggable carousel (`Draggable` + velocity snapping) with rubber-band edge resistance, multi-layer depth parallax, drag-velocity tilt, background surface interpolation (`Branding` light → `Websites` black → `Marketing` light), and a continuous thick `FlowingLine` moving at 60% of drag speed.
- **`ZoomTransition`**: Persistent GSAP `Flip` shared-element transition mounted in `app/(marketing)/work/layout.tsx`, expanding a category or project preview frame to fill the viewport on enter and shrinking back to its stored origin on Back (with crossfade fallback for deep links or reduced motion).
- **`SurfaceTransition`**: Scroll-scrubbed interpolation of `--bg`, `--ink`, `--ink-muted`, `--line`, and `--line-accent` over the final stretch of the closing CTA into the footer.
- **`FooterReveal`**: Curtain-style reveal of the footer beneath the closing section on viewports tall enough to fit the footer, gracefully falling back to normal document flow on short screens.
- **`PageTransition` & `TransitionLink`**: 700ms black wipe panel with mono page title between internal routes, resetting scroll and moving focus to the new page `h1`.
- **`Cursor`**: Desktop-only `gsap.quickTo` follower dot that expands into a labeled ring (`View`, `Talk`, `Play`, `Drag`, `Enter`, `Hello`) over interactive targets.
- **`Parallax`**: Inner-parallax media wrapper translating media inside overflow-clipped frames.
- **`ThemeReveal`**: Circular clip-path reveal originating from the theme toggle button via the View Transitions API.

---

## 4. Adding Licensed Aeonik Font Files

Per the design system, **Aeonik** (by CoType Foundry) is a commercial typeface. Until the WOFF2 files are added, `--font-sans` falls back to a neutral system sans-serif (`system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`).

To enable Aeonik in production:
1. Place the licensed WOFF2 files in `src/assets/fonts/`:
   - `src/assets/fonts/Aeonik-Light.woff2` (weight `300`, optional)
   - `src/assets/fonts/Aeonik-Regular.woff2` (weight `400`)
   - `src/assets/fonts/Aeonik-Medium.woff2` (weight `500`)
2. In `src/lib/fonts.ts`, uncomment the `localFont` block for `aeonik` and pass `aeonik.variable` alongside `ibmPlexMono.variable` in `getFontVariables()`.

---

## 5. Coding Rules

1. **No copy inside components.** All text, links, prices, and lists live in `src/content/` or `src/features/<page>/<page>.content.ts`.
2. **One responsibility per file.** Pages in `src/app/` only compose feature sections and declare metadata.
3. **Server Components by default.** Add `"use client"` only to interactive or animated leaf components.
4. **Design tokens only.** Never hardcode hex values or font names inside components.
5. **Strict TypeScript.** No `any`.
