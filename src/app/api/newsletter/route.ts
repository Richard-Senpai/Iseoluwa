import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterPayloadSchema = z.object({
  email: z.string().email(),
  honeypot: z.string().max(0).optional(),
});

/**
 * Newsletter signup handler (Home Prompt Section 4.12):
 * Validates email with Zod, checks the honeypot field, and returns success.
 * TODO (Phase 3 / Launch): Connect Resend audience or email delivery using `RESEND_API_KEY`.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = newsletterPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address' },
        { status: 400 },
      );
    }

    // Silently accept if honeypot was triggered without subscribing bot
    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // TODO: Connect Resend Contacts API (`resend.contacts.create({ email: parsed.data.email })`)
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Bad request' },
      { status: 400 },
    );
  }
}
