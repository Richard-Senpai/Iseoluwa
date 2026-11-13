export type AnalyticsEventName =
  | 'start_project_click'
  | 'book_call_click'
  | 'whatsapp_click'
  | 'currency_switch'
  | 'matcher_result_shown'
  | 'matcher_button_click'
  | 'newsletter_submit'
  | 'email_copied'
  | 'faq_opened'
  | 'work_panel_changed'
  | 'work_category_entered'
  | 'work_index_opened'
  | 'work_project_opened'
  | 'work_next_category_clicked'
  | 'work_next_project_clicked'
  | 'work_cta_clicked'
  | 'about_portfolio_clicked'
  | 'about_email_clicked'
  | 'about_email_copied'
  | 'about_whatsapp_clicked'
  | 'about_booking_clicked'
  | 'about_social_clicked'
  | 'about_chapter_viewed'
  | 'about_cta_clicked'
  | 'contact_form_started'
  | 'contact_step_completed'
  | 'contact_package_prefilled'
  | 'contact_budget_selected'
  | 'contact_submit_attempted'
  | 'contact_submit_succeeded'
  | 'contact_submit_failed'
  | 'contact_whatsapp_clicked'
  | 'contact_booking_clicked'
  | 'contact_email_copied'
  | 'package_cta_clicked'
  | 'custom_package_clicked';

export type AnalyticsEventProps = Record<string, string | number | boolean | undefined>;

/**
 * Typed analytics dispatcher ready for Vercel Analytics / PostHog integration.
 * No-op in Phase 1–3 per specification.
 */
export function track(eventName: AnalyticsEventName, props?: AnalyticsEventProps): void {
  if (process.env.NODE_ENV === 'development') {
    void eventName;
    void props;
  }
}
