import { expect, test } from '@playwright/test';

test.describe('Services Page (/services) — 10 Sections, Scroll-Spy, Packages, Contrast & Matrix', () => {
  test('loads /services with all services in SSR HTML, scroll-spy nav, keyboard-expandable offerings, package hrefs, mobile matrix collapse, and JSON-LD', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto('/services');
    const html = (await response?.text()) ?? '';

    // 1. SEO title & SSR HTML contains all three services, package inclusions, and comparison rows
    await expect(page).toHaveTitle('Branding, Web Design and Marketing Services | Iseoluwa');
    expect(html).toContain('Everything you need to launch and grow, in one place.');
    expect(html).toContain('Brand strategy and positioning');
    expect(html).toContain('Web Design and Development');
    expect(html).toContain('Go-to-market and launch strategy');
    expect(html).toContain('Brand identity and brand guidelines');
    expect(html).toContain('Maintenance and updates');

    // 2. Sticky nav scroll-spy updates when scrolling or clicking
    const navWebBtn = page.getByTestId('services-nav-item-web');
    await navWebBtn.click();
    await expect(navWebBtn).toHaveAttribute('aria-current', 'true');

    // 3. Offering row expands by keyboard
    const secondOfferingBtn = page.getByTestId('offering-trigger-branding-identity');
    await secondOfferingBtn.scrollIntoViewIfNeeded();
    await expect(secondOfferingBtn).toHaveAttribute('aria-expanded', 'false');
    await secondOfferingBtn.focus();
    await page.keyboard.press('Enter');
    await expect(secondOfferingBtn).toHaveAttribute('aria-expanded', 'true');

    // 4. All 7 package buttons have the exact ?package=<slug>&source=services href
    const allPackageSlugs = [
      'launch-starter',
      'launch-plus',
      'brand-only',
      'build-only',
      'care-plan',
      'growth-retainer',
      'custom',
    ];
    for (const slug of allPackageSlugs) {
      const cta = page.getByTestId(`services-package-cta-${slug}`);
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', `/contact?package=${slug}&source=services`);
    }

    // 5. Desktop comparison table is visible and mobile accordion is hidden at 1440px
    await expect(page.getByTestId('package-comparison-table')).toBeVisible();
    await expect(page.getByTestId('package-matrix-mobile-accordion')).toBeHidden();

    // 6. On mobile (390x844), comparison table collapses into per-package accordion
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByTestId('package-comparison-table')).toBeHidden();
    const mobileMatrix = page.getByTestId('package-matrix-mobile-accordion');
    await expect(mobileMatrix).toBeVisible();
    const plusTrigger = page.getByTestId('matrix-mobile-trigger-launch-plus');
    await plusTrigger.scrollIntoViewIfNeeded();
    await plusTrigger.click();
    await expect(plusTrigger).toHaveAttribute('aria-expanded', 'true');

    // 7. JSON-LD includes Service (x3), OfferCatalog, and FAQPage
    const jsonLdTypes = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      );
      return scripts
        .map((s) => {
          try {
            return (JSON.parse(s.textContent ?? '{}') as { '@type'?: string })['@type'];
          } catch {
            return undefined;
          }
        })
        .filter(Boolean);
    });
    expect(jsonLdTypes.filter((t) => t === 'Service')).toHaveLength(3);
    expect(jsonLdTypes).toContain('OfferCatalog');
    expect(jsonLdTypes).toContain('FAQPage');
  });

  test('package columns are equal width within 2%, zero overflow at 1280, 1440, and 1920 px in USD & NGN and light & dark themes, and .surface-inverse contrast >= 4.5:1', async ({
    page,
  }) => {
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/services');

      for (const theme of ['light', 'dark'] as const) {
        await page.evaluate((mode) => {
          document.documentElement.classList.toggle('dark', mode === 'dark');
        }, theme);
        await page.waitForTimeout(260);

        for (const currencyBtnId of [
          '#services-currency-switch-usd',
          '#services-currency-switch-ngn',
        ]) {
          await page.locator(currencyBtnId).click();

          const issues = await page.evaluate(() => {
            const problems: string[] = [];

            // Check equal column widths within 2% for both primary (4-col) and secondary (3-col) package grids
            for (const gridTestId of [
              'services-packages-grid-primary',
              'services-packages-grid-secondary',
            ]) {
              const grid = document.querySelector<HTMLElement>(`[data-testid="${gridTestId}"]`);
              if (!grid) {
                problems.push(`Missing ${gridTestId}`);
                continue;
              }
              const cards = Array.from(grid.children) as HTMLElement[];
              const widths = cards.map((c) => c.getBoundingClientRect().width);
              const avg = widths.reduce((a, b) => a + b, 0) / Math.max(1, widths.length);
              for (const w of widths) {
                if (Math.abs(w - avg) / avg > 0.02) {
                  problems.push(`${gridTestId} unequal column width ${w.toFixed(1)} vs avg ${avg.toFixed(1)}`);
                }
              }

              // Check zero overflow on cards and prices
              for (const card of cards) {
                if (card.scrollWidth > card.clientWidth + 1) {
                  problems.push(`${card.dataset.testid} card overflow`);
                }
                const priceEl = card.querySelector<HTMLElement>('[data-testid="package-price"]');
                if (priceEl && priceEl.scrollWidth > priceEl.clientWidth + 1) {
                  problems.push(`${card.dataset.testid} price overflow`);
                }
              }
            }

            // Check >= 4.5:1 contrast inside every .surface-inverse scope (#service-web and Custom Package card)
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
            const contrast = (a: string, b: string) => {
              const l1 = lum(parseRgb(a));
              const l2 = lum(parseRgb(b));
              return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            };
            const getEffectiveBg = (el: HTMLElement | null): string => {
              let curr = el;
              while (curr) {
                const bg = window.getComputedStyle(curr).backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
                curr = curr.parentElement;
              }
              return 'rgb(255, 255, 255)';
            };

            const inverseScopes = Array.from(
              document.querySelectorAll<HTMLElement>('.surface-inverse'),
            );
            for (const scope of inverseScopes) {
              const textEls = Array.from(
                scope.querySelectorAll<HTMLElement>('h2, h3, p, span, li, a, button'),
              );
              for (const el of textEls) {
                if (el.classList.contains('sr-only')) continue;
                const text = el.textContent?.trim() ?? '';
                if (!text) continue;
                const cs = window.getComputedStyle(el);
                if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') {
                  continue;
                }
                const bg = getEffectiveBg(el);
                const ratio = contrast(cs.color, bg);
                if (ratio < 4.5) {
                  problems.push(
                    `Low contrast ${ratio.toFixed(2)} on "${text.slice(0, 28)}" (color=${cs.color}, bg=${bg})`,
                  );
                }
              }
            }

            return problems;
          });

          expect(issues, `Issues at ${width}px (${theme}, ${currencyBtnId})`).toEqual([]);
        }
      }
    }
  });
});
