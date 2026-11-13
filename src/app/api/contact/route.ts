import { NextResponse } from 'next/server';
import { saveLead, sendContactEmails } from '@/lib/email/contact-emails';
import { checkRateLimit } from '@/lib/rate-limit';
import { contactRequestSchema, evaluateBudgetFit } from '@/lib/schemas/contact';

const MIN_SUBMIT_TIME_MS = 2500;

function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const ip = extractClientIp(request);
    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests from this network. Please wait a bit or email us directly.',
        },
        { status: 429 },
      );
    }

    const rawBody: unknown = await request.json();

    // Silent anti-spam honeypot check before schema validation
    if (
      typeof rawBody === 'object' &&
      rawBody !== null &&
      'honeypot' in rawBody &&
      typeof (rawBody as { honeypot?: unknown }).honeypot === 'string' &&
      ((rawBody as { honeypot: string }).honeypot ?? '').trim().length > 0
    ) {
      return NextResponse.json({ ok: true });
    }

    const parsed = contactRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Please check all required fields and try again.',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Minimum time-to-submit check (~2.5-3 seconds)
    if (Date.now() - data.startedAtMs < MIN_SUBMIT_TIME_MS) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Submission was too fast. Please review your request and try again.',
        },
        { status: 400 },
      );
    }

    const budgetFit = evaluateBudgetFit({
      budgetRange: data.budgetRange,
      budgetAdvise: data.budgetAdvise,
      servicesNeeded: data.servicesNeeded,
      packageInterest: data.packageInterest,
    });

    await saveLead(data);
    await sendContactEmails(data, budgetFit);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/contact] Failed to process contact submission:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'We could not send your request right now. Please try again or reach us directly.',
      },
      { status: 500 },
    );
  }
}
