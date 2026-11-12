export type AnalyticsEventName =
  | 'start_project_click'
  | 'book_call_click'
  | 'whatsapp_click'
  | 'currency_switch'
  | 'matcher_result_shown'
  | 'matcher_button_click'
  | 'newsletter_submit'
  | 'email_copied'
  | 'faq_opened';

export type AnalyticsEventProps = Record<string, string | number | boolean | undefined>;

/**
 * Typed analytics dispatcher ready for Vercel Analytics / PostHog integration.
 * No-op in Phase 1 & 2 per specification.
 */
export function track(eventName: AnalyticsEventName, props?: AnalyticsEventProps): void {
  if (process.env.NODE_ENV === 'development') {
    // Kept silent in production; available for inspection or test spies
    void eventName;
    void props;
  }
}
