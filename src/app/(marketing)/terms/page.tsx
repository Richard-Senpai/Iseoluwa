import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_CONTENT } from '@/content/navigation';

export default function TermsPage() {
  return (
    <section className="flex min-h-[70vh] items-center pt-32 pb-24">
      <Container className="space-y-8">
        <h1 className="text-display-xl text-ink">
          {NAVIGATION_CONTENT.footer.legalLinks[1]?.label}
        </h1>
        <p className="text-body-l text-ink-muted">
          {NAVIGATION_CONTENT.stubs.about.description}
        </p>
        <Button href="/" variant="secondary">
          {NAVIGATION_CONTENT.stubs.about.backHomeLabel}
        </Button>
      </Container>
    </section>
  );
}
