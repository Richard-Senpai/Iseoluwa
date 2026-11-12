'use client';

import { useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LoopVideo } from '@/components/media/LoopVideo';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { SITE_CONTENT } from '@/content/site';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { useUIStore } from '@/store/ui.store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Section 3: Meet Iséoluwa — The Founder (About Prompt Section B3.3)
 * - Pinned scroll-driven 4-chapter story on desktop; clean stacked sequence on mobile/reduced-motion
 * - Enormous "iséoluwa" name layered behind and around the 4:5 portrait frame with pointer + scroll parallax
 * - Portrait transitions smoothly from black-and-white (`grayscale(100%)`) to full colour (`grayscale(0%)`)
 * - Thick `FlowingLine` threads through the 4 numbered chapter markers (`01` to `04`)
 * - Quick facts in mono beside the portrait
 * - Releases pin into Founder's pull quote in Aeonik Light
 * - Followed by the "Want to reach me directly?" conversion block with portfolio link, email + copy, WhatsApp, booking, and socials
 */
export function MeetFounder() {
  const { founderSection } = ABOUT_CONTENT;
  const { founder } = SITE_CONTENT;
  const { shouldSimplifyMotion, isTouch } = useMotionPreference();

  const setCursor = useUIStore((s) => s.setCursor);
  const resetCursor = useUIStore((s) => s.resetCursor);

  const pinStageRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const backdropWordRef = useRef<HTMLDivElement>(null);

  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0.25);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const lastTrackedChapterRef = useRef<number>(-1);

  // Desktop pinned scroll-driven 4-chapter sequence
  useGSAP(
    () => {
      if (shouldSimplifyMotion || !pinStageRef.current) return;

      const totalChapters = founderSection.chapters.length;

      gsap.timeline({
        scrollTrigger: {
          trigger: pinStageRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // Map progress [0..1] to line draw progress [0.22..1] and chapter index [0..3]
            setChapterProgress(0.22 + p * 0.78);
            const nextIdx = Math.min(
              totalChapters - 1,
              Math.max(0, Math.floor(p * totalChapters)),
            );
            setActiveChapterIdx(nextIdx);

            if (lastTrackedChapterRef.current !== nextIdx) {
              lastTrackedChapterRef.current = nextIdx;
              const chapter = founderSection.chapters[nextIdx];
              if (chapter) {
                track('about_chapter_viewed', {
                  chapter: nextIdx + 1,
                  marker: chapter.marker,
                  label: chapter.label,
                });
              }
            }
          },
        },
      });
    },
    { scope: pinStageRef, dependencies: [shouldSimplifyMotion] },
  );

  // Desktop subtle pointer parallax for portrait and enormous backdrop wordmark
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

  // Grayscale (100% -> 0%) and subtle scale (1 -> 1.04) across the 4 chapters
  const grayscalePercent = shouldSimplifyMotion
    ? 0
    : Math.round(Math.max(0, 100 - ((chapterProgress - 0.22) / 0.78) * 100));
  const portraitScale = shouldSimplifyMotion
    ? 1
    : 1 + ((chapterProgress - 0.22) / 0.78) * 0.04;

  // Optional chapter-specific image (allows up to 3 images across chapter pairs)
  const portraitImages = founderSection.portrait.images;
  const activeImageSrc =
    portraitImages.length > 0
      ? portraitImages[Math.min(portraitImages.length - 1, Math.floor(activeChapterIdx / 2))]
      : undefined;

  return (
    <section id="the-founder" className="relative border-t border-line">
      {/* Pinned 4-chapter stage (Occurrence 2 of 3 of the thick FlowingLine on /about) */}
      <div
        ref={pinStageRef}
        onMouseMove={handleStageMouseMove}
        onMouseEnter={() => !isTouch && setCursor('hello', founderSection.cursorLabel)}
        onMouseLeave={handleStageMouseLeave}
        className="relative flex min-h-screen flex-col justify-between overflow-hidden py-14 md:py-20"
      >
        {/* Enormous "iséoluwa" backdrop wordmark layered behind and around the portrait */}
        <div
          ref={backdropWordRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none"
        >
          <span className="block font-sans text-[clamp(5.5rem,21vw,22rem)] leading-none font-medium tracking-[-0.05em] whitespace-nowrap text-ink/[0.06] dark:text-ink/[0.08]">
            {founderSection.backdropWordmark}
          </span>
        </div>

        {/* Thick Connecting FlowingLine threading across the stage behind the portrait & markers */}
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 -translate-y-1/2">
          <FlowingLine
            weight="section"
            amplitude={24}
            frequency={0.004}
            speed={0.022}
            reactToPointer
            progress={shouldSimplifyMotion ? 1 : chapterProgress}
            className="h-40 md:h-56"
          />
        </div>

        <Container className="relative z-10 flex flex-1 flex-col justify-between gap-10">
          {/* Header row: 02 / THE FOUNDER + Meet Iséoluwa */}
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-5">
            <div className="space-y-2">
              <Label>{founderSection.sectionLabel}</Label>
              <h2 className="text-display-m text-ink">{founderSection.heading}</h2>
            </div>

            {/* Chapter Markers Rail (01 — 02 — 03 — 04) */}
            <div
              role="tablist"
              aria-label="Founder story chapters"
              className="flex items-center gap-3 md:gap-5"
            >
              {founderSection.chapters.map((chapter, idx) => {
                const isCurrent = idx === activeChapterIdx;
                const isReached = idx <= activeChapterIdx;
                return (
                  <button
                    key={chapter.marker}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => {
                      setActiveChapterIdx(idx);
                      setChapterProgress(0.25 + (idx / (founderSection.chapters.length - 1)) * 0.75);
                      track('about_chapter_viewed', {
                        chapter: idx + 1,
                        marker: chapter.marker,
                        label: chapter.label,
                      });
                    }}
                    className={cn(
                      'group flex items-center gap-2 rounded-pill border px-3 py-1.5 font-mono text-xs transition-all duration-300',
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
                    <span>{chapter.marker}</span>
                    <span className="hidden lg:inline">{chapter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center 3-column editorial stage: Quick Facts (Left) | 4:5 Portrait (Center) | Chapters (Right) */}
          <div className="my-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Left column: Quick Facts in Mono */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <dl className="divide-y divide-line border-y border-line">
                {founderSection.quickFacts.map((fact) => (
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

            {/* Center column: Portrait Slot (4:5 aspect ratio, B&W -> full colour transition) */}
            <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
              <div
                ref={portraitWrapRef}
                data-testid="founder-portrait-frame"
                style={{
                  filter: `grayscale(${grayscalePercent}%)`,
                }}
                className="relative aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-card border border-line bg-surface transition-[filter] duration-300"
              >
                <div
                  style={{
                    transform: `scale(${portraitScale.toFixed(4)})`,
                  }}
                  className="relative flex h-full w-full flex-col justify-between p-6 transition-transform duration-300"
                >
                  {founderSection.portrait.videoSrc ? (
                    <LoopVideo
                      src={founderSection.portrait.videoSrc}
                      poster={founderSection.portrait.videoPoster ?? ''}
                      alt={founder.fullName}
                      aspectRatio="4/5"
                      className="h-full w-full"
                    />
                  ) : activeImageSrc ? (
                    <Image
                      src={activeImageSrc}
                      alt={founder.fullName}
                      fill
                      sizes="(max-width: 768px) 90vw, 380px"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      {/* Top mono frame metadata */}
                      <div className="flex items-center justify-between border-b border-line pb-3">
                        <span className="text-label-mono text-ink-muted">
                          {founderSection.portrait.placeholderLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          <span>{`CH.${founderSection.chapters[activeChapterIdx]?.marker ?? '01'}`}</span>
                        </span>
                      </div>

                      {/* Architectural editorial monogram + placeholder label */}
                      <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
                        <span className="font-sans text-6xl font-light tracking-tight text-ink/80 md:text-7xl">
                          {founder.displayName}
                        </span>
                        <span className="text-label-mono mt-3 text-ink-muted">
                          {founder.fullName}
                        </span>
                        <span className="mt-4 inline-block rounded-pill border border-line-accent/60 px-3 py-1 font-mono text-[11px] text-accent">
                          {founderSection.portrait.placeholderLabel}
                        </span>
                      </div>

                      {/* Bottom frame role bar */}
                      <div className="border-t border-line pt-3 text-center">
                        <span className="text-label-mono text-ink-muted">
                          {founder.roles.join(' · ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Four Chapters (All present in SSR HTML; active highlighted on desktop, stacked on mobile/no-JS) */}
            <div className="order-3 lg:col-span-4">
              <div className="space-y-6">
                {founderSection.chapters.map((chapter, idx) => {
                  const isActive = idx === activeChapterIdx;
                  return (
                    <article
                      key={chapter.marker}
                      data-testid={`founder-chapter-${chapter.marker}`}
                      onClick={() => setActiveChapterIdx(idx)}
                      className={cn(
                        'cursor-pointer rounded-card border p-5 transition-all duration-300',
                        shouldSimplifyMotion
                          ? 'border-line bg-surface opacity-100'
                          : isActive
                            ? 'border-line-accent bg-surface opacity-100'
                            : 'border-line/60 bg-bg/80 opacity-55 hover:opacity-85',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-label-mono text-accent">{chapter.marker}</span>
                        <h3 className="font-sans text-lg font-medium text-ink">{chapter.label}</h3>
                      </div>
                      <p className="text-body-m mt-3 text-ink-muted">{chapter.text}</p>
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
              <Icon name="call" size={20} />
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

          {/* Row of mono social links (LinkedIn, X, GitHub, Instagram) */}
          {founder.socials.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 border-t border-line pt-6">
              {founder.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('about_social_clicked', { network: social.label })}
                  className="text-label-mono link-underline inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
                >
                  <span>{social.label}</span>
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
