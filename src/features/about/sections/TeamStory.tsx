'use client';

import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
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
import type { TeamMember, TeamMemberId } from '@/types/team';

/**
 * Section 3: Meet Iséoluwa & The Team (`src/features/about/sections/TeamStory.tsx`)
 * - Preserves the exact Founder 3-column layout and 4-tile progression design on both desktop and phone.
 * - As the visitor scrolls (or swipes/taps), the active tile steps from `01 The founder` (Iséoluwa) ->
 *   `02 The designer` (Daniel) -> `03 The developer` (Maleek) -> `04 The marketer` (Jessica).
 * - The heading ("Meet Iséoluwa" -> "Meet Daniel" -> "Meet Maleek" -> "Meet Jessica"),
 *   enormous backdrop wordmark ("iséoluwa" -> "Daniel" -> "Maleek" -> "Jessica"),
 *   Quick Facts, and 4:5 portrait image switch dynamically in place without any swipe/wipe animation.
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
  const touchStartXRef = useRef<number | null>(null);

  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0.25);
  const [shouldPreloadPortraits, setShouldPreloadPortraits] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const viewedMembersRef = useRef<Set<TeamMemberId>>(new Set());
  const lastTrackedIdxRef = useRef<number>(-1);

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

  // Preload all team portraits when the section is within ~1 viewport of entering
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

  // Pinned scroll-driven 4-tile sequence on BOTH desktop and phone (disabled only when prefers-reduced-motion is active)
  useGSAP(
    () => {
      if (shouldSimplifyMotion || !pinStageRef.current) return;

      const totalMembers = TEAM.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinStageRef.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setChapterProgress(0.22 + p * 0.78);
            const nextIdx = Math.min(
              totalMembers - 1,
              Math.max(0, Math.floor(p * totalMembers)),
            );
            setActiveMemberIdx(nextIdx);

            if (lastTrackedIdxRef.current !== nextIdx) {
              lastTrackedIdxRef.current = nextIdx;
              const member = TEAM[nextIdx];
              if (member) {
                track('about_chapter_viewed', {
                  chapter: nextIdx + 1,
                  marker: member.orderNumber,
                  label: member.tileLabel,
                });
              }
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;

      return () => {
        scrollTriggerRef.current = null;
      };
    },
    { scope: pinStageRef, dependencies: [shouldSimplifyMotion] },
  );

  // Select a member tile or rail pill and smoothly sync scroll position
  const handleSelectMember = (idx: number, fromRail = false) => {
    const clampedIdx = Math.max(0, Math.min(TEAM.length - 1, idx));
    const member = TEAM[clampedIdx];
    if (!member) return;

    if (fromRail) {
      track('team_rail_clicked', { id: member.id });
    }

    setActiveMemberIdx(clampedIdx);
    const targetProgress = (clampedIdx + 0.2) / TEAM.length;
    setChapterProgress(0.22 + targetProgress * 0.78);

    track('about_chapter_viewed', {
      chapter: clampedIdx + 1,
      marker: member.orderNumber,
      label: member.tileLabel,
    });

    const st = scrollTriggerRef.current;
    if (!shouldSimplifyMotion && st && typeof window !== 'undefined') {
      const targetY = Math.round(st.start + (st.end - st.start) * targetProgress);
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.75 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  // Touch swipe on mobile/tablet to step forward/backward through the 4 team members
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) {
      touchStartXRef.current = touch.clientX;
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 42) {
      if (deltaX < 0 && activeMemberIdx < TEAM.length - 1) {
        handleSelectMember(activeMemberIdx + 1);
      } else if (deltaX > 0 && activeMemberIdx > 0) {
        handleSelectMember(activeMemberIdx - 1);
      }
    }
  };

  // Subtle pointer parallax for portrait and enormous backdrop wordmark on desktop
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

  // Subtle scale (1 -> 1.03) across scroll while keeping portraits crisp
  const portraitScale = shouldSimplifyMotion
    ? 1
    : 1 + ((chapterProgress - 0.22) / 0.78) * 0.03;

  // Dynamic Quick Facts for the active team member (same 5-row structure as Founder)
  const activeQuickFacts = [
    { label: 'ROLE', value: currentMember.role, withStatusDot: false },
    { label: 'FOCUS', value: currentMember.focusSummary, withStatusDot: false },
    { label: 'BASED', value: SITE_CONTENT.founder.base, withStatusDot: false },
    { label: 'WORKS ACROSS', value: 'Africa, Europe, the Americas', withStatusDot: false },
    { label: 'STATUS', value: SITE_CONTENT.statusText, withStatusDot: true },
  ];

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

      {/* Pinned 4-tile stage (works identically on desktop and phone) */}
      <div
        ref={pinStageRef}
        data-testid="team-pinned-stage"
        onMouseMove={handleStageMouseMove}
        onMouseEnter={() => !isTouch && setCursor('hello', founderSection.cursorLabel)}
        onMouseLeave={handleStageMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex min-h-screen flex-col justify-between overflow-hidden py-4 md:py-12 lg:py-16 [container-type:inline-size]"
      >
        {/* Enormous backdrop wordmark behind and around the portrait ("iséoluwa" -> "Daniel" -> "Maleek" -> "Jessica") */}
        <div
          ref={backdropWordRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex w-full max-w-full -translate-x-1/2 -translate-y-1/2 justify-center overflow-hidden px-4 select-none"
        >
          <span
            data-testid={`team-giant-name-${currentMember.id}`}
            className="block max-w-full font-sans text-[clamp(3.25rem,15cqw,18rem)] leading-none font-medium tracking-[-0.05em] whitespace-nowrap text-ink/[0.06] transition-all duration-300 dark:text-ink/[0.08]"
          >
            {currentMember.displayName}
          </span>
        </div>

        {/* Thick Connecting FlowingLine threading across the stage behind the portrait & tiles */}
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 -translate-y-1/2">
          <FlowingLine
            weight="section"
            amplitude={24}
            frequency={0.004}
            speed={0.022}
            reactToPointer
            progress={shouldSimplifyMotion ? 1 : chapterProgress}
            className="h-28 md:h-56"
          />
        </div>

        <Container className="relative z-10 flex flex-1 flex-col justify-between gap-3 md:gap-8 lg:gap-10">
          {/* Header row: 02 / FOUNDER + Meet Iséoluwa (updates dynamically to Meet Daniel, Meet Maleek, Meet Jessica) */}
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2.5 md:gap-6 md:pb-5">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-3">
                <Label data-testid="team-section-label">
                  {`${TEAM_STORY_CONTENT.sectionIndexPrefix} ${currentMember.sectionLabel}`}
                </Label>
                <span
                  data-testid="team-counter"
                  className="text-label-mono text-ink-muted"
                >
                  {`${currentMember.orderNumber} / ${TEAM_STORY_CONTENT.totalCountFormatted}`}
                </span>
              </div>
              <h2 className="text-display-m text-ink">
                {`${TEAM_STORY_CONTENT.founderHeadingPrefix} ${currentMember.firstName}`}
              </h2>
            </div>

            {/* 4-Member Pills Rail (01 The founder — 02 The designer — 03 The developer — 04 The marketer) */}
            <div
              role="tablist"
              aria-label={TEAM_STORY_CONTENT.railAriaLabel}
              data-testid="team-rail"
              className="flex flex-wrap items-center gap-1.5 md:gap-3"
            >
              {TEAM.map((member, idx) => {
                const isCurrent = idx === activeMemberIdx;
                const isReached = idx <= activeMemberIdx;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    data-testid={`team-rail-item-${member.id}`}
                    aria-selected={isCurrent}
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => handleSelectMember(idx, true)}
                    className={cn(
                      'group flex items-center gap-1.5 rounded-pill border px-2.5 py-1 font-mono text-xs transition-all duration-300 md:gap-2 md:px-3 md:py-1.5',
                      isCurrent
                        ? 'border-line-accent bg-surface text-ink'
                        : isReached
                          ? 'border-line text-ink hover:border-line-accent'
                          : 'border-line text-ink-muted hover:text-ink',
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full transition-colors',
                        isReached ? 'bg-accent' : 'bg-line',
                      )}
                    />
                    <span>{member.orderNumber}</span>
                    <span className="hidden sm:inline">{member.tileLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center 3-column editorial stage: Quick Facts (Left) | 4:5 Portrait (Center) | 4 Team Tiles (Right) */}
          <div className="my-auto grid grid-cols-1 items-center gap-3 md:gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left column: Quick Facts in Mono (updates dynamically per member) */}
            <div className="order-3 hidden lg:order-1 lg:col-span-3 lg:block">
              <dl className="divide-y divide-line border-y border-line">
                {activeQuickFacts.map((fact) => (
                  <div key={fact.label} className="py-3.5">
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
            </div>

            {/* Center column: Single 4:5 Portrait Slot (switches dynamically in place as you scroll/tap) */}
            <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
              <div
                ref={portraitWrapRef}
                data-testid="founder-portrait-frame"
                className="relative aspect-[4/5] w-full max-w-[175px] overflow-hidden rounded-card border border-line bg-surface sm:max-w-[240px] lg:max-w-[380px]"
              >
                <div
                  style={{
                    transform: `scale(${portraitScale.toFixed(4)})`,
                  }}
                  className="relative h-full w-full transition-transform duration-300"
                >
                  {TEAM.map((member, idx) => {
                    const isCurrent = idx === activeMemberIdx;
                    const objectPos = `${Math.round(member.portrait.focalPoint.x * 100)}% ${Math.round(member.portrait.focalPoint.y * 100)}%`;

                    return (
                      <div
                        key={member.id}
                        data-testid={`team-portrait-layer-${member.id}`}
                        className={cn(
                          'absolute inset-0 h-full w-full transition-opacity duration-300 ease-out',
                          isCurrent
                            ? 'z-10 opacity-100'
                            : 'pointer-events-none z-0 opacity-0',
                        )}
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
                          sizes="(max-width: 768px) 240px, 380px"
                          className="h-full w-full rounded-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column: The 4 Team Tiles (01 The founder -> 02 The designer -> 03 The developer -> 04 The marketer) */}
            <div className="order-2 lg:order-3 lg:col-span-4">
              <div className="space-y-1.5 md:space-y-3 lg:space-y-4">
                {TEAM.map((member, idx) => {
                  const isActive = idx === activeMemberIdx;
                  return (
                    <article
                      key={member.id}
                      id={`team-member-${member.id}`}
                      data-testid={`team-member-card-${member.id}`}
                      onClick={() => handleSelectMember(idx)}
                      className={cn(
                        'cursor-pointer rounded-card border px-3 py-2 transition-all duration-300 md:p-4 lg:p-5',
                        shouldSimplifyMotion
                          ? 'border-line bg-surface opacity-100'
                          : isActive
                            ? 'border-line-accent bg-surface opacity-100'
                            : 'border-line/60 bg-bg/80 opacity-55 hover:opacity-85',
                      )}
                    >
                      <div
                        data-testid={`founder-chapter-${member.orderNumber}`}
                        className="flex flex-wrap items-baseline justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-label-mono text-accent">{member.orderNumber}</span>
                          <h3 className="font-sans text-sm font-medium text-ink md:text-base lg:text-lg">
                            {member.tileLabel}
                          </h3>
                        </div>
                        <span className="font-mono text-[11px] text-ink-muted md:text-xs">
                          {`${member.name} · ${member.role}`}
                        </span>
                      </div>

                      <p
                        className={cn(
                          'mt-1.5 font-sans text-xs leading-snug text-ink-muted md:mt-2.5 md:text-sm lg:leading-relaxed',
                          shouldSimplifyMotion || isActive ? 'block' : 'hidden lg:block',
                        )}
                      >
                        {member.tileSummary}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Founder's Note (Pull Quote in Aeonik Light) */}
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

      {/* Reach Me Directly Block */}
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
