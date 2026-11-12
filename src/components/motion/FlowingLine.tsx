'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION } from '@/config/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { cn } from '@/lib/utils';

export interface FlowingLineProps {
  amplitude?: number;
  frequency?: number;
  speed?: number;
  thickness?: number;
  reactToPointer?: boolean;
  tone?: 'light' | 'dark';
  drawOnScroll?: boolean;
  rippleCount?: number;
  className?: string;
}

function buildSineWavePath(
  width: number,
  height: number,
  phase: number,
  amplitude: number,
  frequency: number,
  pointerX: number | null,
  pointerY: number | null,
  rippleEnergy: number,
): string {
  const segments = 48;
  const step = width / segments;
  const centerY = height / 2;
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    let y = centerY + Math.sin(x * frequency + phase) * amplitude;

    // Secondary harmonic for organic motion
    y += Math.cos(x * frequency * 1.8 - phase * 0.65) * (amplitude * 0.28);

    // Click/tap ripple wave packet
    if (rippleEnergy > 0.5) {
      const normalized = i / segments;
      const envelope = Math.sin(normalized * Math.PI);
      y += Math.sin(normalized * 18 - phase * 4.5) * rippleEnergy * envelope;
    }

    // Gentle bend toward desktop pointer
    if (pointerX !== null && pointerY !== null) {
      const dist = Math.abs(x - pointerX);
      if (dist < MOTION.flowingLine.pointerInfluenceRadius) {
        const pull = 1 - dist / MOTION.flowingLine.pointerInfluenceRadius;
        const deltaY = Math.max(
          -MOTION.flowingLine.pointerMaxBend,
          Math.min(MOTION.flowingLine.pointerMaxBend, (pointerY - centerY) * 0.35),
        );
        y += deltaY * pull * pull;
      }
    }

    points.push({ x, y });
  }

  const first = points[0];
  if (!first) return '';

  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (!prev || !curr) continue;
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }

  return d;
}

/**
 * Signature Flowing Line (Design System Section 6.2 & Tech Stack Section 4.2):
 * - Inline SVG path behind text, hidden from assistive tech (`aria-hidden="true"`).
 * - Progressive scroll-linked draw (`DrawSVGPlugin` + `ScrollTrigger`).
 * - Live wave driven by `gsap.ticker`, boosted by Lenis scroll velocity, bends toward pointer on desktop,
 *   and propagates a ripple when `rippleCount` increments (Hero click/tap).
 * - Paused via `IntersectionObserver` when off-screen; static curve under reduced motion.
 */
export function FlowingLine({
  amplitude = MOTION.flowingLine.defaultAmplitude,
  frequency = MOTION.flowingLine.defaultFrequency,
  speed = MOTION.flowingLine.defaultSpeed,
  thickness = MOTION.flowingLine.defaultThickness,
  reactToPointer = true,
  tone,
  drawOnScroll = false,
  rippleCount = 0,
  className,
}: FlowingLineProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const isVisibleRef = useRef(true);
  const phaseRef = useRef(0);
  const currentAmpRef = useRef(amplitude);
  const rippleEnergyRef = useRef(0);
  const pointerRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const velocityRef = useScrollVelocity();

  const viewWidth = 1440;
  const viewHeight = 200;

  // Trigger ripple energy when rippleCount increments
  useEffect(() => {
    if (rippleCount > 0 && !shouldSimplifyMotion) {
      rippleEnergyRef.current = MOTION.flowingLine.rippleAmplitude;
    }
  }, [rippleCount, shouldSimplifyMotion]);

  // Pause animation loop when off-screen
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisibleRef.current = entry.isIntersecting;
        }
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Track pointer position on desktop
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !reactToPointer || isTouch || shouldSimplifyMotion) return;

    const handleMove = (event: MouseEvent) => {
      if (!isVisibleRef.current) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const relX = ((event.clientX - rect.left) / rect.width) * viewWidth;
      const relY = ((event.clientY - rect.top) / rect.height) * viewHeight;
      pointerRef.current = { x: relX, y: relY };
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
  }, [reactToPointer, isTouch, shouldSimplifyMotion]);

  // Live wave loop via gsap.ticker + optional DrawSVG scroll scrub
  useGSAP(
    () => {
      const svg = svgRef.current;
      const path = pathRef.current;
      if (!svg || !path) return;

      const initialD = buildSineWavePath(
        viewWidth,
        viewHeight,
        0,
        amplitude,
        frequency,
        null,
        null,
        0,
      );
      path.setAttribute('d', initialD);

      if (shouldSimplifyMotion) return;

      if (drawOnScroll) {
        gsap.fromTo(
          path,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: MOTION.ease.linear,
            scrollTrigger: {
              trigger: svg,
              start: 'top 88%',
              end: 'bottom 30%',
              scrub: 0.6,
            },
          },
        );
      }

      const tick = () => {
        if (!isVisibleRef.current) return;

        const velocityBoost = Math.min(
          38,
          Math.abs(velocityRef.current) * MOTION.flowingLine.velocityMultiplier,
        );
        const targetAmp = amplitude + velocityBoost;
        currentAmpRef.current += (targetAmp - currentAmpRef.current) * 0.08;

        rippleEnergyRef.current *= MOTION.flowingLine.rippleDecay;
        phaseRef.current += speed + velocityBoost * 0.0012;

        const d = buildSineWavePath(
          viewWidth,
          viewHeight,
          phaseRef.current,
          currentAmpRef.current,
          frequency,
          pointerRef.current.x,
          pointerRef.current.y,
          rippleEnergyRef.current,
        );
        path.setAttribute('d', d);
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
      };
    },
    {
      scope: svgRef,
      dependencies: [amplitude, frequency, speed, drawOnScroll, shouldSimplifyMotion],
    },
  );

  const strokeColor =
    tone === 'dark'
      ? 'var(--green-signal)'
      : tone === 'light'
        ? 'var(--green-deep)'
        : 'var(--line-accent)';

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="none"
      className={cn('pointer-events-none w-full overflow-visible select-none', className)}
    >
      <path
        ref={pathRef}
        d={`M 0 ${viewHeight / 2} Q ${viewWidth / 4} ${viewHeight / 2 - amplitude}, ${viewWidth / 2} ${viewHeight / 2} T ${viewWidth} ${viewHeight / 2}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={thickness}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
