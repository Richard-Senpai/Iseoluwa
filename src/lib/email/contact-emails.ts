import { getPackageBySlug } from '@/content/packages';
import { SITE_CONTENT } from '@/content/site';
import { CONTACT_CONTENT, getBudgetRangeById } from '@/features/contact/contact.content';
import type { BudgetFitLevel, ContactFormValues } from '@/types/contact';

export interface BuiltEmail {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
}

export interface BudgetFitSummary {
  level: BudgetFitLevel;
  showGentleNote: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveBudgetDisplay(data: ContactFormValues): string {
  if (data.budgetAdvise || data.budgetRange === 'advise') {
    return 'Not sure yet — requested studio guidance';
  }
  const range = getBudgetRangeById(data.budgetRange);
  if (!range) return 'Not specified';
  return `${range.labels[data.currency]} (${data.currency})`;
}

function formatStudioFitLine(budgetFit: BudgetFitSummary): string {
  switch (budgetFit.level) {
    case 'above':
      return 'Budget fit: At or above typical package minimum';
    case 'near':
      return 'Budget fit: Near typical minimum (may require phased scope)';
    case 'below':
      return 'Budget fit: Below typical package minimum (recommend Custom / phased option)';
    case 'advise':
      return 'Budget fit: Client requested guidance ("Not sure yet. Please advise me.")';
  }
}

/**
 * Persistence stub for future database / CRM integration.
 */
export async function saveLead(data: ContactFormValues): Promise<void> {
  // TODO: Persist validated lead to database or CRM (e.g. Supabase / HubSpot / Notion) when configured.
  void data;
}

export function buildStudioNotificationEmail(
  data: ContactFormValues,
  budgetFit: BudgetFitSummary,
): BuiltEmail {
  const to = process.env.CONTACT_TO_EMAIL || SITE_CONTENT.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || 'Iseoluwa Studio <hello@iseoluwa.com>';
  const pkg = getPackageBySlug(data.packageInterest);
  const packageLabel = pkg ? pkg.name : data.packageInterest;
  const budgetLabel = resolveBudgetDisplay(data);

  const subject = `New project request: ${data.company} — ${packageLabel} (${budgetLabel})`;

  const conditionalRows: string[] = [];
  if (data.brandingNeeds.length) {
    conditionalRows.push(
      `<li><strong>Branding scope:</strong> ${escapeHtml(data.brandingNeeds.join(', '))}</li>`,
    );
  }
  if (data.brandingStartingPoint) {
    conditionalRows.push(
      `<li><strong>Branding starting point:</strong> ${escapeHtml(data.brandingStartingPoint)}</li>`,
    );
  }
  if (data.websiteKind) {
    conditionalRows.push(`<li><strong>Website kind:</strong> ${escapeHtml(data.websiteKind)}</li>`);
  }
  if (data.websiteFeatures.length) {
    conditionalRows.push(
      `<li><strong>Website features:</strong> ${escapeHtml(data.websiteFeatures.join(', '))}</li>`,
    );
  }
  if (data.existingSiteUrl) {
    conditionalRows.push(
      `<li><strong>Existing site URL:</strong> ${escapeHtml(data.existingSiteUrl)}</li>`,
    );
  }
  if (data.marketingChannels.length) {
    conditionalRows.push(
      `<li><strong>Marketing channels:</strong> ${escapeHtml(data.marketingChannels.join(', '))}</li>`,
    );
  }
  if (data.marketingAim) {
    conditionalRows.push(
      `<li><strong>Marketing aim:</strong> ${escapeHtml(data.marketingAim)}</li>`,
    );
  }
  if (data.existingMarketingLinks) {
    conditionalRows.push(
      `<li><strong>Existing marketing links:</strong> ${escapeHtml(data.existingMarketingLinks)}</li>`,
    );
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0a0a0a; line-height: 1.6; max-width: 640px;">
      <p style="font-family: monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #525252;">
        NEW PROJECT REQUEST · ISEOLUWA
      </p>
      <h1 style="font-size: 24px; margin: 8px 0 16px;">${escapeHtml(data.company)} (${escapeHtml(data.fullName)})</h1>
      <p style="padding: 12px 16px; background: #f5f5f3; border-left: 3px solid #15803d; font-size: 14px;">
        <strong>${escapeHtml(formatStudioFitLine(budgetFit))}</strong>
      </p>

      <h2 style="font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px;">01. Client Details</h2>
      <ul style="padding-left: 18px;">
        <li><strong>Name:</strong> ${escapeHtml(data.fullName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>Company:</strong> ${escapeHtml(data.company)}</li>
        <li><strong>Role:</strong> ${escapeHtml(data.role || 'Not provided')}</li>
        <li><strong>Country:</strong> ${escapeHtml(data.country)}</li>
        <li><strong>Phone / WhatsApp:</strong> ${escapeHtml(data.phone || 'Not provided')}</li>
        <li><strong>Preferred Contact:</strong> ${escapeHtml(data.preferredContact)}</li>
      </ul>

      <h2 style="font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px;">02. Project Scope</h2>
      <ul style="padding-left: 18px;">
        <li><strong>Selected Package:</strong> ${escapeHtml(packageLabel)}</li>
        <li><strong>Services Needed:</strong> ${escapeHtml(data.servicesNeeded.join(', '))}</li>
        <li><strong>Main Goal:</strong> ${escapeHtml(data.mainGoal)}</li>
        <li><strong>Existing Materials / Inspiration:</strong> ${escapeHtml(data.existingMaterialsLinks || 'None')}</li>
        ${conditionalRows.join('\n')}
      </ul>
      <p style="white-space: pre-wrap; background: #f5f5f3; padding: 14px; border: 1px solid #e5e5e5;">${escapeHtml(data.projectDescription)}</p>

      <h2 style="font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px;">03. Budget &amp; Timing</h2>
      <ul style="padding-left: 18px;">
        <li><strong>Budget:</strong> ${escapeHtml(budgetLabel)}</li>
        <li><strong>Start Timeline:</strong> ${escapeHtml(data.startTimeline)}</li>
        <li><strong>Target Launch Date:</strong> ${escapeHtml(data.deadlineDate || 'Not specified')}</li>
        <li><strong>Decision Maker:</strong> ${escapeHtml(data.decisionMaker || 'Not specified')}</li>
        <li><strong>Referral Source:</strong> ${escapeHtml(data.heardAboutUs || 'Not specified')}</li>
      </ul>

      <h2 style="font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px;">04. Attribution Metadata</h2>
      <ul style="padding-left: 18px; font-family: monospace; font-size: 12px; color: #525252;">
        <li>source: ${escapeHtml(data.meta.source || 'direct')}</li>
        <li>packageSlug: ${escapeHtml(data.meta.packageSlug || 'none')}</li>
        <li>referrer: ${escapeHtml(data.meta.referrer || 'none')}</li>
        <li>utm_source: ${escapeHtml(data.meta.utm_source || 'none')}</li>
        <li>utm_medium: ${escapeHtml(data.meta.utm_medium || 'none')}</li>
        <li>utm_campaign: ${escapeHtml(data.meta.utm_campaign || 'none')}</li>
      </ul>
    </div>
  `.trim();

  return {
    to,
    from,
    replyTo: data.email,
    subject,
    html,
  };
}

export function buildClientConfirmationEmail(data: ContactFormValues): BuiltEmail {
  const from = process.env.CONTACT_FROM_EMAIL || 'Iseoluwa Studio <hello@iseoluwa.com>';
  const replyTo = process.env.CONTACT_TO_EMAIL || SITE_CONTENT.contact.email;
  const pkg = getPackageBySlug(data.packageInterest);
  const packageLabel = pkg ? pkg.name : data.packageInterest;
  const budgetLabel = resolveBudgetDisplay(data);
  const steps = CONTACT_CONTENT.leftColumn.whatHappensNextSteps;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0a0a0a; line-height: 1.6; max-width: 600px;">
      <p style="font-family: monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #525252;">
        ISEOLUWA STUDIO
      </p>
      <h1 style="font-size: 24px; margin: 8px 0 16px;">We have your project request, ${escapeHtml(data.fullName)}.</h1>
      <p>Thank you for reaching out to Iseoluwa. We have received your request for <strong>${escapeHtml(data.company)}</strong> and will reply within one business day.</p>

      <h2 style="font-size: 15px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.06em; font-family: monospace;">What happens next</h2>
      <ol style="padding-left: 18px;">
        ${steps.map((s) => `<li style="margin-bottom: 8px;">${escapeHtml(s.text)}</li>`).join('')}
      </ol>

      <div style="margin: 24px 0; padding: 16px; background: #f5f5f3; border: 1px solid #e5e5e5;">
        <p style="margin: 0 0 8px;"><strong>Summary of what you sent:</strong></p>
        <p style="margin: 4px 0;"><strong>Package:</strong> ${escapeHtml(packageLabel)}</p>
        <p style="margin: 4px 0;"><strong>Budget:</strong> ${escapeHtml(budgetLabel)}</p>
        <p style="margin: 4px 0;"><strong>Timeline:</strong> ${escapeHtml(data.startTimeline)}</p>
      </div>

      <p>Want to speak sooner? You can <a href="${escapeHtml(SITE_CONTENT.founder.bookingUrl)}" style="color: #15803d; font-weight: 600;">book a free 20-minute call</a>, <a href="${escapeHtml(SITE_CONTENT.contact.whatsapp.href)}" style="color: #15803d; font-weight: 600;">message us on WhatsApp (${escapeHtml(SITE_CONTENT.contact.whatsapp.display)})</a>, or follow us on Instagram at <a href="${escapeHtml(SITE_CONTENT.contact.instagram.href)}" style="color: #15803d; font-weight: 600;">${escapeHtml(SITE_CONTENT.contact.instagram.handle)}</a>.</p>
    </div>
  `.trim();

  return {
    to: data.email,
    from,
    replyTo,
    subject: 'We have your project request — Iseoluwa',
    html,
  };
}

async function sendViaResend(email: BuiltEmail, apiKey: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: email.from,
      to: [email.to],
      reply_to: email.replyTo,
      subject: email.subject,
      html: email.html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

export async function sendContactEmails(
  data: ContactFormValues,
  budgetFit: BudgetFitSummary,
): Promise<void> {
  const studioEmail = buildStudioNotificationEmail(data, budgetFit);
  const clientEmail = buildClientConfirmationEmail(data);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'test') {
      console.info('[contact-emails] RESEND_API_KEY not set; logging emails in dev mode:', {
        studioSubject: studioEmail.subject,
        clientTo: clientEmail.to,
      });
    }
    return;
  }

  await Promise.all([sendViaResend(studioEmail, apiKey), sendViaResend(clientEmail, apiKey)]);
}
