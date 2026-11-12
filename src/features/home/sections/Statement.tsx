import { Container } from '@/components/ui/Container';
import { ScrollText } from '@/components/motion/ScrollText';
import { HOME_CONTENT } from '@/features/home/home.content';

/**
 * Section 2: Statement (Home Prompt Section 4.2)
 * Large editorial paragraph that lights up word by word as the visitor scrolls.
 */
export function Statement() {
  return (
    <section
      id="statement"
      className="border-t border-line py-[var(--section-pad-y)]"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-11">
            <ScrollText text={HOME_CONTENT.statement.text} />
          </div>
        </div>
      </Container>
    </section>
  );
}
