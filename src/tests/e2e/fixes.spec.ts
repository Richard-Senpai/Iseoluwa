import { expect, test } from '@playwright/test';

test.describe('Quality Pass Regression Suite (Parts 1–4)', () => {
  test('Part 1: Contact form fields and all ancestors up to body have zero blur/filter/opacity/transform/will-change across scroll positions in light & dark mode', async ({
    page,
  }) => {
    await page.goto('/contact');
    await page.waitForTimeout(900); // allow initial reveal animations outside the form to settle

    for (const themeMode of ['light', 'dark'] as const) {
      if (themeMode === 'dark') {
        await page.locator('#theme-toggle-button').click();
        await page.waitForTimeout(600);
      }

      for (const scrollY of [0, 280, 560]) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(150);

        const violations = await page.evaluate(() => {
          const formSection = document.getElementById('contact-main-section');
          if (!formSection) return ['Missing #contact-main-section'];

          const controls = formSection.querySelectorAll<HTMLElement>(
            'input:not([tabindex="-1"]), textarea, button, [role="radiogroup"], [role="group"]',
          );
          const issues: string[] = [];

          controls.forEach((ctrl) => {
            let current: HTMLElement | null = ctrl;
            while (current && current !== document.documentElement) {
              const style = window.getComputedStyle(current);
              const tagId = `${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ''}`;

              if (style.filter !== 'none') {
                issues.push(`${tagId} has filter=${style.filter}`);
              }
              if (style.backdropFilter && style.backdropFilter !== 'none') {
                issues.push(`${tagId} has backdropFilter=${style.backdropFilter}`);
              }
              if (style.opacity !== '1') {
                issues.push(`${tagId} has opacity=${style.opacity}`);
              }
              if (style.transform !== 'none') {
                const match = style.transform.match(
                  /^matrix\(1,\s*0,\s*0,\s*1,\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/,
                );
                if (!match) {
                  issues.push(`${tagId} has non-identity transform=${style.transform}`);
                } else {
                  const tx = Number(match[1]);
                  const ty = Number(match[2]);
                  if (!Number.isInteger(tx) || !Number.isInteger(ty)) {
                    issues.push(`${tagId} has fractional translate (${tx}, ${ty})`);
                  }
                }
              }
              const wc = style.willChange || 'auto';
              if (
                wc.includes('transform') ||
                wc.includes('opacity') ||
                wc.includes('filter')
              ) {
                issues.push(`${tagId} has willChange=${wc}`);
              }

              if (current === document.body) break;
              current = current.parentElement;
            }
          });

          return issues;
        });

        expect(violations, `Violations in ${themeMode} mode at scrollY=${scrollY}`).toEqual([]);
      }
    }
  });

  test('Part 2: Custom Package (.surface-inverse) contrast >= 4.5:1 and Package prices fit without overflow across 1280, 1440, 1920, tablet, and mobile in USD & NGN', async ({
    page,
  }) => {
    const viewports = [
      { width: 1280, height: 800, isDesktop: true },
      { width: 1440, height: 900, isDesktop: true },
      { width: 1920, height: 1080, isDesktop: true },
      { width: 820, height: 1180, isDesktop: false },
      { width: 390, height: 844, isDesktop: false },
    ];

    await page.goto('/');

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.locator('#packages').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      for (const currencyBtnId of ['#currency-switch-usd', '#currency-switch-ngn']) {
        await page.locator(currencyBtnId).click();

        const metrics = await page.evaluate((isDesktop) => {
          const cards = Array.from(
            document.querySelectorAll<HTMLElement>('[data-testid^="package-card-"]'),
          );
          const widths = cards.map((c) => c.getBoundingClientRect().width);
          const maxW = Math.max(...widths);
          const minW = Math.min(...widths);
          const widthDiffRatio = maxW > 0 ? (maxW - minW) / maxW : 0;

          const overflows: string[] = [];
          cards.forEach((card) => {
            if (card.scrollWidth > card.clientWidth + 1) {
              overflows.push(`${card.dataset.testid} card overflow`);
            }
            const priceEl = card.querySelector<HTMLElement>('[data-testid="package-price"]');
            if (priceEl && priceEl.scrollWidth > priceEl.clientWidth + 1) {
              overflows.push(`${card.dataset.testid} price overflow`);
            }
          });

          // Verify .surface-inverse contrast on Custom Package card
          const customCard = document.querySelector<HTMLElement>(
            '[data-testid="package-card-custom"]',
          );
          const parseRgb = (str: string): [number, number, number] => {
            const nums = str.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0];
            return [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0];
          };
          const lum = ([r, g, b]: [number, number, number]) => {
            const f = (v: number) => {
              const s = v / 255;
              return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          let contrastRatio = 21;
          if (customCard) {
            const cs = window.getComputedStyle(customCard);
            const l1 = lum(parseRgb(cs.backgroundColor));
            const l2 = lum(parseRgb(cs.color));
            contrastRatio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          }

          return {
            cardCount: cards.length,
            widthDiffRatio: isDesktop ? widthDiffRatio : 0,
            overflows,
            contrastRatio,
          };
        }, vp.isDesktop);

        expect(metrics.cardCount).toBe(4);
        expect(metrics.overflows).toEqual([]);
        expect(metrics.widthDiffRatio).toBeLessThanOrEqual(0.02);
        expect(metrics.contrastRatio).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test('Part 3 & Part 4: Closing CTA headline left-edge matches label within 1px, text colour stays constant across scroll, and WhatsApp/Instagram links match real details', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const closingSection = page.locator('#lets-talk');
    await closingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // let SplitReveal complete

    const alignmentAndMaskCheck = await page.evaluate(() => {
      const section = document.getElementById('lets-talk');
      if (!section) return null;
      const labelEl = section.querySelector<HTMLElement>('.text-label-mono');
      const h2El = section.querySelector<HTMLElement>('h2');
      if (!labelEl || !h2El) return null;

      const labelRect = labelEl.getBoundingClientRect();
      const h2Rect = h2El.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();

      return {
        leftDiff: Math.abs(labelRect.left - h2Rect.left),
        fitsHorizontally:
          h2Rect.left >= sectionRect.left && h2Rect.right <= sectionRect.right,
        initialColor: window.getComputedStyle(h2El).color,
      };
    });

    expect(alignmentAndMaskCheck).not.toBeNull();
    expect(alignmentAndMaskCheck!.leftDiff).toBeLessThanOrEqual(1);
    expect(alignmentAndMaskCheck!.fitsHorizontally).toBe(true);

    // Step scroll through closing section (0%, 25%, 50%, 75%, 100%) and verify headline colour never interpolates
    const scrollColors = await page.evaluate(async () => {
      const section = document.getElementById('lets-talk')!;
      const h2El = section.querySelector<HTMLElement>('h2')!;
      const rect = section.getBoundingClientRect();
      const startTop = window.scrollY + rect.top - window.innerHeight * 0.6;
      const endTop = window.scrollY + rect.bottom - window.innerHeight * 0.2;

      const colors: string[] = [];
      for (const pct of [0, 0.25, 0.5, 0.75, 1]) {
        const y = startTop + (endTop - startTop) * pct;
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
        colors.push(window.getComputedStyle(h2El).color);
      }
      return colors;
    });

    expect(new Set(scrollColors).size).toBe(1);

    // Verify Part 4 real WhatsApp and Instagram links
    const linkChecks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
      const waLinks = anchors
        .map((a) => a.href)
        .filter((h) => h.includes('wa.me'));
      const igLinks = anchors
        .map((a) => a.href)
        .filter((h) => h.includes('instagram.com'));
      return { waLinks, igLinks };
    });

    expect(linkChecks.waLinks.length).toBeGreaterThan(0);
    for (const wa of linkChecks.waLinks) {
      expect(wa).toContain('https://wa.me/2348133696869');
    }
    expect(linkChecks.igLinks.length).toBeGreaterThan(0);
    for (const ig of linkChecks.igLinks) {
      expect(ig).toBe('https://www.instagram.com/iseoluwahub/');
    }
  });
});
