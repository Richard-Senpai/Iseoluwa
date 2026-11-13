import { Container } from '@/components/ui/Container';
import { SITE_CONTENT } from '@/content/site';

/**
 * Slogan Band (Design System Section 7 & Home Prompt Section 4.12):
 * Black in both themes, with the full slogan set large in Aeonik Regular
 * and a thin accent green line (`--green-signal`) above it.
 */
export function SloganBand() {
  return (
    <div className="surface-inverse bg-bg py-16 text-ink md:py-24">
      <Container>
        <div
          aria-hidden="true"
          className="mb-10 h-[1.5px] w-full bg-line-accent md:mb-14"
        />
        <p className="text-heading-m max-w-[44ch] text-ink md:text-[clamp(1.75rem,3.2vw,3.25rem)] md:leading-[1.12]">
          {SITE_CONTENT.sloganFull}
        </p>
      </Container>
    </div>
  );
}
