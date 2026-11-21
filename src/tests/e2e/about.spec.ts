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

  test('reduced motion keeps all four member tiles visible and unpinned, and shows static poster-last image above fully lit statement in The Name section', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about');

    for (const id of ['iseoluwa', 'daniel', 'maleek', 'jessica']) {
      await expect(page.getByTestId(`team-member-card-${id}`)).toBeVisible();
    }

    const pinnedScene = page.getByTestId('name-pinned-scene');
    await expect(pinnedScene).toHaveAttribute('data-pinned', 'false');

    const poster = page.getByTestId('scroll-scrub-poster');
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute('src', '/media/scrub/name-section/poster-last.webp');
    await expect(page.getByTestId('scroll-scrub-canvas')).toHaveCount(0);

    // Every word in the statement is lit under reduced motion
    const unlitCount = await page
      .locator('[data-testid="name-statement-word"][data-lit="false"]')
      .count();
    expect(unlitCount).toBe(0);
  });

  test('Pinned NameScene (01 / THE NAME) centers animation above statement, fits inside viewport across 5 sizes, scrubs frames & word lighting in lockstep, and rewinds cleanly', async ({
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

    // 2. Verify layout fits inside viewport without clipping or overlap across 5 required viewports
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
      { width: 360, height: 640 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/about');

      const panel = page.getByTestId('scroll-scrub-panel');
      const statement = page.getByTestId('name-scene-statement');
      await expect(panel).toBeVisible();
      await expect(statement).toBeVisible();

      const panelBox = await panel.boundingBox();
      const statementBox = await statement.boundingBox();
      expect(panelBox).not.toBeNull();
      expect(statementBox).not.toBeNull();

      // Panel is above statement with zero overlap and centered horizontally within 4px
      expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(statementBox!.y + 1);
      const panelCenterX = panelBox!.x + panelBox!.width / 2;
      const statementCenterX = statementBox!.x + statementBox!.width / 2;
      expect(Math.abs(panelCenterX - statementCenterX)).toBeLessThanOrEqual(4);

      // Entire combined height of panel + gap + statement fits inside viewport height
      const combinedHeight = statementBox!.y + statementBox!.height - panelBox!.y;
      expect(
        combinedHeight,
        `Combined panel+statement height at ${vp.width}x${vp.height}`,
      ).toBeLessThanOrEqual(vp.height);
    }

    // 3. Verify pinned scroll-scrub and word-by-word lighting at 1440x900 and 390x844
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/about');

      // Wait until initial frame is drawn
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
          let hash = 2166136261;
          for (let i = 0; i < data.length; i += 97) {
            hash ^= data[i]!;
            hash = Math.imul(hash, 16777619);
          }
          return `${hash >>> 0}`;
        });

      // Scroll to top (before pinned scene starts: progress = 0)
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
      const litAtStart = await page
        .locator('[data-testid="name-statement-word"][data-lit="true"]')
        .count();
      expect(litAtStart).toBe(0);

      // Scroll past the pinned NameScene into #the-founder (progress = 1)
      await page.evaluate(() => {
        const founderEl = document.getElementById('the-founder');
        if (founderEl) {
          const rect = founderEl.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top + 80);
          window.dispatchEvent(new Event('scroll'));
        }
      });
      await page.waitForFunction(() => {
        const c = document.querySelector<HTMLCanvasElement>(
          '[data-testid="scroll-scrub-canvas"]',
        );
        return Number(c?.dataset.currentFrame ?? '0') > 100 && c?.dataset.scrubProgress === '1.0000';
      });
      const hashEnd = await getCanvasHash();
      expect(hashEnd, `Canvas pixels should advance at ${width}px`).not.toBe(hashStart);

      // 100% of statement words including the final word "Lord." are lit
      const totalWords = await page.locator('[data-testid="name-statement-word"]').count();
      const litAtEnd = await page
        .locator('[data-testid="name-statement-word"][data-lit="true"]')
        .count();
      expect(totalWords).toBeGreaterThan(10);
      expect(litAtEnd).toBe(totalWords);

      const lastWord = page.locator('[data-testid="name-statement-word"]').last();
      await expect(lastWord).toHaveText('Lord.');
      await expect(lastWord).toHaveAttribute('data-lit', 'true');

      // Rewind to top (progress = 0) and confirm canvas and words reset cleanly
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
      expect(hashRewound).toBe(hashStart);
      const litAfterRewind = await page
        .locator('[data-testid="name-statement-word"][data-lit="true"]')
        .count();
      expect(litAfterRewind).toBe(0);
    }
  });
});
