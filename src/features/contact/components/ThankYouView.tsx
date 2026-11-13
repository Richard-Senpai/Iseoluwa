'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { FlowingLine } from '@/components/motion/FlowingLine';
import { SurfaceTransition } from '@/components/motion/SurfaceTransition';
import { Icon } from '@/components/ui/Icon';
import { track } from '@/lib/analytics';
import { CONTACT_CONTENT } from '../contact.content';
import { THANK_YOU_FLAG_KEY } from './ProjectRequestForm';

export function ThankYouView() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [rippleCount, setRippleCount] = useState(0);
  const { thankYou, leftColumn } = CONTACT_CONTENT;

  useEffect(() => {
    try {
      const submitted = window.sessionStorage.getItem(THANK_YOU_FLAG_KEY);
      if (submitted !== '1') {
        router.replace('/contact');
        return;
      }
      setAuthorized(true);
      const timer = window.setTimeout(() => {
        setRippleCount(1);
      }, 200);
      return () => window.clearTimeout(timer);
    } catch {
      router.replace('/contact');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-[60vh] bg-bg py-24">
        <Container>
          <p className="text-label-mono text-ink-muted">Redirecting...</p>
        </Container>
      </div>
    );
  }

  return (
    <SurfaceTransition>
      <section className="relative overflow-hidden bg-bg py-20 text-ink md:py-32">
        {/* Celebratory Thick FlowingLine */}
        <div className="pointer-events-none absolute inset-x-0 top-8 h-56 opacity-90 md:h-72">
          <FlowingLine
            path="loop"
            weight="hero"
            rippleCount={rippleCount}
            reactToPointer
          />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line-accent bg-surface px-4 py-1.5 font-mono text-xs tracking-wider text-ink uppercase">
              <Icon name="check" size={20} className="text-accent" />
              <span>{thankYou.label}</span>
            </span>

            <h1 className="text-display-xl mt-6 text-ink">{thankYou.headline}</h1>
            <p className="text-body-l mt-6 max-w-[54ch] text-ink-muted">{thankYou.body}</p>
          </div>

          {/* 3-Step Timeline */}
          <div className="mt-16 border-y border-line py-12">
            <h2 className="text-label-mono text-ink-muted">{thankYou.timelineHeading}</h2>
            <ol className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {leftColumn.whatHappensNextSteps.map((step) => (
                <li
                  key={step.number}
                  className="rounded-card border border-line bg-surface p-6"
                >
                  <span className="font-mono text-xs tracking-widest text-accent">
                    {step.number}
                  </span>
                  <p className="mt-3 text-base font-medium text-ink">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Next actions */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={thankYou.actions.bookCall.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_booking_clicked', { location: 'thank_you_page' })}
              className="inline-flex min-h-12 items-center gap-3 rounded-pill bg-ink px-7 py-4 text-sm font-medium text-bg transition-colors hover:bg-ink-muted"
            >
              <span>{thankYou.actions.bookCall.label}</span>
              <Icon name="call" size={20} />
            </a>

            <a
              href={thankYou.actions.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_whatsapp_clicked', { location: 'thank_you_page' })}
              className="inline-flex min-h-12 items-center gap-3 rounded-pill border border-line bg-bg px-7 py-4 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              <span>{thankYou.actions.whatsapp.label}</span>
              <Icon name="whatsapp" size={20} />
            </a>

            <Link
              href={thankYou.actions.seeWork.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-pill border border-line px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              <span>{thankYou.actions.seeWork.label}</span>
              <Icon name="arrow_forward" size={20} />
            </Link>

            <Link
              href={thankYou.actions.readFaq.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-pill border border-line px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              <span>{thankYou.actions.readFaq.label}</span>
              <Icon name="arrow_forward" size={20} />
            </Link>
          </div>
        </Container>
      </section>
    </SurfaceTransition>
  );
}
