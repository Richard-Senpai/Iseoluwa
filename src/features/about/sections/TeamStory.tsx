'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TagList } from '@/components/ui/Tag';
import { Media } from '@/components/media/Media';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { useLenis } from '@/components/motion/SmoothScroll';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { TEAM, TEAM_STORY_CONTENT } from '@/content/team';
import { getActiveSocials, SITE_CONTENT } from '@/content/site';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { TeamMember, TeamMemberId, TeamMemberLinks } from '@/types/team';

/**
 * Scroll timeline windows for the 4 team members and 3 handovers inside the pinned desktop stage.
 * - Member 0 (Founder):    0.00 -> 0.25 (4 chapters + note)
 * - Handover 0 -> 1:       0.25 -> 0.31 (~0.9s equivalent scroll-scrubbed handover)
 * - Member 1 (Co-Founder): 0.31 -> 0.50 (Beat 1: 0.31->0.40, Beat 2: 0.40->0.50)
 * - Handover 1 -> 2:       0.50 -> 0.56
 * - Member 2 (Developer):  0.56 -> 0.75 (Beat 1: 0.56->0.65, Beat 2: 0.65->0.75)
 * - Handover 2 -> 3:       0.75 -> 0.81
 * - Member 3 (Marketer):   0.81 -> 1.00 (Beat 1: 0.81->0.90, Beat 2: 0.90->1.00)
 */
const MEMBER_WINDOWS: ReadonlyArray<{
  start: number;
  end: number;
  beat2Start: number;
  targetProgress: number;
}> = [
  { start: 0.0, end: 0.25, beat2Start: 0.12, targetProgress: 0.04 },
  { start: 0.31, end: 0.5, beat2Start: 0.4, targetProgress: 0.42 },
  { start: 0.56, end: 0.75, beat2Start: 0.65, targetProgress: 0.67 },
  { start: 0.81, end: 1.0, beat2Start: 0.9, targetProgress: 0.92 },
];

const HANDOVER_WINDOWS: ReadonlyArray<{
  fromIdx: number;
  toIdx: number;
  start: number;
  end: number;
}> = [
  { fromIdx: 0, toIdx: 1, start: 0.25, end: 0.31 },
  { fromIdx: 1, toIdx: 2, start: 0.5, end: 0.56 },
  { fromIdx: 2, toIdx: 3, start: 0.75, end: 0.81 },
];

function getConfiguredMemberLinks(
  links: TeamMemberLinks,
): Array<{ key: keyof TeamMemberLinks; label: string; href: string }> {
  const entries: Array<{ key: keyof TeamMemberLinks; label: string; href: string }> = [];
  (Object.keys(links) as Array<keyof TeamMemberLinks>).forEach((key) => {
    const raw = links[key];
    if (raw && raw.trim().length > 0) {
      entries.push({
        key,
        label: TEAM_STORY_CONTENT.linkLabels[key],
        href: key === 'email' && !raw.startsWith('mailto:') ? `mailto:${raw}` : raw,
      });
    }
  });
  return entries;
}

/**
 * Computes per-member visual state at overall pinned scroll progress `p` in [0..1].
 */
function evaluateSceneAtProgress(p: number) {
  const clamped = Math.max(0, Math.min(1, p));

  // Determine active member index and whether we are inside a handover window
  let activeIdx = 0;
  let handoverProgress = 0;
  let isHandover = false;

  for (let i = 0; i < HANDOVER_WINDOWS.length; i++) {
    const hw = HANDOVER_WINDOWS[i]!;
    if (clamped >= hw.start && clamped <= hw.end) {
      isHandover = true;
      handoverProgress = (clamped - hw.start) / (hw.end - hw.start);
      activeIdx = handoverProgress >= 0.5 ? hw.toIdx : hw.fromIdx;
      break;
    }
  }

  if (!isHandover) {
    for (let i = 0; i < MEMBER_WINDOWS.length; i++) {
      const mw = MEMBER_WINDOWS[i]!;
      if (clamped >= mw.start && clamped <= mw.end) {
        activeIdx = i;
        break;
      }
    }
  }

  // Per-member portrait clip-path & grayscale (100% -> 0%, ending at `none`)
  const portraitClipPaths: string[] = TEAM.map((_, idx) => {
    // Check if this member is outgoing or incoming in an active handover
    for (const hw of HANDOVER_WINDOWS) {
      if (clamped >= hw.start && clamped <= hw.end) {
        const t = (clamped - hw.start) / (hw.end - hw.start);
        if (idx === hw.fromIdx) {
          // Current portrait wipes out to the left
          const rightInset = Math.round(t * 1000) / 10;
          return `inset(0% ${rightInset}% 0% 0%)`;
        }
        if (idx === hw.toIdx) {
          // Next portrait wipes in from the right
          const leftInset = Math.round((1 - t) * 1000) / 10;
          return `inset(0% 0% 0% ${leftInset}%)`;
        }
        return 'inset(0% 0% 0% 100%)';
      }
    }

    return idx === activeIdx ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)';
  });

  const portraitFilters: string[] = TEAM.map((_, idx) => {
    const mw = MEMBER_WINDOWS[idx]!;
    if (clamped <= mw.start) return 'grayscale(100%)';
    const beatSpan = Math.max(0.08, (mw.end - mw.start) * 0.75);
    const localT = Math.min(1, Math.max(0, (clamped - mw.start) / beatSpan));
    const gray = Math.round((1 - localT) * 100);
    return gray <= 0 ? 'none' : `grayscale(${gray}%)`;
  });

  // Beat 2 reveal for Co-Founder, Developer, and Marketer (focus tags + Work with [first name] CTA)
  const beat2Revealed: boolean[] = TEAM.map((_, idx) => {
    if (idx === 0) return true;
    const mw = MEMBER_WINDOWS[idx]!;
    return clamped >= mw.beat2Start - 0.02;
  });

  // Founder chapter index [0..3] during Member 0 window [0..0.25]
  const founderLocalP = Math.max(0, Math.min(1, clamped / MEMBER_WINDOWS[0]!.end));
  const founderChapterIdx = Math.min(3, Math.floor(founderLocalP * 4));

  // FlowingLine progress: threads across Founder chapters, and sweeps 0 -> 1 during each handover
  let lineProgress = 0.25 + founderLocalP * 0.75;
  if (isHandover) {
    lineProgress = 0.15 + handoverProgress * 0.85;
  } else if (activeIdx > 0) {
    const mw = MEMBER_WINDOWS[activeIdx]!;
    const memberLocal = Math.max(0, Math.min(1, (clamped - mw.start) / (mw.end - mw.start)));
    lineProgress = 0.35 + memberLocal * 0.65;
  }

  return {
    activeIdx,
    isHandover,
    handoverProgress,
    portraitClipPaths,
    portraitFilters,
    beat2Revealed,
    founderChapterIdx,
    lineProgress,
  };
}

/**
 * Section 3: TeamStory (`src/features/about/sections/TeamStory.tsx`)
 * Replaces the single-person founder section with a pinned, scroll-driven scene that
 * moves through all four team members:
 * 01 Ojedayo Richard Iseoluwa (Founder) -> 02 Daniel Oshinaike (Co-Founder) ->
 * 03 Abdulmaleek Asimiyu (Developer) -> 04 Jessica Omotayo (Marketer and Social Media Manager).
 */
export function TeamStory() {
  const { founderSection } = ABOUT_CONTENT;
  const { founder } = SITE_CONTENT;
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();
  const lenis = useLenis();

  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const backdropWordRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [sceneProgress, setSceneProgress] = useState(0);
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [shouldPreloadPortraits, setShouldPreloadPortraits] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const viewedMembersRef = useRef<Set<TeamMemberId>>(new Set());
  const lastTrackedChapterRef = useRef<number>(-1);

  const sceneState = evaluateSceneAtProgress(sceneProgress);
  const currentMember: TeamMember = TEAM[activeMemberIdx] ?? TEAM[0]!;

  // Track `team_member_viewed` once per member view
  useEffect(() => {
    const member = TEAM[activeMemberIdx];
    if (!member) return;
    if (!viewedMembersRef.current.has(member.id)) {
      viewedMembersRef.current.add(member.id);
      track('team_member_viewed', { id: member.id });
    }
  }, [activeMemberIdx]);

  // Preload portraits 2–4 when the section is within ~1 viewport of entering
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldPreloadPortraits) return;

    const triggerPreload = () => {
      setShouldPreloadPortraits(true);
      TEAM.slice(1).forEach((member) => {
        if (member.portrait.src && typeof window !== 'undefined') {
          const img = new window.Image();
          img.src = member.portrait.src;
        }
      });
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom+=100%',
      once: true,
      onEnter: triggerPreload,
    });

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            triggerPreload();
            observer?.disconnect();
          }
        },
        { rootMargin: '100% 0px 100% 0px' },
      );
      observer.observe(el);
    }

    return () => {
      st.kill();
      observer?.disconnect();
    };
  }, [shouldPreloadPortraits]);

  // Desktop pinned scroll-driven 4-member sequence (disabled on mobile `< 1024px` and reduced-motion)
  useGSAP(
    () => {
      if (shouldSimplifyMotion || !pinStageRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinStageRef.current,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 5.2)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              setSceneProgress(p);
              const evaluated = evaluateSceneAtProgress(p);
              setActiveMemberIdx(evaluated.activeIdx);
              if (evaluated.activeIdx === 0) {
                setActiveChapterIdx(evaluated.founderChapterIdx);
                if (lastTrackedChapterRef.current !== evaluated.founderChapterIdx) {
                  lastTrackedChapterRef.current = evaluated.founderChapterIdx;
                  const ch = founderSection.chapters[evaluated.founderChapterIdx];
                  if (ch) {
                    track('about_chapter_viewed', {
                      chapter: evaluated.founderChapterIdx + 1,
                      marker: ch.marker,
                      label: ch.label,
                    });
                  }
                }
              }
            },
          },
        });

        scrollTriggerRef.current = tl.scrollTrigger ?? null;

        return () => {
          scrollTriggerRef.current = null;
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: pinStageRef, dependencies: [shouldSimplifyMotion] },
  );

  // Smoothly scroll to a member's position when a rail item is clicked
  const handleRailMemberClick = (idx: number) => {
    const member = TEAM[idx];
    if (!member) return;

    track('team_rail_clicked', { id: member.id });
    setActiveMemberIdx(idx);

    const targetWin = MEMBER_WINDOWS[idx];
    if (targetWin) {
      setSceneProgress(targetWin.targetProgress);
    }

    const st = scrollTriggerRef.current;
    if (!shouldSimplifyMotion && st && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const targetProgress = targetWin?.targetProgress ?? idx / Math.max(1, TEAM.length - 1);
      const targetY = Math.round(st.start + (st.end - st.start) * targetProgress);
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.9 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
      return;
    }

    // Mobile / reduced-motion fallback: scroll to the member's stacked article block
    const stackedEl = document.getElementById(`team-member-${member.id}`);
    if (stackedEl) {
      if (lenis) {
        lenis.scrollTo(stackedEl, { offset: -96, duration: 0.8 });
      } else {
        stackedEl.scrollIntoView({ behavior: shouldSimplifyMotion ? 'auto' : 'smooth' });
      }
    }
  };

  const handleSkipTeamClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track('team_skip_clicked');
    const nextSection = document.getElementById(TEAM_STORY_CONTENT.skipTargetId);
    if (nextSection) {
      event.preventDefault();
      if (lenis && !shouldSimplifyMotion) {
        lenis.scrollTo(nextSection, { duration: 0.8 });
      } else {
        nextSection.scrollIntoView({ behavior: shouldSimplifyMotion ? 'auto' : 'smooth' });
      }
      const focusTarget = nextSection.querySelector<HTMLElement>('h2, a, button') ?? nextSection;
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  };

  // Subtle pointer parallax between portrait and giant display name on desktop
  const handleStageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldSimplifyMotion || isTouch || !pinStageRef.current) return;
    const rect = pinStageRef.current.getBoundingClientRect();
    const normX = (event.clientX - rect.left) / rect.width - 0.5;
    const normY = (event.clientY - rect.top) / rect.height - 0.5;

    if (portraitWrapRef.current) {
      gsap.to(portraitWrapRef.current, {
        x: normX * 14,
        y: normY * 10,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (backdropWordRef.current) {
      gsap.to(backdropWordRef.current, {
        x: -normX * 22,
        y: -normY * 14,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleStageMouseLeave = () => {
    if (!isTouch) resetCursor();
    if (shouldSimplifyMotion) return;
    if (portraitWrapRef.current) {
      gsap.to(portraitWrapRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    }
    if (backdropWordRef.current) {
      gsap.to(backdropWordRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(founderSection.reachMe.emailCta.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = founderSection.reachMe.emailCta.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedEmail(true);
    track('about_email_copied', { email: founderSection.reachMe.emailCta.email });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section
      ref={sectionRef}
      id="the-founder"
      data-testid="team-story-section"
      aria-label="Meet the Iséoluwa team"
      className="relative overflow-x-hidden border-t border-line"
    >
      {/* Polite live region announcing the active team member for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="team-live-region">
        {`${currentMember.orderNumber} / ${TEAM_STORY_CONTENT.totalCountFormatted}: ${currentMember.name}, ${currentMember.role}`}
      </div>

      {/* ==================================================================== */}
      {/* DESKTOP PINNED SCENE (lg+ when motion is enabled)                    */}
      {/* ==================================================================== */}
      <div
        ref={pinStageRef}
        data-testid="team-pinned-stage"
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        className={cn(
          'relative flex-col justify-between overflow-hidden py-10 md:py-14 [container-type:inline-size]',
          shouldSimplifyMotion ? 'hidden' : 'hidden lg:flex lg:min-h-screen',
        )}
      >
        {/* Enormous display name behind & around the portrait with line-reveal swap & zero overflow */}
        <div
          ref={backdropWordRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 justify-center overflow-hidden px-4 select-none"
        >
          <div className="relative flex w-full max-w-full items-center justify-center overflow-hidden py-4">
            {TEAM.map((member, idx) => {
              const isCurrent = idx === activeMemberIdx;
              return (
                <span
                  key={member.id}
                  data-testid={`team-giant-name-${member.id}`}
                  style={{
                    clipPath: isCurrent ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                  }}
                  className={cn(
                    'block max-w-full font-sans text-[clamp(3.25rem,15cqw,16rem)] leading-none font-medium tracking-[-0.05em] whitespace-nowrap text-ink/[0.06] transition-[clip-path] duration-500 ease-out dark:text-ink/[0.08]',
                    idx === 0 ? 'relative' : ' absolute inset-x-0 text-center',
                  )}
                >
                  {member.displayName}
                </span>
              );
            })}
          </div>
        </div>

        {/* Thick Connecting FlowingLine sweeping across the screen on handovers */}
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 -translate-y-1/2">
          <FlowingLine
            weight="section"
            amplitude={sceneState.isHandover ? 34 : 24}
            frequency={0.004}
            speed={0.022}
            reactToPointer
            progress={sceneState.lineProgress}
            className="h-40 md:h-56"
          />
        </div>

        <Container className="relative z-10 flex flex-1 flex-col justify-between gap-8">
          {/* Top Bar: Skip Team link (FIRST focusable element in the section), Dynamic Label, Counter, and Member Rail */}
          <div className="space-y-4 border-b border-line pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* First focusable element: Skip team link */}
              <a
                href={`#${TEAM_STORY_CONTENT.skipTargetId}`}
                data-testid="team-skip-link"
                onClick={handleSkipTeamClick}
                className="text-label-mono link-underline inline-flex items-center gap-1.5 rounded-pill border border-line bg-bg px-3.5 py-1.5 text-ink-muted transition-colors hover:border-line-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <span>{TEAM_STORY_CONTENT.skipLabel}</span>
                <Icon name="arrow_downward" size={20} />
              </a>

              {/* Mono Counter: 01 / 04 */}
              <div
                data-testid="team-counter"
                className="text-label-mono inline-flex items-center gap-2 text-ink"
              >
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <span>{`${currentMember.orderNumber} / ${TEAM_STORY_CONTENT.totalCountFormatted}`}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-1.5">
                <Label data-testid="team-section-label">
                  {`${TEAM_STORY_CONTENT.sectionIndexPrefix} ${currentMember.sectionLabel}`}
                </Label>
                <h2 className="text-display-m text-ink">
                  {`${TEAM_STORY_CONTENT.founderHeadingPrefix} ${currentMember.firstName}`}
                </h2>
              </div>

              {/* Member Rail: 01 ISÉOLUWA · FOUNDER ... 04 JESSICA · MARKETING */}
              <nav
                aria-label={TEAM_STORY_CONTENT.railAriaLabel}
                data-testid="team-rail"
                className="flex flex-wrap items-center gap-4 xl:gap-6"
              >
                {TEAM.map((member, idx) => {
                  const isActive = idx === activeMemberIdx;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      data-testid={`team-rail-item-${member.id}`}
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => handleRailMemberClick(idx)}
                      className={cn(
                        'text-label-mono border-b-2 pb-1.5 text-left transition-colors duration-200',
                        isActive
                          ? 'border-line-accent text-ink'
                          : 'border-transparent text-ink-muted hover:text-ink',
                      )}
                    >
                      {member.railLabel}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Center 3-column asymmetric editorial stage */}
          <div className="my-auto grid grid-cols-12 items-center gap-8">
            {/* Left column (cols 1–3): Member Role, Focus Tags & Quick Facts / Chapter Switcher */}
            <div className="col-span-3 space-y-6">
              {activeMemberIdx === 0 && currentMember.quickFacts ? (
                <dl className="divide-y divide-line border-y border-line">
                  {currentMember.quickFacts.map((fact) => (
                    <div key={fact.label} className="py-3">
                      <dt className="text-label-mono text-ink-muted">{fact.label}</dt>
                      <dd className="mt-1 flex items-center gap-2 font-mono text-xs text-ink">
                        {fact.withStatusDot && (
                          <span
                            aria-hidden="true"
                            className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent"
                          />
                        )}
                        <span>{fact.value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="space-y-4 border-y border-line py-5">
                  <div>
                    <p className="text-label-mono text-ink-muted">ROLE</p>
                    <p className="mt-1 font-sans text-lg font-medium text-ink">
                      {currentMember.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-label-mono text-ink-muted">
                      {TEAM_STORY_CONTENT.focusHeadingLabel}
                    </p>
                    <div className="mt-2">
                      <TagList items={[...currentMember.focus]} />
                    </div>
                  </div>
                </div>
              )}

              {/* Founder chapter pills when Founder is active */}
              {activeMemberIdx === 0 && currentMember.chapters && (
                <div
                  role="tablist"
                  aria-label={TEAM_STORY_CONTENT.chaptersAriaLabel}
                  className="flex flex-wrap items-center gap-2"
                >
                  {currentMember.chapters.map((chapter, idx) => {
                    const isCurrent = idx === activeChapterIdx;
                    return (
                      <button
                        key={chapter.marker}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => {
                          setActiveChapterIdx(idx);
                          track('about_chapter_viewed', {
                            chapter: idx + 1,
                            marker: chapter.marker,
                            label: chapter.label,
                          });
                        }}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 font-mono text-xs transition-colors',
                          isCurrent
                            ? 'border-line-accent bg-surface text-ink'
                            : 'border-line text-ink-muted hover:text-ink',
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            isCurrent ? 'bg-accent' : 'bg-line',
                          )}
                        />
                        <span>{chapter.marker}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Center column (cols 4–7): 4:5 Portrait Frame with hard-edged clip-path handover wipes & B&W -> colour */}
            <div className="col-span-5 flex justify-center">
              <div
                ref={portraitWrapRef}
                data-testid="founder-portrait-frame"
                onMouseEnter={() => !isTouch && setCursor('hello', TEAM_STORY_CONTENT.cursorLabel)}
                onMouseLeave={() => !isTouch && resetCursor()}
                className="relative aspect-[4/5] w-full max-w-[390px] overflow-hidden rounded-card border border-line bg-surface"
              >
                {TEAM.map((member, idx) => {
                  const clipPath = sceneState.portraitClipPaths[idx] ?? 'inset(0% 0% 0% 100%)';
                  const filterVal = sceneState.portraitFilters[idx] ?? 'none';
                  const objectPos = `${Math.round(member.portrait.focalPoint.x * 100)}% ${Math.round(member.portrait.focalPoint.y * 100)}%`;

                  return (
                    <div
                      key={member.id}
                      data-testid={`team-portrait-layer-${member.id}`}
                      style={{
                        clipPath,
                        filter: filterVal,
                      }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <Media
                        type={member.portrait.src ? 'image' : 'placeholder'}
                        src={member.portrait.src}
                        alt={member.portrait.alt}
                        label={member.portrait.placeholderLabel}
                        aspectRatio="4/5"
                        priority={idx === 0}
                        loading={idx === 0 ? undefined : shouldPreloadPortraits ? 'eager' : 'lazy'}
                        blurDataURL={member.portrait.blurDataURL}
                        objectPosition={objectPos}
                        sizes="(max-width: 768px) 90vw, 390px"
                        className="h-full w-full rounded-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column (cols 8–12): Editorial Bio, Focus Tags, Chapters (Founder) & Work With CTA */}
            <div className="col-span-4">
              <div className="relative">
                {TEAM.map((member, idx) => {
                  const isActive = idx === activeMemberIdx;
                  if (!isActive) return null;

                  const configuredLinks = getConfiguredMemberLinks(member.links);
                  const isBeat2 = sceneState.beat2Revealed[idx] ?? true;

                  return (
                    <div
                      key={member.id}
                      data-testid={`team-desktop-panel-${member.id}`}
                      style={{
                        clipPath: 'inset(0% 0% 0% 0%)',
                      }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <p className="text-label-mono text-accent">
                          {`${member.orderNumber} · ${member.sectionLabel}`}
                        </p>
                        <h3 className="font-sans text-2xl font-medium text-ink">{member.name}</h3>
                        <p className="text-heading-m text-ink-muted">{member.role}</p>
                      </div>

                      {/* Founder shows the 4 chapters; other members show their editorial bio paragraphs */}
                      {member.chapters ? (
                        <div className="space-y-3">
                          {member.chapters.map((chapter, cIdx) => {
                            const isCurrentChap = cIdx === activeChapterIdx;
                            return (
                              <article
                                key={chapter.marker}
                                onClick={() => setActiveChapterIdx(cIdx)}
                                className={cn(
                                  'cursor-pointer rounded-card border p-4 transition-colors duration-200',
                                  isCurrentChap
                                    ? 'border-line-accent bg-surface'
                                    : 'border-line bg-bg hover:border-line-accent/60',
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-label-mono text-accent">
                                    {chapter.marker}
                                  </span>
                                  <h4 className="font-sans text-base font-medium text-ink">
                                    {chapter.label}
                                  </h4>
                                </div>
                                <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                                  {chapter.text}
                                </p>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {member.bio.map((paragraph, pIdx) => (
                            <p key={pIdx} className="text-body-l text-ink">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Beat 2: Focus tags + Work with [first name] CTA + personal links (mask reveal, zero blur/fade) */}
                      <div
                        data-testid={`team-beat2-${member.id}`}
                        style={{
                          clipPath: isBeat2 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                        }}
                        className="space-y-5 border-t border-line pt-5 transition-[clip-path] duration-300 ease-out"
                      >
                        <TagList items={[...member.focus]} />

                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            href={member.ctaHref}
                            variant="primary"
                            icon="arrow_outward"
                            onClick={() => track('team_cta_clicked', { id: member.id })}
                          >
                            {member.ctaLabel}
                          </Button>

                          {configuredLinks.map((linkItem) => (
                            <a
                              key={linkItem.key}
                              href={linkItem.href}
                              target={linkItem.key === 'email' ? undefined : '_blank'}
                              rel={linkItem.key === 'email' ? undefined : 'noopener noreferrer'}
                              onClick={() =>
                                track('team_link_clicked', {
                                  id: member.id,
                                  network: linkItem.key,
                                })
                              }
                              className="text-label-mono link-underline inline-flex items-center gap-1.5 px-2 py-2 text-ink-muted hover:text-ink"
                            >
                              <span>{linkItem.label}</span>
                              <Icon name="arrow_outward" size={20} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ==================================================================== */}
      {/* STACKED LAYOUT (Mobile, Reduced Motion, and SSR HTML for all 4)      */}
      {/* ==================================================================== */}
      <div
        data-testid="team-stacked-layout"
        className={cn(
          'py-[var(--section-pad-y)] [container-type:inline-size]',
          shouldSimplifyMotion ? 'block' : 'block lg:hidden',
        )}
      >
        {/* Top Skip Link + FlowingLine once at top of stacked team section */}
        <Container className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <a
              href={`#${TEAM_STORY_CONTENT.skipTargetId}`}
              onClick={handleSkipTeamClick}
              className="text-label-mono link-underline inline-flex items-center gap-1.5 rounded-pill border border-line bg-bg px-3.5 py-1.5 text-ink-muted hover:text-ink"
            >
              <span>{TEAM_STORY_CONTENT.skipLabel}</span>
              <Icon name="arrow_downward" size={20} />
            </a>

            <span className="text-label-mono text-ink">
              {`${currentMember.orderNumber} / ${TEAM_STORY_CONTENT.totalCountFormatted}`}
            </span>
          </div>

          {/* In-page Member Rail list of links */}
          <nav
            aria-label={`${TEAM_STORY_CONTENT.railAriaLabel} (in-page)`}
            className="flex flex-wrap items-center gap-4 border-b border-line pb-5"
          >
            {TEAM.map((member, idx) => {
              const isActive = idx === activeMemberIdx;
              return (
                <a
                  key={member.id}
                  href={`#team-member-${member.id}`}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRailMemberClick(idx);
                  }}
                  className={cn(
                    'text-label-mono border-b-2 pb-1 transition-colors',
                    isActive
                      ? 'border-line-accent text-ink'
                      : 'border-transparent text-ink-muted hover:text-ink',
                  )}
                >
                  {member.railLabel}
                </a>
              );
            })}
          </nav>
        </Container>

        {/* Single thick FlowingLine at the top of the stacked team section */}
        <div className="my-8">
          <FlowingLine
            weight="section"
            amplitude={20}
            frequency={0.004}
            speed={0.02}
            progress={1}
            className="h-28 md:h-36"
          />
        </div>

        {/* All 4 Team Members in order (always present in server-rendered HTML) */}
        <Container className="space-y-20">
          {TEAM.map((member, idx) => {
            const configuredLinks = getConfiguredMemberLinks(member.links);
            const objectPos = `${Math.round(member.portrait.focalPoint.x * 100)}% ${Math.round(member.portrait.focalPoint.y * 100)}%`;

            return (
              <article
                key={member.id}
                id={`team-member-${member.id}`}
                data-testid={`team-member-card-${member.id}`}
                className="relative grid grid-cols-1 gap-8 border-t border-line pt-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:items-start"
              >
                {/* Portrait + Giant Display Name */}
                <div className="relative overflow-hidden md:col-span-5 [container-type:inline-size]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none mb-3 overflow-hidden select-none"
                  >
                    <span
                      data-testid={`team-stacked-giant-name-${member.id}`}
                      className="block max-w-full font-sans text-[clamp(2.5rem,17cqw,6rem)] leading-none font-medium tracking-[-0.05em] whitespace-nowrap text-ink/[0.08]"
                    >
                      {member.displayName}
                    </span>
                  </div>

                  <div className="mx-auto max-w-[380px] md:mx-0">
                    <Media
                      type={member.portrait.src ? 'image' : 'placeholder'}
                      src={member.portrait.src}
                      alt={member.portrait.alt}
                      label={member.portrait.placeholderLabel}
                      aspectRatio="4/5"
                      priority={idx === 0}
                      blurDataURL={member.portrait.blurDataURL}
                      objectPosition={objectPos}
                      sizes="(max-width: 768px) 90vw, 380px"
                    />
                  </div>
                </div>

                {/* Member Details: Label, Name, Role, Bio, Chapters (Founder), Focus Tags, Links, CTA */}
                <div className="space-y-6 md:col-span-7">
                  <div className="space-y-2">
                    <Label>{`${TEAM_STORY_CONTENT.sectionIndexPrefix} ${member.sectionLabel}`}</Label>
                    {idx === 0 && (
                      <p className="text-label-mono text-ink-muted">{founderSection.heading}</p>
                    )}
                    <h3 className="text-display-m text-ink">{member.name}</h3>
                    <p className="text-heading-m text-ink-muted">{member.role}</p>
                  </div>

                  <div className="space-y-4">
                    {member.bio.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-body-l text-ink">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Founder's 4 chapters in stacked order */}
                  {member.chapters && (
                    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                      {member.chapters.map((chapter) => (
                        <article
                          key={chapter.marker}
                          data-testid={`founder-chapter-${chapter.marker}`}
                          className="rounded-card border border-line bg-surface p-5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-label-mono text-accent">{chapter.marker}</span>
                            <h4 className="font-sans text-lg font-medium text-ink">
                              {chapter.label}
                            </h4>
                          </div>
                          <p className="text-body-m mt-3 text-ink-muted">{chapter.text}</p>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* Focus tags */}
                  <div className="border-t border-line pt-4">
                    <TagList items={[...member.focus]} />
                  </div>

                  {/* Work with [first name] CTA & optional personal links */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      href={member.ctaHref}
                      variant="primary"
                      icon="arrow_outward"
                      onClick={() => track('team_cta_clicked', { id: member.id })}
                    >
                      {member.ctaLabel}
                    </Button>

                    {configuredLinks.map((linkItem) => (
                      <a
                        key={linkItem.key}
                        href={linkItem.href}
                        target={linkItem.key === 'email' ? undefined : '_blank'}
                        rel={linkItem.key === 'email' ? undefined : 'noopener noreferrer'}
                        onClick={() =>
                          track('team_link_clicked', {
                            id: member.id,
                            network: linkItem.key,
                          })
                        }
                        className="text-label-mono link-underline inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
                      >
                        <span>{linkItem.label}</span>
                        <Icon name="arrow_outward" size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
      </div>

      {/* ==================================================================== */}
      {/* FOUNDER'S NOTE (Pull Quote in Aeonik Light)                          */}
      {/* ==================================================================== */}
      <div className="border-t border-line py-[var(--section-pad-y)]">
        <Container>
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <blockquote className="font-sans text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.15] font-light tracking-[-0.02em] text-ink">
                {founderSection.pullQuote.quote}
              </blockquote>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-line lg:pl-8">
              <p className="text-label-mono text-ink">{founderSection.pullQuote.authorName}</p>
              <p className="text-label-mono mt-1.5 text-ink-muted">
                {founderSection.pullQuote.authorTitle}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ==================================================================== */}
      {/* REACH ME DIRECTLY BLOCK                                              */}
      {/* ==================================================================== */}
      <div
        id="reach-founder"
        data-testid="reach-me-block"
        className="border-t border-line bg-surface py-[var(--section-pad-y)]"
      >
        <Container className="space-y-10">
          <div className="space-y-4">
            <SplitReveal as="h3" className="text-display-m text-ink">
              {founderSection.reachMe.headline}
            </SplitReveal>
            <p className="text-label-mono text-ink-muted">{founderSection.reachMe.reassurance}</p>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary button: View my portfolio (external, new tab) */}
            <a
              href={founderSection.reachMe.portfolioCta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="founder-portfolio-link"
              onClick={() =>
                track('about_portfolio_clicked', {
                  href: founderSection.reachMe.portfolioCta.href,
                })
              }
              className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-ink bg-ink px-6 py-3.5 text-bg transition-transform duration-200 hover:scale-[1.02]"
            >
              <span>{founderSection.reachMe.portfolioCta.label}</span>
              <Icon name="arrow_outward" size={20} />
            </a>

            {/* Secondary button: Email me (mailto) */}
            <a
              href={`mailto:${founderSection.reachMe.emailCta.email}`}
              data-testid="founder-email-link"
              onClick={() =>
                track('about_email_clicked', { email: founderSection.reachMe.emailCta.email })
              }
              className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-line bg-bg px-6 py-3.5 text-ink transition-colors hover:border-ink"
            >
              <Icon name="mail" size={20} />
              <span>{founderSection.reachMe.emailCta.label}</span>
            </a>

            {/* Copy-to-clipboard button for founder email */}
            <button
              type="button"
              data-testid="founder-copy-email"
              onClick={handleCopyEmail}
              aria-label={founderSection.reachMe.emailCta.copyLabel}
              className="text-label-mono inline-flex items-center gap-2 rounded-pill border border-line bg-bg px-4 py-3.5 text-ink transition-colors hover:border-line-accent"
            >
              <Icon name={copiedEmail ? 'check' : 'content_copy'} size={20} />
              <span aria-live="polite">
                {copiedEmail
                  ? founderSection.reachMe.emailCta.copiedLabel
                  : founderSection.reachMe.emailCta.copyLabel}
              </span>
            </button>

            {/* Secondary button: Message on WhatsApp */}
            <a
              href={founderSection.reachMe.whatsappCta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="founder-whatsapp-link"
              onClick={() =>
                track('about_whatsapp_clicked', {
                  href: founderSection.reachMe.whatsappCta.href,
                })
              }
              className="text-btn inline-flex items-center justify-center gap-2.5 rounded-pill border border-line bg-bg px-6 py-3.5 text-ink transition-colors hover:border-ink"
            >
              <Icon name="whatsapp" size={20} />
              <span>{founderSection.reachMe.whatsappCta.label}</span>
            </a>

            {/* Secondary button: Book a call with me */}
            <Button
              href={founderSection.reachMe.bookingCta.href}
              variant="secondary"
              icon="arrow_outward"
              onClick={() =>
                track('about_booking_clicked', {
                  href: founderSection.reachMe.bookingCta.href,
                })
              }
            >
              {founderSection.reachMe.bookingCta.label}
            </Button>
          </div>

          {/* Row of mono social links (only configured socials render) */}
          {getActiveSocials(founder.socials).length > 0 && (
            <div className="flex flex-wrap items-center gap-6 border-t border-line pt-6">
              {getActiveSocials(founder.socials).map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('about_social_clicked', { network: social.label })}
                  className="text-label-mono link-underline inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
                >
                  <span>
                    {social.label} ({social.handle})
                  </span>
                  <Icon name="arrow_outward" size={20} />
                </a>
              ))}
            </div>
          )}
        </Container>
      </div>
    </section>
  );
}

export const MeetFounder = TeamStory;
