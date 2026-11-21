import { expect, test } from '@playwright/test';

test.describe('About Page (/about) — Dynamic 4-Tile Founder & Team Section on Desktop & Mobile', () => {
  test('renders all four team tiles in the Founder section and switches heading, portrait, and highlighted tile dynamically on desktop and mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto('/about');
    const html = (await response?.text()) ?? '';

    // 1. All four members render in the server-rendered HTML
    expect(html).toContain('Ojedayo Richard Iseoluwa');
    expect(html).toContain('Daniel Oshinaike');
    expect(html).toContain('Abdulmaleek Asimiyu');
    expect(html).toContain('Jessica Omotayo');

    // 2. Single h1 with hero headline & updated sections
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#the-name')).toContainText('01 / THE NAME');
    await expect(page.locator('#the-founder h2')).toContainText('Meet Iséoluwa');
    await expect(page.locator('#what-drives-us')).toContainText('03 / WHAT DRIVES US');
    await expect(page.locator('#why-us')).toContainText('Built by designers and engineers.');
    await expect(page.locator('#the-network')).toContainText(
      'Every project is led by our founders and checked against the same standard.',
    );

    // 3. Portrait images have exact alt text for all four members inside the single portrait frame
    const expectedAlts = [
      'Portrait of Ojedayo Richard Iseoluwa, Founder at Iséoluwa',
      'Portrait of Daniel Oshinaike, Co-Founder at Iséoluwa',
      'Portrait of Abdulmaleek Asimiyu, Developer at Iséoluwa',
      'Portrait of Jessica Omotayo, Marketer and Social Media Manager at Iséoluwa',
    ];
    for (const altText of expectedAlts) {
      const imgs = page.locator(`#the-founder img[alt="${altText}"]`);
      await expect(imgs).toHaveCount(1);
    }

    // 4. Clicking or scrolling to tile 02 (The designer) dynamically updates "Meet Iséoluwa" -> "Meet Daniel" and switches the active portrait & tile
    await expect(page.getByTestId('team-portrait-layer-iseoluwa')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-portrait-layer-daniel')).toHaveClass(/opacity-0/);

    await page.getByTestId('team-member-card-daniel').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Daniel');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / CO-FOUNDER');
    await expect(page.getByTestId('team-counter')).toContainText('02 / 04');
    await expect(page.getByTestId('team-portrait-layer-daniel')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-portrait-layer-iseoluwa')).toHaveClass(/opacity-0/);

    // 5. Clicking rail pill 03 (The developer) updates to "Meet Maleek"
    await page.getByTestId('team-rail-item-maleek').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Maleek');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / DEVELOPER');
    await expect(page.getByTestId('team-counter')).toContainText('03 / 04');
    await expect(page.getByTestId('team-portrait-layer-maleek')).toHaveClass(/opacity-100/);

    // 6. Verify mobile viewport (390x844) shows large portrait + only the single active role card (not stacked) and switches dynamically
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/about');
    await expect(page.getByTestId('team-pinned-stage')).toBeVisible();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Iséoluwa');
    await expect(page.getByTestId('team-member-card-iseoluwa')).toBeVisible();
    await expect(page.getByTestId('team-member-card-jessica')).toBeHidden();

    await page.getByTestId('team-rail-item-jessica').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Jessica');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / MARKETING');
    await expect(page.getByTestId('team-portrait-layer-jessica')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-member-card-jessica')).toBeVisible();
    await expect(page.getByTestId('team-member-card-iseoluwa')).toBeHidden();

    // 7. Reach me buttons and email copy still work
    const copyBtn = page.getByTestId('founder-copy-email');
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');

    // 8. JSON-LD contains Organization with both founders
    const jsonLdFounders = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      );
      for (const script of scripts) {
        try {
          const parsed = JSON.parse(script.textContent ?? '{}') as Record<string, unknown>;
          if (parsed['@type'] === 'Organization' && Array.isArray(parsed.founder)) {
            return (parsed.founder as Array<{ name?: string }>).map((f) => f.name);
          }
        } catch {
          // ignore
        }
      }
      return [];
    });
    expect(jsonLdFounders).toEqual(['Ojedayo Richard Iseoluwa', 'Daniel Oshinaike']);
  });

  test('giant display names never overflow at 360, 768, 1440, and 1920 px viewports', async ({
    page,
  }) => {
    for (const width of [360, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/about');

      const overflowIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const section = document.getElementById('the-founder');
        if (section && section.scrollWidth > section.clientWidth + 1) {
          issues.push(
            `#the-founder horizontal overflow by ${section.scrollWidth - section.clientWidth}px`,
          );
        }

        const giantNames = Array.from(
          document.querySelectorAll<HTMLElement>('[data-testid^="team-giant-name-"]'),
        );
        for (const el of giantNames) {
          const parent = el.parentElement;
          if (!parent || parent.clientWidth === 0) continue;
          if (el.scrollWidth > parent.clientWidth + 2) {
            issues.push(
              `${el.dataset.testid} scrollWidth (${el.scrollWidth}) exceeds container (${parent.clientWidth})`,
            );
          }
        }
        return issues;
      });

      expect(overflowIssues, `Overflow check at ${width}px`).toEqual([]);
    }
  });

  test('reduced motion keeps all four member tiles visible and unpinned, and shows static poster-last image in The Name section', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about');

    for (const id of ['iseoluwa', 'daniel', 'maleek', 'jessica']) {
      await expect(page.getByTestId(`team-member-card-${id}`)).toBeVisible();
    }

    const poster = page.getByTestId('scroll-scrub-poster');
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute('src', '/media/scrub/name-section/poster-last.webp');
    await expect(page.getByTestId('scroll-scrub-canvas')).toHaveCount(0);
  });

  test('ScrollScrubMedia in 01 / THE NAME loads manifest & posters, renders 9:16 canvas at 1440 and 390 px, and scrubs canvas pixels forward and backward cleanly', async ({
    page,
  }) => {
    // 1. Verify manifest and posters load with HTTP 200
    for (const assetUrl of [
      '/media/scrub/name-section/manifest.json',
      '/media/scrub/name-section/poster-first.webp',
      '/media/scrub/name-section/poster-last.webp',
    ]) {
      const res = await page.request.get(assetUrl);
      expect(res.status(), `GET ${assetUrl}`).toBe(200);
    }

    // 2. Test at both 1440px (desktop sticky) and 390px (mobile enter/exit)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/about');

      const panel = page.getByTestId('scroll-scrub-panel');
      const canvas = page.getByTestId('scroll-scrub-canvas');
      await expect(panel).toBeVisible();
      await expect(canvas).toBeVisible();

      const box = await panel.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(150);
      expect(box?.height ?? 0).toBeGreaterThan(260);
      const ratio = (box?.width ?? 1) / (box?.height ?? 1);
      expect(ratio).toBeCloseTo(9 / 16, 1);

      // Wait until at least the first & stride frames have loaded and drawn at scroll=0
      await page.waitForFunction(() => {
        const c = document.querySelector<HTMLCanvasElement>(
          '[data-testid="scroll-scrub-canvas"]',
        );
        return Boolean(c && c.dataset.currentFrame !== undefined);
      });

      const getCanvasHash = async () =>
        page.evaluate(() => {
          const c = document.querySelector<HTMLCanvasElement>(
            '[data-testid="scroll-scrub-canvas"]',
          );
          if (!c) return 'no-canvas';
          const ctx = c.getContext('2d');
          if (!ctx) return 'no-ctx';
          const data = ctx.getImageData(0, 0, c.width, c.height).data;
          // Sample every 97th byte to compute a fast deterministic checksum of the drawn pixels
          let hash = 2166136261;
          for (let i = 0; i < data.length; i += 97) {
            hash ^= data[i]!;
            hash = Math.imul(hash, 16777619);
          }
          return `${hash >>> 0}`;
        });

      // Scroll to top of #the-name (progress = 0) and wait for lerp to settle at 0.0000
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('scroll'));
      });
      await page.waitForFunction(() => {
        const c = document.querySelector<HTMLCanvasElement>(
          '[data-testid="scroll-scrub-canvas"]',
        );
        return c?.dataset.currentFrame === '0' && c?.dataset.scrubProgress === '0.0000';
      });
      const hashStart = await getCanvasHash();

      // Scroll through #the-name so progress advances to the end of the section (progress = 1)
      await page.evaluate(() => {
        const sec = document.getElementById('the-name');
        const panelEl = document.querySelector<HTMLElement>('[data-testid="scroll-scrub-panel"]');
        const target = window.innerWidth >= 1024 ? sec : panelEl;
        if (target) {
          const rect = target.getBoundingClientRect();
          const targetY = window.scrollY + rect.bottom + 120;
          window.scrollTo(0, targetY);
          window.dispatchEvent(new Event('scroll'));
        }
      });
      await page.waitForFunction(() => {
        const c = document.querySelector<HTMLCanvasElement>(
          '[data-testid="scroll-scrub-canvas"]',
        );
        return Number(c?.dataset.currentFrame ?? '0') > 100 && c?.dataset.scrubProgress === '1.0000';
      });
      const hashScrolled = await getCanvasHash();
      expect(hashScrolled, `Canvas pixels should change on scroll at ${width}px`).not.toBe(
        hashStart,
      );

      // Scroll back up to top (progress = 0) and verify canvas rewinds to match the initial state
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('scroll'));
      });
      await page.waitForFunction(() => {
        const c = document.querySelector<HTMLCanvasElement>(
          '[data-testid="scroll-scrub-canvas"]',
        );
        return c?.dataset.currentFrame === '0' && c?.dataset.scrubProgress === '0.0000';
      });
      const hashRewound = await getCanvasHash();
      expect(hashRewound, `Canvas pixels should match start after rewind at ${width}px`).toBe(
        hashStart,
      );
    }
  });
});
