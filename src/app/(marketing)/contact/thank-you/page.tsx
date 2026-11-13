import type { Metadata } from 'next';
import { CONTACT_CONTENT, ThankYouView } from '@/features/contact';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildMetadata({
    title: CONTACT_CONTENT.thankYouSeo.title,
    description: CONTACT_CONTENT.thankYouSeo.description,
    path: CONTACT_CONTENT.thankYouSeo.path,
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactThankYouPage() {
  return <ThankYouView />;
}
