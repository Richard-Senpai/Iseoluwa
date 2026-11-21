'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { cn } from '@/lib/utils';

export interface ScrollScrubSetMeta {
  width: number;
  height: number;
  pattern: string;
  bytes: number;
}

export interface ScrollScrubManifest {
  frameCount: number;
  desktop: ScrollScrubSetMeta;
  mobile: ScrollScrubSetMeta;
  aspect: string;
  durationSeconds: number;
  range: {
    start: number;
    end: number;
  };
  sourceFps: number;
  extractedFps: number;
  background: string;
  blurDataURL: string;
  posterFirst: string;
  posterLast: string;
}

export interface FrameBlendPosition {
  exactIndex: number;
  frameAIndex: number;
  frameBIndex: number;
  blendFraction: number;
}

/**
 * Pure helper: maps normalized scroll progress `[0..1]` linearly to a 0-based
 * fractional frame index across `[0..frameCount - 1]`, returning the two
 * neighbouring frame indices (`frameAIndex`, `frameBIndex`) and `blendFraction` (`[0..1)`).
 */
export function mapProgressToFramePosition(
  progress: number,
  frameCount: number,
): FrameBlendPosition {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  if (frameCount <= 1) {
    return {
      exactIndex: 0,
      frameAIndex: 0,
      frameBIndex: 0,
      blendFraction: 0,
    };
  }

  const maxIdx = frameCount - 1;
  const exactIndex = clamped * maxIdx;
  const frameAIndex = Math.min(maxIdx, Math.max(0, Math.floor(exactIndex)));
  const frameBIndex = Math.min(maxIdx, frameAIndex + 1);
  const blendFraction = Number((exactIndex - frameAIndex).toFixed(6));

  return {
    exactIndex,
    frameAIndex,
    frameBIndex,
    blendFraction,
  };
}

/**
 * Pure helper: weighted linear interpolation toward target scroll progress (default factor `0.12`).
 * Snaps cleanly when within `0.0005` of target.
 */
export function lerpScrollProgress(
  current: number,
  target: number,
  factor = 0.12,
): number {
  const clampedTarget = Math.max(0, Math.min(1, target));
  const diff = clampedTarget - current;
  if (Math.abs(diff) < 0.0005) {
    return clampedTarget;
  }
  const next = current + diff * factor;
  if (Math.abs(clampedTarget - next) < 0.0005) {
    return clampedTarget;
  }
  return next;
}

/**
 * Pure helper: builds progressive frame load order (0-based indices):
 * first -> last -> every 8th -> every 4th -> every 2nd -> remaining frames.
 */
export function buildProgressiveLoadOrder(
  frameCount: number,
  stepBudget = 1,
): number[] {
  if (frameCount <= 0) return [];
  const seen = new Set<number>();
  const order: number[] = [];

  const add = (idx: number) => {
    if (idx < 0 || idx >= frameCount || seen.has(idx)) return;
    if (stepBudget > 1 && idx !== 0 && idx !== frameCount - 1 && idx % stepBudget !== 0) {
      return;
    }
    seen.add(idx);
    order.push(idx);
  };

  add(0);
  add(frameCount - 1);

  for (const stride of [8, 4, 2, 1]) {
    for (let i = 0; i < frameCount; i += stride) {
      add(i);
    }
  }

  return order;
}

/**
 * Pure helper: finds the closest loaded frame index if `targetIdx` is still loading.
 */
export function findNearestLoadedFrameIndex(
  targetIdx: number,
  loadedFlags: readonly boolean[],
): number {
  const len = loadedFlags.length;
  if (len === 0) return -1;
  const clamped = Math.max(0, Math.min(len - 1, targetIdx));
  if (loadedFlags[clamped]) return clamped;

  for (let offset = 1; offset < len; offset++) {
    const left = clamped - offset;
    const right = clamped + offset;
    if (left >= 0 && loadedFlags[left]) return left;
    if (right < len && loadedFlags[right]) return right;
  }
  return -1;
}

/**
 * Pure helper: formats a `%04d` frame pattern with a 1-based frame index.
 */
export function formatFrameUrl(pattern: string, oneBasedIndex: number): string {
  const padded = String(Math.max(1, oneBasedIndex)).padStart(4, '0');
  return pattern.replace('%04d', padded);
}

const DEFAULT_MANIFEST_FALLBACK: ScrollScrubManifest = {
  frameCount: 190,
  desktop: {
    width: 720,
    height: 1280,
    pattern: '/media/scrub/name-section/desktop/frame_%04d.webp',
    bytes: 3499812,
  },
  mobile: {
    width: 720,
    height: 1280,
    pattern: '/media/scrub/name-section/mobile/frame_%04d.webp',
    bytes: 3109348,
  },
  aspect: '9 / 16',
  durationSeconds: 19.97,
  range: { start: 0, end: 19.97 },
  sourceFps: 24,
  extractedFps: 9.51,
  background: '#101010',
  blurDataURL:
    'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABQBACdASoUACMAPtFWokuoJKMhqq35ABoJaQAAPY+vu31D2mBIBstrqOgAAP72gg2tDQWXucDRMeafziOmNKMNtv9POVCuXmsE8w9oATiBmdkReIrAAAAA',
  posterFirst: '/media/scrub/name-section/poster-first.webp',
  posterLast: '/media/scrub/name-section/poster-last.webp',
};

type DecodedFrameSource = ImageBitmap | HTMLImageElement;

export interface ScrollScrubMediaProps {
  manifestUrl: string;
  initialManifest?: ScrollScrubManifest;
  progress?: number;
  triggerRef?: RefObject<HTMLElement | null>;
  alt: string;
  caption?: string | null;
  showProgressLabel?: boolean;
  sticky?: boolean;
  priority?: boolean;
  onFirstInteraction?: () => void;
  onCompleted?: () => void;
  className?: string;
}

/**
 * Reusable scroll-scrubbed image-sequence component (`src/components/motion/ScrollScrubMedia.tsx`).
 * - Shows `poster-first.webp` immediately with `blurDataURL` and sampled corner `background` colour (zero CLS).
 * - Under `prefers-reduced-motion: reduce` or no-JS, displays `poster-last.webp` (the finished state).
 * - Progressively loads WebP frames (`first`, `last`, every `8th`, `4th`, `2nd`, then remaining),
 *   choosing the mobile set on `< 768px` or data-saver, and draws two neighbouring frames blended
 *   by the fractional index onto a `<canvas>` with a `0.12` lerp via `gsap.ticker`.
 */
export function ScrollScrubMedia({
  manifestUrl,
  initialManifest,
  progress: controlledProgress,
  triggerRef,
  alt,
  caption = null,
  showProgressLabel = false,
  sticky = false,
  priority = false,
  onFirstInteraction,
  onCompleted,
  className,
}: ScrollScrubMediaProps) {
  const { reducedMotion, isLowPower } = useMotionPreference();

  const [manifest, setManifest] = useState<ScrollScrubManifest>(
    initialManifest ?? DEFAULT_MANIFEST_FALLBACK,
  );
  const [displayProgressPct, setDisplayProgressPct] = useState(0);
  const [hasCanvasDrawn, setHasCanvasDrawn] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnProgressRef = useRef(-1);
  const dirtyFrameRef = useRef(true);
  const isVisibleRef = useRef(true);
  const hasMarkedDrawnRef = useRef(false);

  const framesRef = useRef<Array<DecodedFrameSource | null>>([]);
  const loadedFlagsRef = useRef<boolean[]>([]);

  const hasFiredFirstInteractionRef = useRef(false);
  const hasFiredCompletedRef = useRef(false);
  const onFirstInteractionRef = useRef(onFirstInteraction);
  const onCompletedRef = useRef(onCompleted);

  useEffect(() => {
    onFirstInteractionRef.current = onFirstInteraction;
    onCompletedRef.current = onCompleted;
  }, [onFirstInteraction, onCompleted]);

  // Fetch manifest JSON if not explicitly provided
  useEffect(() => {
    let active = true;
    fetch(manifestUrl)
      .then((res) => (res.ok ? (res.json() as Promise<ScrollScrubManifest>) : null))
      .then((data) => {
        if (active && data && typeof data.frameCount === 'number') {
          setManifest(data);
        }
      })
      .catch(() => {
        // Fallback silently to DEFAULT_MANIFEST_FALLBACK / poster images
      });

    return () => {
      active = false;
    };
  }, [manifestUrl]);

  // Helper to update target scroll progress and fire one-time analytics milestones
  const updateTargetProgress = useCallback((nextP: number) => {
    const clamped = Math.max(0, Math.min(1, nextP));
    targetProgressRef.current = clamped;

    if (!hasFiredFirstInteractionRef.current && clamped > 0.02) {
      hasFiredFirstInteractionRef.current = true;
      onFirstInteractionRef.current?.();
    }
    if (!hasFiredCompletedRef.current && clamped >= 0.95) {
      hasFiredCompletedRef.current = true;
      onCompletedRef.current?.();
    }
  }, []);

  // Sync controlled progress prop if passed
  useEffect(() => {
    if (typeof controlledProgress === 'number') {
      updateTargetProgress(controlledProgress);
    }
  }, [controlledProgress, updateTargetProgress]);

  // ScrollTrigger binding (section trigger on desktop sticky; self enter/exit on mobile/tablet)
  useEffect(() => {
    if (reducedMotion || typeof controlledProgress === 'number') return;
    const panelEl = panelRef.current;
    if (!panelEl) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const triggerEl = sticky && triggerRef?.current ? triggerRef.current : panelEl;
      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: sticky && triggerRef?.current ? 'top 65%' : 'top 85%',
        end: sticky && triggerRef?.current ? 'bottom 35%' : 'bottom 15%',
        onUpdate: (self) => {
          updateTargetProgress(self.progress);
        },
      });
      updateTargetProgress(st.progress);
      return () => st.kill();
    });

    mm.add('(max-width: 1023px)', () => {
      const st = ScrollTrigger.create({
        trigger: panelEl,
        start: 'top 88%',
        end: 'bottom 12%',
        onUpdate: (self) => {
          updateTargetProgress(self.progress);
        },
      });
      updateTargetProgress(st.progress);
      return () => st.kill();
    });

    return () => {
      mm.revert();
    };
  }, [reducedMotion, controlledProgress, sticky, triggerRef, updateTargetProgress]);

  // IntersectionObserver to pause canvas work when far off screen
  useEffect(() => {
    const el = panelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            dirtyFrameRef.current = true;
          }
        }
      },
      { rootMargin: '600px 0px 600px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Progressive frame loader + canvas renderer on shared gsap.ticker
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const totalFrames = manifest.frameCount;
    framesRef.current = new Array<DecodedFrameSource | null>(totalFrames).fill(null);
    loadedFlagsRef.current = new Array<boolean>(totalFrames).fill(false);

    const isSmallScreen =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    const useMobileSet = isSmallScreen || isLowPower;
    const activeSet = useMobileSet ? manifest.mobile : manifest.desktop;
    const stepBudget = isLowPower ? 2 : 1;
    const loadOrder = buildProgressiveLoadOrder(totalFrames, stepBudget);

    const decodeFrame = async (url: string): Promise<DecodedFrameSource | null> => {
      try {
        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
          const response = await fetch(url);
          if (!response.ok) return null;
          const blob = await response.blob();
          return await createImageBitmap(blob);
        }
        return await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new window.Image();
          img.decoding = 'async';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = url;
        });
      } catch {
        return null;
      }
    };

    // Concurrent progressive loader queue (4 workers)
    let queueCursor = 0;
    const workerCount = 4;

    const runWorker = async () => {
      while (!cancelled && queueCursor < loadOrder.length) {
        const frameIdx = loadOrder[queueCursor++]!;
        const url = formatFrameUrl(activeSet.pattern, frameIdx + 1);
        const decoded = await decodeFrame(url);
        if (cancelled) {
          if (decoded && 'close' in decoded && typeof decoded.close === 'function') {
            decoded.close();
          }
          return;
        }
        if (decoded) {
          framesRef.current[frameIdx] = decoded;
          loadedFlagsRef.current[frameIdx] = true;
          dirtyFrameRef.current = true;
        }
      }
    };

    for (let w = 0; w < workerCount; w++) {
      void runWorker();
    }

    // Size canvas backing store with DPR capped at 2
    const syncCanvasSize = () => {
      const canvas = canvasRef.current;
      const panel = panelRef.current;
      if (!canvas || !panel) return;
      const rect = panel.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const targetW =
        rect.width > 10 ? Math.round(rect.width * dpr) : activeSet.width;
      const targetH =
        rect.height > 10 ? Math.round(rect.height * dpr) : activeSet.height;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        dirtyFrameRef.current = true;
      }
    };

    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);
    window.addEventListener('orientationchange', syncCanvasSize);

    // Draw function invoked by gsap.ticker
    const tick = () => {
      if (cancelled) return;
      const hasPendingLerp =
        Math.abs(targetProgressRef.current - currentProgressRef.current) >= 0.0005;
      if (
        !isVisibleRef.current &&
        hasMarkedDrawnRef.current &&
        !dirtyFrameRef.current &&
        !hasPendingLerp
      ) {
        return;
      }

      const nextP = lerpScrollProgress(
        currentProgressRef.current,
        targetProgressRef.current,
        0.12,
      );
      const progressChanged = Math.abs(nextP - lastDrawnProgressRef.current) > 0.0004;
      currentProgressRef.current = nextP;

      if (!progressChanged && !dirtyFrameRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      if (canvas.width === 0 || canvas.height === 0) {
        syncCanvasSize();
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { frameAIndex, frameBIndex, blendFraction } = mapProgressToFramePosition(
        nextP,
        totalFrames,
      );

      const loadedAIdx = findNearestLoadedFrameIndex(frameAIndex, loadedFlagsRef.current);
      if (loadedAIdx === -1) return;

      const imgA = framesRef.current[loadedAIdx];
      if (!imgA) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, 0, 0, canvas.width, canvas.height);

      // Blend neighbouring frame B when loaded for continuous motion between 10fps frames
      const loadedBIdx = findNearestLoadedFrameIndex(frameBIndex, loadedFlagsRef.current);
      if (
        blendFraction > 0.01 &&
        loadedBIdx !== -1 &&
        loadedBIdx !== loadedAIdx
      ) {
        const imgB = framesRef.current[loadedBIdx];
        if (imgB) {
          ctx.globalAlpha = blendFraction;
          ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      }

      canvas.dataset.currentFrame = String(loadedAIdx);
      canvas.dataset.scrubProgress = nextP.toFixed(4);

      lastDrawnProgressRef.current = nextP;
      dirtyFrameRef.current = false;

      if (!hasMarkedDrawnRef.current) {
        hasMarkedDrawnRef.current = true;
        setHasCanvasDrawn(true);
      }
      if (showProgressLabel) {
        setDisplayProgressPct(Math.round(nextP * 100));
      }
    };

    gsap.ticker.add(tick);

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', syncCanvasSize);
      window.removeEventListener('orientationchange', syncCanvasSize);

      framesRef.current.forEach((f) => {
        if (f && 'close' in f && typeof f.close === 'function') {
          f.close();
        }
      });
      framesRef.current = [];
      loadedFlagsRef.current = [];
    };
  }, [manifest, reducedMotion, isLowPower, showProgressLabel]);

  const posterSrc = reducedMotion ? manifest.posterLast : manifest.posterFirst;

  return (
    <div
      ref={rootRef}
      className={cn(
        sticky && 'lg:sticky lg:top-28',
        className,
      )}
    >
      <div
        ref={panelRef}
        role="img"
        aria-label={alt}
        data-testid="scroll-scrub-panel"
        style={{
          aspectRatio: manifest.aspect,
          backgroundColor: manifest.background,
          backgroundImage: manifest.blurDataURL ? `url(${manifest.blurDataURL})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative mx-auto w-full max-h-[78vh] overflow-hidden rounded-card border border-line"
      >
        {/* Instant server-rendered poster (poster-last under reduced motion / no-JS, poster-first otherwise) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc}
          alt={alt}
          width={manifest.desktop.width}
          height={manifest.desktop.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          data-testid="scroll-scrub-poster"
          className={cn(
            'h-full w-full object-cover',
            !reducedMotion && hasCanvasDrawn && 'opacity-0',
          )}
        />

        {/* Scrubbed Canvas (hidden when prefers-reduced-motion is active) */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            data-testid="scroll-scrub-canvas"
            aria-hidden="true"
            width={manifest.desktop.width}
            height={manifest.desktop.height}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {(caption || showProgressLabel) && (
        <div className="mt-2.5 flex items-center justify-between gap-4 font-mono text-xs text-ink-muted">
          {caption && <span>{caption}</span>}
          {showProgressLabel && <span>{`${displayProgressPct}%`}</span>}
        </div>
      )}
    </div>
  );
}
