'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Icon } from '@/components/ui/Icon';
import { SITE_CONTENT } from '@/content/site';
import { track } from '@/lib/analytics';
import { CONTACT_CONTENT } from '../contact.content';

export function ContactInfoColumn() {
  const [copied, setCopied] = useState(false);
  const content = CONTACT_CONTENT.leftColumn;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.emailAddress);
      setCopied(true);
      track('contact_email_copied', { email: content.emailAddress });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${content.emailAddress}`;
    }
  };

  return (
    <aside
      aria-label="Direct contact options and FAQs"
      className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start"
    >
      {/* 1. Prefer to talk? */}
      <div className="border-b border-line pb-8">
        <h2 className="text-heading-l text-ink">{content.preferToTalkHeading}</h2>
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={content.bookCallCta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('contact_booking_clicked', { location: 'contact_left_column' })}
            className="inline-flex min-h-12 items-center justify-between rounded-pill border border-ink bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-ink-muted"
          >
            <span>{content.bookCallCta.label}</span>
            <Icon name="call" size={20} />
          </a>
          <a
            href={content.whatsappCta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('contact_whatsapp_clicked', { location: 'contact_left_column' })}
            className="inline-flex min-h-12 items-center justify-between rounded-pill border border-line bg-bg px-6 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink"
          >
            <span>{content.whatsappCta.label}</span>
            <Icon name="whatsapp" size={20} />
          </a>
        </div>
      </div>

      {/* 2. Email (click to copy) */}
      <div className="border-b border-line pb-8">
        <p className="text-label-mono text-ink-muted">{content.emailLabel}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`mailto:${content.emailAddress}`}
            className="font-sans text-xl font-medium tracking-tight text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            {content.emailAddress}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            data-testid="copy-email-button"
            className="inline-flex items-center gap-2 rounded-pill border border-line px-3.5 py-1.5 font-mono text-xs tracking-wider text-ink uppercase transition-colors hover:border-ink"
          >
            <Icon name={copied ? 'check' : 'content_copy'} size={20} />
            <span>{copied ? content.copiedLabel : content.copyLabel}</span>
          </button>
        </div>
      </div>

      {/* 3. Reply time & Working hours */}
      <div className="border-b border-line pb-8">
        <p className="text-label-mono text-ink-muted">{content.replyTimeLabel}</p>
        <p className="mt-2 text-base font-medium text-ink">{content.replyTimeText}</p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-ink-muted">
          {content.workingHoursMono}
        </p>
      </div>

      {/* 4. What happens next */}
      <div className="border-b border-line pb-8">
        <h3 className="text-label-mono text-ink-muted">{content.whatHappensNextHeading}</h3>
        <ol className="mt-4 space-y-4">
          {content.whatHappensNextSteps.map((step) => (
            <li key={step.number} className="flex items-baseline gap-4">
              <span className="font-mono text-xs tracking-widest text-accent">
                {step.number}
              </span>
              <span className="text-sm text-ink">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 5. Socials */}
      <div className="border-b border-line pb-8">
        <p className="text-label-mono text-ink-muted">{content.socialsLabel}</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {SITE_CONTENT.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-pill border border-line px-3.5 py-1.5 font-mono text-xs tracking-wider text-ink uppercase transition-colors hover:border-ink"
              >
                <span>{social.label}</span>
                <Icon name="arrow_outward" size={20} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. Mini FAQ */}
      <div className="border-b border-line pb-8">
        <h3 className="text-label-mono mb-4 text-ink-muted">{content.miniFaqHeading}</h3>
        <Accordion items={[...content.miniFaqs]} />
        <div className="mt-5">
          <Link
            href={content.seeAllQuestionsCta.href}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-ink uppercase transition-colors hover:text-accent"
          >
            <span>{content.seeAllQuestionsCta.label}</span>
            <Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      </div>

      {/* 7. Privacy line */}
      <p className="font-mono text-xs leading-relaxed text-ink-muted">{content.privacyMonoLine}</p>
    </aside>
  );
}
