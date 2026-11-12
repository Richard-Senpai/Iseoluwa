'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { cn } from '@/lib/utils';

export type FlowingLineWeight = 'hero' | 'section';
export type FlowingLinePathPreset =
  | 'wave'
  | 'loop'
  | 'thread'
  | Array<{ x: number; y: number }>;

export interface FlowingLineProps {
  amplitude?: number;
  frequency?: number;
  speed?: number;
  thickness?: number;
  weight?: FlowingLineWeight;
  taper?: boolean;
  physics?: boolean;
  path?: FlowingLinePathPreset;
  progress?: number;
  variant?: 'default' | 'strike';
  reactToPointer?: boolean;
  tone?: 'light' | 'dark';
  drawOnScroll?: boolean;
  rippleCount?: number;
  className?: string;
}

interface RibbonSubscriber {
  id: string;
  isVisible: () => boolean;
  step: () => void;
}

/**
 * Single shared `gsap.ticker` loop manager for all FlowingLine instances (Tech Stack Section 4.2).
 * Subscribes once to `gsap.ticker`, pauses off-screen instances, and updates at most
 * `MOTION.flowingLine.maxActiveCanvases` (2) visible canvases per frame.
 */
class RibbonTickerManager {
  private subscribers = new Map<string, RibbonSubscriber>();
  private isListening = false;

  private tick = () => {
    let activeCount = 0;
    for (const sub of this.subscribers.values()) {
      if (!sub.isVisible()) continue;
      if (activeCount >= MOTION.flowingLine.maxActiveCanvases) break;
      sub.step();
      activeCount++;
    }
  };

  register(sub: RibbonSubscriber): () => void {
    this.subscribers.set(sub.id, sub);
    if (!this.isListening && this.subscribers.size > 0) {
      gsap.ticker.add(this.tick);
      this.isListening = true;
    }
    return () => {
      this.subscribers.delete(sub.id);
      if (this.isListening && this.subscribers.size === 0) {
        gsap.ticker.remove(this.tick);
        this.isListening = false;
      }
    };
  }
}

const ribbonManager = new RibbonTickerManager();

function evaluateRestY(
  t: number,
  width: number,
  height: number,
  phase: number,
  amplitude: number,
  frequency: number,
  pathPreset: FlowingLinePathPreset,
  variant: 'default' | 'strike',
): number {
  const centerY = height / 2;
  const x = t * width;

  if (Array.isArray(pathPreset) && pathPreset.length >= 2) {
    const scaled = t * (pathPreset.length - 1);
    const idx = Math.min(pathPreset.length - 2, Math.floor(scaled));
    const localT = scaled - idx;
    const p0 = pathPreset[idx]!;
    const p1 = pathPreset[idx + 1]!;
    const base = (p0.y + (p1.y - p0.y) * localT) * height;
    return base + Math.sin(x * frequency + phase) * (amplitude * 0.35);
  }

  if (variant === 'strike') {
    const arch = Math.sin(t * Math.PI) * -3.5;
    const wobble =
      Math.sin(t * 19 + phase) * MOTION.flowingLine.strikeWobblePx +
      Math.cos(t * 31 - phase * 0.7) * (MOTION.flowingLine.strikeWobblePx * 0.5);
    return centerY + arch + wobble;
  }

  if (pathPreset === 'thread') {
    const wave1 = Math.sin(t * Math.PI * 2.5 + phase) * amplitude;
    const wave2 = Math.cos(t * Math.PI * 1.25 - phase * 0.6) * (amplitude * 0.45);
    return centerY + wave1 + wave2;
  }

  if (pathPreset === 'loop') {
    const loopEnvelope = Math.sin(t * Math.PI);
    const wave =
      Math.sin(x * frequency + phase) * amplitude +
      Math.sin(t * Math.PI * 3 - phase * 0.8) * (amplitude * 0.55 * loopEnvelope);
    return centerY + wave;
  }

  // Default flowing wave
  return (
    centerY +
    Math.sin(x * frequency + phase) * amplitude +
    Math.cos(x * frequency * 1.75 - phase * 0.65) * (amplitude * 0.28)
  );
}

/**
 * Generates a closed SVG polygon path string for a variable-width tapered ribbon
 * from the same curve math (used for SSR / no-JS / reduced-motion fallback).
 */
export function buildStaticTaperedRibbonSvgPath(params: {
  width: number;
  height: number;
  amplitude: number;
  frequency: number;
  baseThickness: number;
  taper: boolean;
  pathPreset: FlowingLinePathPreset;
  variant: 'default' | 'strike';
  progress?: number;
}): string {
  const {
    width,
    height,
    amplitude,
    frequency,
    baseThickness,
    taper,
    pathPreset,
    variant,
    progress = 1,
  } = params;

  const clampedProgress = Math.max(0, Math.min(1, progress));
  if (clampedProgress <= 0.01) return '';

  const count = variant === 'strike' ? 28 : 52;
  const activeCount = Math.max(2, Math.round(count * clampedProgress));
  const upper: Array<{ x: number; y: number }> = [];
  const lower: Array<{ x: number; y: number }> = [];

  const centers: Array<{ x: number; y: number; s: number }> = [];
  for (let i = 0; i < activeCount; i++) {
    const t = (i / (count - 1));
    const s = i / (activeCount - 1);
    const x = t * width;
    const y = evaluateRestY(t, width, height, 0.4, amplitude, frequency, pathPreset, variant);
    centers.push({ x, y, s });
  }

  for (let i = 0; i < centers.length; i++) {
    const curr = centers[i]!;
    const prev = centers[Math.max(0, i - 1)]!;
    const next = centers[Math.min(centers.length - 1, i + 1)]!;

    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const endEnvelope = taper
      ? MOTION.flowingLine.taperEndRatio +
        (1 - MOTION.flowingLine.taperEndRatio) * Math.sin(curr.s * Math.PI)
      : 1;
    const swell = 1 + Math.sin(curr.s * Math.PI * 2.5) * MOTION.flowingLine.swellAmplitudeRatio;
    const halfW = (baseThickness * endEnvelope * swell) / 2;

    upper.push({ x: curr.x + nx * halfW, y: curr.y + ny * halfW });
    lower.push({ x: curr.x - nx * halfW, y: curr.y - ny * halfW });
  }

  if (upper.length === 0) return '';
  const firstUpper = upper[0]!;
  let d = `M ${firstUpper.x.toFixed(1)} ${firstUpper.y.toFixed(1)}`;
  for (let i = 1; i < upper.length; i++) {
    const pt = upper[i]!;
    d += ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }
  for (let i = lower.length - 1; i >= 0; i--) {
    const pt = lower[i]!;
    d += ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

/**
 * Signature Flowing Line — Rebuilt as a Thick Tapered Canvas 2D Physical Ribbon
 * (Design System Section 6.2, Tech Stack Section 4.2, About Prompt Part A):
 * - Canvas 2D variable-width ribbon of 48–80 spring-damped points with rounded caps.
 * - Thickness read from `--line-weight-hero` (`clamp(12px, 1.6vw, 28px)`) or
 *   `--line-weight-section` (`clamp(8px, 1.1vw, 20px)`), or `thickness` override.
 * - Both ends taper to ~30% of full thickness, with a gentle breathing swell along its length.
 * - Spring + damping physics per point: pointer pushes the ribbon aside with a soft falloff
 *   and it springs back with a small overshoot; clicking sends a travelling ripple wave packet;
 *   scroll velocity boosts amplitude.
 * - One shared `gsap.ticker` subscription (`RibbonTickerManager`), pausing off-screen lines
 *   and capping active canvases at 2 and `devicePixelRatio` at 2.
 * - Static thick tapered SVG shape rendered for reduced motion / SSR / no-JS fallback.
 */
export function FlowingLine({
  amplitude = MOTION.flowingLine.defaultAmplitude,
  frequency = MOTION.flowingLine.defaultFrequency,
  speed = MOTION.flowingLine.defaultSpeed,
  thickness,
  weight = 'section',
  taper = true,
  physics = true,
  path = 'wave',
  progress,
  variant = 'default',
  reactToPointer = true,
  tone,
  drawOnScroll = false,
  rippleCount = 0,
  className,
}: FlowingLineProps) {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isVisibleRef = useRef<boolean>(true);
  const phaseRef = useRef<number>(0);
  const scrollDrawProgressRef = useRef<number>(drawOnScroll ? 0.18 : 1);
  const externalProgressRef = useRef<number | undefined>(progress);
  const pointerRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const ripplesRef = useRef<Array<{ pos: number; amp: number }>>([]);

  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const velocityRef = useScrollVelocity();

  const numPoints =
    variant === 'strike'
      ? MOTION.flowingLine.strikePoints
      : MOTION.flowingLine.defaultPoints;

  const offsetsYRef = useRef<Float32Array>(new Float32Array(numPoints));
  const velocitiesYRef = useRef<Float32Array>(new Float32Array(numPoints));

  useEffect(() => {
    externalProgressRef.current = progress;
  }, [progress]);

  // Spawn travelling ripple when rippleCount increments
  useEffect(() => {
    if (rippleCount > 0 && !shouldSimplifyMotion) {
      ripplesRef.current.push({
        pos: 0,
        amp: MOTION.flowingLine.rippleAmplitude,
      });
    }
  }, [rippleCount, shouldSimplifyMotion]);

  // Pause when off-screen via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisibleRef.current = entry.isIntersecting;
        }
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track pointer position relative to the ribbon container
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !reactToPointer || !physics || isTouch || shouldSimplifyMotion) return;

    const handleMove = (event: MouseEvent) => {
      if (!isVisibleRef.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handleLeave = () => {
      pointerRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [reactToPointer, physics, isTouch, shouldSimplifyMotion]);

  // Scroll-linked draw & shared ticker registration
  useGSAP(
    () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let cssWidth = container.clientWidth || 1200;
      let cssHeight = container.clientHeight || 160;
      let resolvedThicknessPx =
        thickness ??
        (weight === 'hero'
          ? MOTION.flowingLine.heroWeightFallbackPx
          : MOTION.flowingLine.sectionWeightFallbackPx);

      const measure = () => {
        const rect = container.getBoundingClientRect();
        cssWidth = Math.max(1, rect.width || 1200);
        cssHeight = Math.max(1, rect.height || (variant === 'strike' ? 28 : 160));
        const dpr = Math.min(
          MOTION.flowingLine.maxDevicePixelRatio,
          window.devicePixelRatio || 1,
        );
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (thickness !== undefined) {
          resolvedThicknessPx = thickness;
        } else if (variant === 'strike') {
          const parentFontSize =
            parseFloat(window.getComputedStyle(container).fontSize || '28') || 28;
          resolvedThicknessPx = Math.max(
            3.5,
            parentFontSize * MOTION.flowingLine.strikeEmRatio,
          );
        } else {
          // Measure clamp() CSS variable in pixels
          const vw = window.innerWidth;
          resolvedThicknessPx =
            weight === 'hero'
              ? Math.max(12, Math.min(28, vw * 0.016))
              : Math.max(8, Math.min(20, vw * 0.011));
        }

        // Expose measured ribbon stroke thickness on the canvas dataset for inspection/testing
        canvas.dataset.ribbonWeightPx = String(Math.round(resolvedThicknessPx));
      };

      measure();
      window.addEventListener('resize', measure);

      if (drawOnScroll && externalProgressRef.current === undefined) {
        gsap.fromTo(
          scrollDrawProgressRef,
          { current: 0.08 },
          {
            current: 1,
            ease: MOTION.ease.linear,
            scrollTrigger: {
              trigger: container,
              start: 'top 90%',
              end: 'bottom 32%',
              scrub: 0.5,
            },
          },
        );
      }

      const resolveAccentColor = (): string => {
        if (tone === 'dark') return '#19e37a';
        if (tone === 'light') return '#0b4d34';
        const computed = window
          .getComputedStyle(container)
          .getPropertyValue('--line-accent')
          .trim();
        if (computed && !computed.startsWith('var(')) {
          return computed;
        }
        return document.documentElement.classList.contains('dark') ? '#19e37a' : '#0b4d34';
      };

      const renderFrame = () => {
        const drawRatio = Math.max(
          0,
          Math.min(1, externalProgressRef.current ?? scrollDrawProgressRef.current),
        );

        ctx.clearRect(0, 0, cssWidth, cssHeight);
        if (drawRatio <= 0.01) return;

        const velocityBoost = physics
          ? Math.min(
              32,
              Math.abs(velocityRef.current) * MOTION.flowingLine.velocityMultiplier,
            )
          : 0;
        const effectiveAmp =
          variant === 'strike' ? amplitude * 0.25 : amplitude + velocityBoost;

        phaseRef.current += speed + velocityBoost * 0.001;

        // Advance travelling click ripples
        const activeRipples = ripplesRef.current;
        for (let r = activeRipples.length - 1; r >= 0; r--) {
          const ripple = activeRipples[r]!;
          ripple.pos += MOTION.flowingLine.rippleSpeed;
          ripple.amp *= MOTION.flowingLine.rippleDecay;
          if (ripple.pos > 1.25 || ripple.amp < 0.4) {
            activeRipples.splice(r, 1);
          }
        }

        const offsets = offsetsYRef.current;
        const velocities = velocitiesYRef.current;
        const ptr = pointerRef.current;

        // Step 1: Update spring-damped offsets per point
        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          const x = t * cssWidth;
          const restY = evaluateRestY(
            t,
            cssWidth,
            cssHeight,
            phaseRef.current,
            effectiveAmp,
            frequency,
            path,
            variant,
          );

          let force = -MOTION.flowingLine.springStiffness * (offsets[i] ?? 0);

          // Neighbor coupling so disturbance travels like a physical rope
          if (i > 0 && i < numPoints - 1) {
            const avgNeighbor = ((offsets[i - 1] ?? 0) + (offsets[i + 1] ?? 0)) * 0.5;
            force += (avgNeighbor - (offsets[i] ?? 0)) * MOTION.flowingLine.neighborCoupling;
          }

          // Pointer push-aside with soft falloff
          if (physics && ptr.x !== null && ptr.y !== null) {
            const currentY = restY + (offsets[i] ?? 0);
            const dx = x - ptr.x;
            const dy = currentY - ptr.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOTION.flowingLine.pointerInfluenceRadius && dist > 0.1) {
              const falloff = 1 - dist / MOTION.flowingLine.pointerInfluenceRadius;
              const direction = dy >= 0 ? 1 : -1;
              force +=
                direction *
                falloff *
                falloff *
                MOTION.flowingLine.pointerPushStrength *
                0.15;
            }
          }

          // Travelling click ripples
          for (const ripple of activeRipples) {
            const distT = t - ripple.pos;
            const gaussian = Math.exp(
              -(distT * distT) /
                (2 * MOTION.flowingLine.rippleWidth * MOTION.flowingLine.rippleWidth),
            );
            force += Math.sin(distT * 28) * ripple.amp * gaussian * 0.14;
          }

          const nextVy = ((velocities[i] ?? 0) + force) * MOTION.flowingLine.springDamping;
          velocities[i] = nextVy;
          offsets[i] = (offsets[i] ?? 0) + nextVy;
        }

        // Step 2: Build active ribbon spine points up to `drawRatio`
        const activeCount = Math.max(2, Math.round(numPoints * drawRatio));
        const spine: Array<{ x: number; y: number; s: number; halfW: number }> = [];

        for (let i = 0; i < activeCount; i++) {
          const t = i / (numPoints - 1);
          const s = i / (activeCount - 1);
          const x = t * cssWidth;
          const restY = evaluateRestY(
            t,
            cssWidth,
            cssHeight,
            phaseRef.current,
            effectiveAmp,
            frequency,
            path,
            variant,
          );
          const y = restY + (offsets[i] ?? 0);

          // Taper both ends to ~30% of full thickness + breathing swell along length
          const endEnvelope = taper
            ? MOTION.flowingLine.taperEndRatio +
              (1 - MOTION.flowingLine.taperEndRatio) * Math.sin(s * Math.PI)
            : 1;
          const swell =
            variant === 'strike'
              ? 1
              : 1 +
                Math.sin(s * Math.PI * 2.5 - phaseRef.current * 0.9) *
                  MOTION.flowingLine.swellAmplitudeRatio;
          const halfW = (resolvedThicknessPx * endEnvelope * swell) / 2;

          spine.push({ x, y, s, halfW });
        }

        // Step 3: Compute upper and lower ribbon edges using normal vectors
        const upper: Array<{ x: number; y: number }> = [];
        const lower: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < spine.length; i++) {
          const curr = spine[i]!;
          const prev = spine[Math.max(0, i - 1)]!;
          const next = spine[Math.min(spine.length - 1, i + 1)]!;

          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          upper.push({ x: curr.x + nx * curr.halfW, y: curr.y + ny * curr.halfW });
          lower.push({ x: curr.x - nx * curr.halfW, y: curr.y - ny * curr.halfW });
        }

        const accentColor = resolveAccentColor();
        ctx.fillStyle = accentColor;

        // Draw smoothed variable-width polygon
        ctx.beginPath();
        const firstU = upper[0]!;
        ctx.moveTo(firstU.x, firstU.y);

        for (let i = 1; i < upper.length - 1; i++) {
          const curr = upper[i]!;
          const next = upper[i + 1]!;
          ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) * 0.5, (curr.y + next.y) * 0.5);
        }
        const lastU = upper[upper.length - 1]!;
        ctx.lineTo(lastU.x, lastU.y);

        const lastL = lower[lower.length - 1]!;
        ctx.lineTo(lastL.x, lastL.y);

        for (let i = lower.length - 2; i > 0; i--) {
          const curr = lower[i]!;
          const prev = lower[i - 1]!;
          ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + prev.x) * 0.5, (curr.y + prev.y) * 0.5);
        }
        const firstL = lower[0]!;
        ctx.lineTo(firstL.x, firstL.y);
        ctx.closePath();
        ctx.fill();

        // Rounded caps at tail and head
        const tail = spine[0]!;
        const head = spine[spine.length - 1]!;
        ctx.beginPath();
        ctx.arc(tail.x, tail.y, tail.halfW, 0, Math.PI * 2);
        ctx.arc(head.x, head.y, head.halfW, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw initial frame immediately (serves as static tapered path when reduced motion is active)
      renderFrame();

      if (shouldSimplifyMotion) {
        return () => {
          window.removeEventListener('resize', measure);
        };
      }

      const unregister = ribbonManager.register({
        id: reactId,
        isVisible: () => isVisibleRef.current,
        step: renderFrame,
      });

      return () => {
        window.removeEventListener('resize', measure);
        unregister();
      };
    },
    {
      scope: containerRef,
      dependencies: [
        amplitude,
        frequency,
        speed,
        thickness,
        weight,
        taper,
        physics,
        drawOnScroll,
        variant,
        tone,
        shouldSimplifyMotion,
      ],
    },
  );

  // Also re-render static/progressive canvas when external `progress` prop changes
  const viewWidth = 1440;
  const viewHeight = variant === 'strike' ? 36 : 200;
  const fallbackThickness =
    thickness ??
    (variant === 'strike'
      ? 5
      : weight === 'hero'
        ? MOTION.flowingLine.heroWeightFallbackPx
        : MOTION.flowingLine.sectionWeightFallbackPx);

  const staticRibbonPath = buildStaticTaperedRibbonSvgPath({
    width: viewWidth,
    height: viewHeight,
    amplitude: variant === 'strike' ? amplitude * 0.25 : amplitude,
    frequency,
    baseThickness: fallbackThickness,
    taper,
    pathPreset: path,
    variant,
    progress: progress ?? 1,
  });

  const strokeFillColor =
    tone === 'dark'
      ? 'var(--green-signal)'
      : tone === 'light'
        ? 'var(--green-deep)'
        : 'var(--line-accent)';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-flowing-line="true"
      data-line-weight={weight}
      data-line-variant={variant}
      className={cn('pointer-events-none relative w-full overflow-visible select-none', className)}
    >
      <canvas
        ref={canvasRef}
        data-testid="flowing-line-canvas"
        data-ribbon-weight-px={String(Math.round(fallbackThickness))}
        className="block h-full w-full"
      />

      {/* Static thick tapered SVG shape for no-JS / SSR fallback */}
      <noscript>
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <path d={staticRibbonPath} fill={strokeFillColor} />
        </svg>
      </noscript>
    </div>
  );
}
