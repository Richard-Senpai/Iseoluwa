'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { ScrollScrubMedia } from '@/components/motion/ScrollScrubMedia';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { track } from '@/lib/analytics';

/**
 * Pure helper: maps overall pinned-scene progress `p` in `[0..1]` to the active
 * scrub & word-lighting window `[0..1]`:
 * - `0.00 -> 0.08`: lead-in hold (`0`)
 * - `0.08 -> 0.92`: active scrub & word-lighting (`0..1`)
 * - `0.92 -> 1.00`: tail hold (`1`)
 */
export function mapNameSceneProgress(rawProgress: number): number {
  const p = Math.max(0, Math.min(1, Number.isFinite(rawProgress) ? rawProgress : 0));
  if (p <= 0.08) return 0;
  if (p >= 0.92) return 1;
  return (p - 0.08) / 0.84;
}

/**
 * Pure helper: given `activeProgress` (`0..1`) and `wordCount`, returns how many words
 * (`0..wordCount`) should be lit (`--ink`). At `activeProgress >= 1` (i.e. raw progress >= 0.92),
 * all words (`wordCount`) are lit.
 */
export function countLitWords(activeProgress: number, wordCount: number): number {
  if (wordCount <= 0) return 0;
  if (activeProgress <= 0) return 0;
  if (activeProgress >= 1) return wordCount;
  return Math.min(wordCount, Math.max(0, Math.ceil(activeProgress * wordCount)));
}

/**
 * Pinned "01 / THE NAME" scene (`src/features/about/sections/NameScene.tsx`).
 * - Renders after the `"isé means work. oluwa means the Lord."` split lines.
 * - Centres the scroll-scrubbed animation (`ScrollScrubMedia`) on top and the statement
 *   beneath it inside a single pinned stage (`~10 of 12` cols on desktop, full width on mobile).
 * - One GSAP `ScrollTrigger` timeline (`pin: true`, `pinSpacing: true`, `anticipatePin: 1`)
 *   drives both the frame sequence and the word-by-word statement lighting (`--ink-muted` -> `--ink`,
 *   zero opacity fade, zero blur) so the final frame and the last word (`"Lord."`) finish together
 *   at 92% progress and hold briefly before unpinning.
 */
export function NameScene() {
  const { theName, nameSectionMedia } = ABOUT_CONTENT;
  const { reducedMotion } = useMotionPreference();

  const stageRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLParagraphElement>(null);
  const [activeProgress, setActiveProgress] = useState<number>(reducedMotion ? 1 : 0);

  const words = useMemo(
    () => theName.statement.trim().split(/\s+/).filter(Boolean),
    [theName.statement],
  );

  // Imperatively sync word classes + data-lit attributes for 60fps scroll performance
  const applyWordLighting = useCallback(
    (mappedActiveP: number) => {
      const container = wordsContainerRef.current;
      if (!container) return;
      const wordNodes = container.querySelectorAll<HTMLSpanElement>(
        '[data-testid="name-statement-word"]',
      );
      const litCount = reducedMotion ? wordNodes.length : countLitWords(mappedActiveP, wordNodes.length);

      wordNodes.forEach((node, idx) => {
        const isLit = idx < litCount;
        node.dataset.lit = isLit ? 'true' : 'false';
        if (isLit) {
          node.classList.add('text-ink');
          node.classList.remove('text-ink-muted');
        } else {
          node.classList.add('text-ink-muted');
          node.classList.remove('text-ink');
        }
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (reducedMotion) {
      setActiveProgress(1);
      applyWordLighting(1);
    } else {
      applyWordLighting(activeProgress);
    }
  }, [reducedMotion, activeProgress, applyWordLighting]);

  useGSAP(
    () => {
      if (reducedMotion || !stageRef.current) return;

      const stageEl = stageRef.current;

      const st = ScrollTrigger.create({
        trigger: stageEl,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 2.5)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const mapped = mapNameSceneProgress(self.progress);
          stageEl.dataset.sceneProgress = self.progress.toFixed(4);
          stageEl.dataset.activeProgress = mapped.toFixed(4);
          setActiveProgress(mapped);
          applyWordLighting(mapped);
        },
      });

      const initialMapped = mapNameSceneProgress(st.progress);
      setActiveProgress(initialMapped);
      applyWordLighting(initialMapped);

      return () => {
        st.kill();
      };
    },
    { scope: stageRef, dependencies: [reducedMotion, applyWordLighting] },
  );

  // Refresh ScrollTrigger after fonts load and on resize/orientationchange
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    let rafId = 0;
    const scheduleRefresh = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    if (document.fonts?.ready) {
      void document.fonts.ready.then(scheduleRefresh).catch(() => {});
    }

    window.addEventListener('resize', scheduleRefresh);
    window.addEventListener('orientationchange', scheduleRefresh);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleRefresh);
      window.removeEventListener('orientationchange', scheduleRefresh);
    };
  }, [reducedMotion]);

  const handleMediaReady = useCallback(() => {
    if (!reducedMotion && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [reducedMotion]);

  const litCount = reducedMotion ? words.length : countLitWords(activeProgress, words.length);

  return (
    <div className="relative">
      {/* Subtle accessible Skip link visible on keyboard focus */}
      <a
        href="#the-founder"
        data-testid="name-scene-skip"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-30 focus:rounded-pill focus:border focus:border-line focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
      >
        Skip
      </a>

      <div
        ref={stageRef}
        data-testid="name-pinned-scene"
        data-pinned={reducedMotion ? 'false' : 'true'}
        className={
          reducedMotion
            ? 'py-8 md:py-12'
            : 'flex min-h-[100svh] flex-col items-center justify-center pt-16 pb-6 md:pt-20 md:pb-8'
        }
      >
        <div className="mx-auto grid w-full grid-cols-1 lg:grid-cols-12">
          <div className="flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:col-span-10 lg:col-start-2">
            {/* Top: Large centered scroll-scrubbed animation panel */}
            <ScrollScrubMedia
              manifestUrl={nameSectionMedia.manifestUrl}
              progress={reducedMotion ? 1 : activeProgress}
              lerpFactor={0.22}
              alt={nameSectionMedia.alt}
              caption={null}
              showProgressLabel={false}
              priority
              onReady={handleMediaReady}
              onFirstInteraction={() => track('name_media_first_interaction')}
              onCompleted={() => track('name_media_completed')}
              className="flex w-full justify-center"
              panelClassName="h-[min(42vh,340px)] sm:h-[min(46vh,400px)] md:h-[min(48vh,450px)] w-auto max-w-full"
            />

            {/* Bottom: Centered statement lit word by word in sync with the animation */}
            <div className="w-full max-w-[38ch] text-center">
              <p
                ref={wordsContainerRef}
                data-testid="name-scene-statement"
                className="font-sans text-[clamp(1.25rem,2.35vw,2.15rem)] leading-[1.22] font-medium tracking-[-0.02em]"
              >
                {words.map((word, idx) => {
                  const isLit = idx < litCount;
                  return (
                    <span key={`${word}-${idx}`}>
                      <span
                        data-testid="name-statement-word"
                        data-word-index={idx}
                        data-lit={isLit ? 'true' : 'false'}
                        className={
                          isLit
                            ? 'text-ink transition-colors duration-150'
                            : 'text-ink-muted transition-colors duration-150'
                        }
                      >
                        {word}
                      </span>
                      {idx < words.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
