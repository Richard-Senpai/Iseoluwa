'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { CategoryPanel } from '@/features/work/components/CategoryPanel';
import {
  ALL_PROJECTS,
  WORK_CATEGORIES,
  getProjectsByCategory,
  type WorkCategory,
  type WorkCategorySlug,
} from '@/content/projects';
import { WORK_CONTENT } from '@/features/work/work.content';
import { gsap, Draggable, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { useZoomStore } from '@/store/zoom';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface CategorySwiperProps {
  initialCategorySlug?: string;
}

/**
 * Stage 1: Full-screen Draggable Category Swiper (`/work`, Work Prompt Section 4):
 * - Single `100dvh` stage with no vertical scroll.
 * - Three panels: Branding (light), Websites (black/inverse), Marketing (light).
 * - Momentum drag & velocity-based snapping (`Draggable`), rubber-band edge resistance,
 *   depth parallax on inner layers, drag-velocity tilt, background surface interpolation,
 *   and continuous FlowingLine moving at 60% of drag speed.
 * - Supports mouse drag, touch (`touch-action: pan-y`), horizontal trackpad wheel,
 *   ArrowLeft/ArrowRight keys, clicking a peeking neighbour, and pagination tabs.
 */
export function CategorySwiper({ initialCategorySlug }: CategorySwiperProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();

  const setFooterDarkZone = useUIStore((s) => s.setFooterDarkZone);
  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);
  const saveOrigin = useZoomStore((s) => s.saveOrigin);
  const startZoom = useZoomStore((s) => s.startZoom);

  const initialIdx = Math.max(
    0,
    WORK_CATEGORIES.findIndex((cat) => cat.slug === initialCategorySlug),
  );

  const [activeIndex, setActiveIndex] = useState<number>(initialIdx);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const stageRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lineWrapperRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef<number>(initialIdx);
  const stepWidthRef = useRef<number>(900);
  const wheelCooldownRef = useRef<boolean>(false);

  const total = WORK_CATEGORIES.length;
  const activeCategory = WORK_CATEGORIES[activeIndex] ?? WORK_CATEGORIES[0]!;
  const counterLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  // Apply stage surface colours interpolated by continuous progress (0 = Branding, 1 = Websites, 2 = Marketing)
  const applyStageSurface = useCallback(
    (progress: number) => {
      const stage = stageRef.current;
      if (!stage) return;

      const isDarkTheme = resolvedTheme === 'dark';
      // Distance to panel 1 (Websites, which is always inverse black)
      const inverseWeight = Math.max(0, 1 - Math.abs(progress - 1));
      setFooterDarkZone(inverseWeight > 0.45 || isDarkTheme);

      if (isDarkTheme) {
        stage.style.setProperty('--bg', inverseWeight > 0.5 ? '#06150e' : '#0a0a0a');
        stage.style.setProperty('--ink', '#f5f5f3');
        stage.style.setProperty('--ink-muted', '#8f8f8a');
        stage.style.setProperty('--line', '#242424');
        stage.style.setProperty('--line-accent', '#19e37a');
        return;
      }

      const bg = gsap.utils.interpolate('#ffffff', '#0a0a0a', inverseWeight);
      const ink = gsap.utils.interpolate('#0a0a0a', '#f5f5f3', inverseWeight);
      const muted = gsap.utils.interpolate('#6b6b66', '#8f8f8a', inverseWeight);
      const line = gsap.utils.interpolate('#e6e6e2', '#242424', inverseWeight);
      const accent = gsap.utils.interpolate('#0b4d34', '#19e37a', inverseWeight);

      stage.style.setProperty('--bg', bg);
      stage.style.setProperty('--ink', ink);
      stage.style.setProperty('--ink-muted', muted);
      stage.style.setProperty('--line', line);
      stage.style.setProperty('--line-accent', accent);
    },
    [resolvedTheme, setFooterDarkZone],
  );

  // Sync shallow URL `?category=<slug>` when active panel changes
  const syncShallowUrl = useCallback((slug: WorkCategorySlug) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('category', slug);
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Animate track, flowing line (60% speed), and depth parallax to a target panel index
  const animateToPanel = useCallback(
    (targetIdx: number, userTriggered = true) => {
      const clamped = Math.max(0, Math.min(total - 1, targetIdx));
      const prevIdx = activeIndexRef.current;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);

      const category = WORK_CATEGORIES[clamped];
      if (category) {
        syncShallowUrl(category.slug);
        if (userTriggered && prevIdx !== clamped) {
          setHasInteracted(true);
          track('work_panel_changed', { category: category.slug, index: clamped });
        }
      }

      const trackEl = trackRef.current;
      const lineWrap = lineWrapperRef.current;
      if (!trackEl) return;

      const step = stepWidthRef.current;
      const targetX = -clamped * step;

      if (shouldSimplifyMotion) {
        gsap.set(trackEl, { x: targetX, rotation: 0, skewX: 0 });
        applyStageSurface(clamped);
        return;
      }

      const progressObj = { value: prevIdx };
      gsap.to(progressObj, {
        value: clamped,
        duration: MOTION.duration.swiperSnap,
        ease: MOTION.ease.smoothOut,
        onUpdate: () => {
          applyStageSurface(progressObj.value);
        },
      });

      gsap.to(trackEl, {
        x: targetX,
        rotation: 0,
        skewX: 0,
        duration: MOTION.duration.swiperSnap,
        ease: MOTION.ease.smoothOut,
      });

      if (lineWrap) {
        gsap.to(lineWrap, {
          x: targetX * MOTION.swiper.lineSpeedRatio,
          duration: MOTION.duration.swiperSnap,
          ease: MOTION.ease.smoothOut,
        });
      }

      // Reset inner depth layers smoothly
      const depthEls = trackEl.querySelectorAll<HTMLElement>('[data-depth]');
      gsap.to(depthEls, {
        x: 0,
        duration: MOTION.duration.swiperSnap,
        ease: MOTION.ease.smoothOut,
      });
    },
    [total, shouldSimplifyMotion, applyStageSurface, syncShallowUrl],
  );

  // Measure panel step width and set up GSAP Draggable
  useGSAP(
    () => {
      const trackEl = trackRef.current;
      const stageEl = stageRef.current;
      if (!trackEl || !stageEl) return;

      const measure = () => {
        const firstPanel = trackEl.querySelector<HTMLElement>('.work-category-panel');
        if (!firstPanel) return;
        const gap = parseFloat(window.getComputedStyle(trackEl).columnGap || '24') || 24;
        stepWidthRef.current = firstPanel.offsetWidth + gap;
        gsap.set(trackEl, { x: -activeIndexRef.current * stepWidthRef.current });
        if (lineWrapperRef.current) {
          gsap.set(lineWrapperRef.current, {
            x: -activeIndexRef.current * stepWidthRef.current * MOTION.swiper.lineSpeedRatio,
          });
        }
        applyStageSurface(activeIndexRef.current);
      };

      measure();
      window.addEventListener('resize', measure);

      if (shouldSimplifyMotion) {
        return () => {
          window.removeEventListener('resize', measure);
          setFooterDarkZone(false);
        };
      }

      let lastX = -activeIndexRef.current * stepWidthRef.current;
      let velocityX = 0;

      const draggableInstances = Draggable.create(trackEl, {
        type: 'x',
        edgeResistance: 1 - MOTION.swiper.rubberBandFactor,
        allowContextMenu: true,
        clickableTest: (el: Element) => Boolean(el.closest('a, button')),
        onPress: function () {
          lastX = this.x;
          velocityX = 0;
        },
        onDrag: function () {
          setHasInteracted(true);
          const step = stepWidthRef.current || 1;
          const minX = -(total - 1) * step;
          const maxX = 0;

          // Rubber-band clamping past edges
          let rawX = this.x;
          if (rawX > maxX) {
            rawX = maxX + (rawX - maxX) * MOTION.swiper.rubberBandFactor;
            gsap.set(trackEl, { x: rawX });
          } else if (rawX < minX) {
            rawX = minX + (rawX - minX) * MOTION.swiper.rubberBandFactor;
            gsap.set(trackEl, { x: rawX });
          }

          velocityX = rawX - lastX;
          lastX = rawX;

          const continuousProgress = Math.max(0, Math.min(total - 1, -rawX / step));
          applyStageSurface(continuousProgress);

          // Flowing line moves at 60% of drag speed
          if (lineWrapperRef.current) {
            gsap.set(lineWrapperRef.current, {
              x: rawX * MOTION.swiper.lineSpeedRatio,
            });
          }

          // Velocity-based gentle tilt & skew on active panel
          const tilt = gsap.utils.clamp(
            -MOTION.swiper.maxVelocityTiltDeg,
            MOTION.swiper.maxVelocityTiltDeg,
            velocityX * 0.08,
          );
          const skew = gsap.utils.clamp(
            -MOTION.swiper.maxVelocitySkewDeg,
            MOTION.swiper.maxVelocitySkewDeg,
            velocityX * 0.05,
          );
          gsap.set(trackEl, { rotation: tilt * 0.25, skewX: skew });

          // Depth parallax across panel layers (title slowest, previews fastest)
          const titles = trackEl.querySelectorAll<HTMLElement>('[data-depth="title"]');
          const fan1 = trackEl.querySelectorAll<HTMLElement>('[data-depth="fan-1"]');
          const fan2 = trackEl.querySelectorAll<HTMLElement>('[data-depth="fan-2"]');
          const fan3 = trackEl.querySelectorAll<HTMLElement>('[data-depth="fan-3"]');

          gsap.set(titles, { x: velocityX * 0.35 });
          gsap.set(fan3, { x: velocityX * 0.85 });
          gsap.set(fan2, { x: velocityX * 1.15 });
          gsap.set(fan1, { x: velocityX * 1.45 });
        },
        onDragEnd: function () {
          const step = stepWidthRef.current || 1;
          const rawIndex = -this.x / step;
          let targetIdx = Math.round(rawIndex);

          // Velocity-based flick snapping
          if (Math.abs(velocityX) > 14) {
            targetIdx =
              velocityX < 0
                ? Math.min(total - 1, activeIndexRef.current + 1)
                : Math.max(0, activeIndexRef.current - 1);
          }

          animateToPanel(targetIdx, true);
        },
      });

      return () => {
        window.removeEventListener('resize', measure);
        draggableInstances.forEach((d) => d.kill());
        setFooterDarkZone(false);
      };
    },
    { scope: stageRef, dependencies: [shouldSimplifyMotion, total, applyStageSurface, animateToPanel, setFooterDarkZone] },
  );

  // Keyboard ArrowLeft / ArrowRight & horizontal trackpad wheel support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        animateToPanel(activeIndexRef.current + 1, true);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        animateToPanel(activeIndexRef.current - 1, true);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      // Only respond to horizontal trackpad gestures; never hijack vertical scrolling
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18) {
        return;
      }
      if (wheelCooldownRef.current) return;
      wheelCooldownRef.current = true;

      if (event.deltaX > 0) {
        animateToPanel(activeIndexRef.current + 1, true);
      } else {
        animateToPanel(activeIndexRef.current - 1, true);
      }

      setTimeout(() => {
        wheelCooldownRef.current = false;
      }, 550);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [animateToPanel]);

  const handleEnterCategory = (category: WorkCategory, previewEl: HTMLElement | null) => {
    resetCursor();
    track('work_category_entered', { category: category.slug });

    const rect = previewEl?.getBoundingClientRect();
    const originKey = `category:${category.slug}`;
    const zoomRect = rect
      ? {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
      : null;

    if (zoomRect) {
      saveOrigin(originKey, zoomRect, `${category.title.toUpperCase()} · PROJECT MEDIA 16:9`);
    }

    const targetHref = `/work/${category.slug}`;
    if (shouldSimplifyMotion || !zoomRect) {
      router.push(targetHref);
      return;
    }

    startZoom({
      direction: 'in',
      targetHref,
      originKey,
      fromRect: zoomRect,
      label: `${category.title.toUpperCase()} · PROJECT MEDIA 16:9`,
      title: category.title,
    });
  };

  const { stage1 } = WORK_CONTENT;

  return (
    <section
      ref={stageRef}
      role="region"
      aria-roledescription={stage1.carouselRoleDescription}
      aria-label={stage1.carouselAriaLabel}
      onMouseEnter={() => !isTouch && setCursor('drag', stage1.cursorDragLabel)}
      onMouseLeave={() => !isTouch && resetCursor()}
      className="relative flex h-[100dvh] min-h-[640px] w-full flex-col justify-between overflow-hidden bg-bg pt-24 pb-6 text-ink select-none [touch-action:pan-y] md:pt-28 md:pb-8"
    >
      {/* Screen-reader live region & visually hidden direct links for SEO + accessibility */}
      <h1 className="sr-only">{WORK_CONTENT.seo.title}</h1>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`${activeCategory.title}, ${activeIndex + 1} of ${total}: ${activeCategory.tagline}`}
      </div>
      <nav aria-label="Direct category and project links" className="sr-only">
        <ul>
          {WORK_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <a href={`/work/${cat.slug}`}>{cat.title}</a>
            </li>
          ))}
          {ALL_PROJECTS.map((proj) => (
            <li key={proj.slug}>
              <a href={proj.href}>
                {proj.title} — {proj.summary}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Continuous Flowing Line running across all three panels at 60% drag speed */}
      <div
        ref={lineWrapperRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 -z-0 w-[260vw] -translate-y-1/2 will-change-transform"
      >
        <FlowingLine
          weight="hero"
          amplitude={28}
          frequency={0.0038}
          speed={0.025}
          reactToPointer
          className="h-48 w-full md:h-64"
        />
      </div>

      {/* Top Stage Header Bar: WORK + 01 / 03 counter */}
      <Container className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-label-mono font-medium opacity-80">{stage1.topLabel}</span>
          <span aria-hidden="true" className="opacity-30">
            /
          </span>
          <span
            data-testid="work-swiper-counter"
            className="text-label-mono font-medium"
          >
            {counterLabel}
          </span>
        </div>
      </Container>

      {/* Horizontal Draggable Track */}
      <div className="relative z-10 my-auto flex flex-1 items-center overflow-visible py-4">
        <div
          ref={trackRef}
          className="flex h-full max-h-[640px] items-stretch gap-6 px-[7vw] will-change-transform md:gap-8 md:px-[13vw] lg:px-[14vw]"
        >
          {WORK_CATEGORIES.map((category, index) => (
            <CategoryPanel
              key={category.slug}
              category={category}
              projects={getProjectsByCategory(category.slug)}
              index={index}
              total={total}
              isActive={index === activeIndex}
              offsetFromActive={index - activeIndex}
              onSelectNeighbor={(targetIdx) => animateToPanel(targetIdx, true)}
              onEnterCategory={handleEnterCategory}
            />
          ))}
        </div>
      </div>

      {/* Bottom Pagination & Conversion Bar */}
      <Container className="relative z-10 space-y-3 border-t border-current/15 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Pagination Labels */}
          <div
            role="tablist"
            aria-label="Select work category"
            className="flex flex-wrap items-center gap-6"
          >
            {WORK_CATEGORIES.map((category, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={category.slug}
                  id={`swiper-tab-${category.slug}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => animateToPanel(idx, true)}
                  className={cn(
                    'text-label-mono relative pb-1.5 transition-opacity duration-200',
                    isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-85',
                  )}
                >
                  <span>{category.title.toUpperCase()}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute right-0 bottom-0 left-0 h-[2px] bg-line-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isSelected ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* DRAG TO EXPLORE hint (fades out after first interaction) */}
          <div
            aria-hidden="true"
            className={cn(
              'text-label-mono inline-flex items-center gap-2 transition-opacity duration-500',
              hasInteracted ? 'pointer-events-none opacity-0' : 'opacity-75 motion-safe:animate-pulse',
            )}
          >
            <Icon name="arrow_back" size={20} />
            <span>{stage1.dragHint}</span>
            <Icon name="arrow_forward" size={20} />
          </div>
        </div>

        {/* Free 20-minute call conversion line */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <p className="font-mono text-xs opacity-75">
            <span>{stage1.freeCallPrefix} </span>
            <TransitionLink
              href={stage1.freeCallHref}
              onClick={() => track('work_cta_clicked', { location: 'selector_bottom' })}
              className="link-underline font-medium opacity-100"
            >
              {stage1.freeCallLinkLabel}
            </TransitionLink>
          </p>
        </div>
      </Container>
    </section>
  );
}
