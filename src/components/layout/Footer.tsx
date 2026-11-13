'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Wordmark } from '@/components/layout/Wordmark';
import { SloganBand } from '@/components/layout/SloganBand';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { NAVIGATION_CONTENT } from '@/content/navigation';
import { getActiveSocials, SITE_CONTENT } from '@/content/site';
import { track } from '@/lib/analytics';

const newsletterSchema = z.object({
  email: z.string().email(),
  honeypot: z.string().max(0).optional(),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

/**
 * Global Footer (Home Prompt Section 4.12 & Design System Section 14.1):
 * 1. Newsletter block (`STAY IN TOUCH`, underline email input, Zod validation, posts to `/api/newsletter`).
 * 2. Columns: Navigation, Contact (email, WhatsApp, mono Instagram line), Socials, Working hours.
 * 3. Slogan band.
 * 4. Bottom legal line + Back to top button with `arrow_upward` icon.
 */
export function Footer() {
  const { newsletter, columnHeadings, legalLinks, backToTopLabel, copyrightPrefix } =
    NAVIGATION_CONTENT.footer;

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const { register, handleSubmit, reset } = useForm<NewsletterFormValues>({
    defaultValues: { email: '', honeypot: '' },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    const parsed = newsletterSchema.safeParse(values);
    if (!parsed.success) {
      setStatus('error');
      setFeedback(newsletter.invalidEmailMessage);
      return;
    }

    setStatus('submitting');
    setFeedback('');
    track('newsletter_submit', { status: 'attempt' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      setFeedback(newsletter.successMessage);
      track('newsletter_submit', { status: 'success' });
      reset();
    } catch {
      setStatus('error');
      setFeedback(newsletter.errorMessage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const activeSocials = getActiveSocials(SITE_CONTENT.socials);

  return (
    <footer className="surface-inverse border-t border-line bg-bg text-ink">
      {/* 1. Newsletter & 2. Navigation / Contact Columns */}
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Newsletter block */}
          <div className="space-y-6 lg:col-span-5">
            <p className="text-label-mono text-line-accent">{newsletter.label}</p>
            <p className="text-heading-m text-ink">{newsletter.description}</p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4 pt-2"
              aria-label={newsletter.label}
            >
              {/* Honeypot field hidden from human visitors */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="newsletter-hp">{newsletter.honeypotLabel}</label>
                <input
                  id="newsletter-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {newsletter.placeholder}
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder={newsletter.placeholder}
                    {...register('email')}
                    className="w-full border-0 border-b border-line bg-transparent py-3 text-base text-ink placeholder:text-ink-muted focus:border-line-accent focus:outline-none"
                  />
                </div>
                <button
                  id="newsletter-submit-button"
                  type="submit"
                  disabled={status === 'submitting'}
                  className="text-btn inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill border border-line px-6 text-ink transition-colors duration-200 hover:border-line-accent hover:bg-ink hover:text-bg disabled:opacity-50"
                >
                  <span>
                    {status === 'submitting' ? newsletter.submittingLabel : newsletter.submitLabel}
                  </span>
                  <Icon name="arrow_forward" size={20} />
                </button>
              </div>

              {feedback && (
                <p
                  role={status === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className="text-label-mono flex items-center gap-2 pt-1 text-ink"
                >
                  <Icon name={status === 'error' ? 'close' : 'check'} size={20} />
                  <span>{feedback}</span>
                </p>
              )}
            </form>
          </div>

          {/* Link & Contact Columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-12">
            {/* Navigation column */}
            <div className="space-y-4">
              <p className="text-label-mono text-ink-muted">{columnHeadings.navigation}</p>
              <ul className="space-y-2.5">
                {NAVIGATION_CONTENT.mainLinks.map((link) => (
                  <li key={link.href}>
                    <TransitionLink
                      href={link.href}
                      className="link-underline text-body text-ink"
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Contact & Working Hours */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-label-mono text-ink-muted">{columnHeadings.contact}</p>
                <ul className="space-y-2.5">
                  <li>
                    <a
                      href={`mailto:${SITE_CONTENT.contact.email}`}
                      className="link-underline text-body text-ink"
                    >
                      {SITE_CONTENT.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={SITE_CONTENT.contact.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('whatsapp_click', { location: 'footer' })}
                      className="link-underline font-mono text-xs text-ink"
                    >
                      WhatsApp: {SITE_CONTENT.contact.whatsapp.display}
                    </a>
                  </li>
                  <li>
                    <a
                      href={SITE_CONTENT.contact.instagram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-mono text-xs text-ink"
                    >
                      Instagram: {SITE_CONTENT.contact.instagram.handle}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-label-mono text-ink-muted">{columnHeadings.hours}</p>
                <p className="text-label-mono text-ink">{SITE_CONTENT.contact.workingHours}</p>
              </div>
            </div>

            {/* Social column */}
            <div className="space-y-4">
              <p className="text-label-mono text-ink-muted">{columnHeadings.social}</p>
              <ul className="space-y-2.5">
                {activeSocials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-body text-ink"
                    >
                      <Icon name={social.id} size={20} />
                      <span>{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. Slogan band */}
      <SloganBand />

      {/* 4. Bottom legal bar */}
      <div className="border-t border-line bg-bg py-8">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-6">
            <Wordmark className="text-ink" />
            <span className="text-label-mono text-ink-muted">
              {copyrightPrefix} {currentYear} {SITE_CONTENT.displayName}
            </span>
            {legalLinks.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="text-label-mono link-underline text-ink-muted hover:text-ink"
              >
                {item.label}
              </TransitionLink>
            ))}
          </div>

          <button
            id="footer-back-to-top"
            type="button"
            onClick={scrollToTop}
            className="text-label-mono inline-flex items-center gap-2 text-ink transition-colors duration-200 hover:text-line-accent"
          >
            <span>{backToTopLabel}</span>
            <Icon name="arrow_upward" size={20} />
          </button>
        </Container>
      </div>
    </footer>
  );
}
