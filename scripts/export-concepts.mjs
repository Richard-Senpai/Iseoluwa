import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.CONCEPTS_BASE_URL || 'http://localhost:3000';
const OUTPUT_ROOT = path.resolve(process.cwd(), 'public/media/concepts');
const SYSTEM_CHROMIUM = fsSync.existsSync('/usr/bin/chromium')
  ? '/usr/bin/chromium'
  : undefined;

const SLUGS = [
  'ayo-roasters',
  'marlo-and-finch',
  'northfield-legal',
  'sol-skin',
  'haven-stays',
  'adire-atelier',
  'ledgerly',
  'lumen-dental',
  'fresh-basket',
  'pulse-fitness',
  'studio-rue',
  'brightpath-academy',
];

const FRAMES = [
  { id: 'hero', width: 1200, height: 675 }, // @2x -> 2400x1350 (16:9)
  { id: 'gallery-01', width: 1200, height: 675 }, // @2x -> 2400x1350 (16:9)
  { id: 'gallery-02', width: 800, height: 1000 }, // @2x -> 1600x2000 (4:5)
];

const VIDEO_LOOP_SLUGS = ['ayo-roasters', 'haven-stays', 'fresh-basket'];

async function pngBufferToWebpBuffer(page, pngBuffer, targetWidth, targetHeight) {
  const base64Png = pngBuffer.toString('base64');
  const webpBase64 = await page.evaluate(
    async ({ b64, w, h }) => {
      const res = await fetch(`data:image/png;base64,${b64}`);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/webp', 0.86);
      return dataUrl.replace(/^data:image\/webp;base64,/, '');
    },
    { b64: base64Png, w: targetWidth, h: targetHeight },
  );
  return Buffer.from(webpBase64, 'base64');
}

async function main() {
  console.log(`Exporting 12 concept projects (36 WebP frames + 3 WebM loops) from ${BASE_URL}...`);
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const browser = await chromium.launch(
    SYSTEM_CHROMIUM
      ? {
          executablePath: SYSTEM_CHROMIUM,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : undefined,
  );

  try {
    // 1. Export all 36 high-res WebP frames (2400x1350 for 16:9, 1600x2000 for 4:5)
    const context = await browser.newContext({
      deviceScaleFactor: 2,
      viewport: { width: 1200, height: 1000 },
    });
    const page = await context.newPage();

    for (const slug of SLUGS) {
      const projectDir = path.join(OUTPUT_ROOT, slug);
      await fs.mkdir(projectDir, { recursive: true });

      for (const frame of FRAMES) {
        await page.setViewportSize({ width: frame.width, height: frame.height });
        const url = `${BASE_URL}/dev/concepts?slug=${slug}&frame=${frame.id}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.addStyleTag({
          content: `
            header, footer, [data-testid="custom-cursor"] { display: none !important; }
            html, body, main { margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: #000 !important; }
          `,
        });

        const frameLocator = page.locator(`[data-concept-frame="${slug}-${frame.id}"]`);
        await frameLocator.waitFor({ state: 'visible' });

        const pngBuf = await frameLocator.screenshot({ type: 'png' });
        const webpBuf = await pngBufferToWebpBuffer(
          page,
          pngBuf,
          frame.width * 2,
          frame.height * 2,
        );

        const outPath = path.join(projectDir, `${frame.id}.webp`);
        await fs.writeFile(outPath, webpBuf);
        const kb = Math.round(webpBuf.byteLength / 1024);
        console.log(`  ✓ ${slug}/${frame.id}.webp (${frame.width * 2}x${frame.height * 2}, ${kb} KB)`);
      }
    }

    await context.close();

    // 2. Record 4-second 30fps WebM video loops using Chromium's native MediaRecorder + canvas.captureStream
    const videoContext = await browser.newContext({
      deviceScaleFactor: 1,
      viewport: { width: 1200, height: 675 },
    });
    const videoPage = await videoContext.newPage();

    for (const slug of VIDEO_LOOP_SLUGS) {
      const heroPath = path.join(OUTPUT_ROOT, slug, 'hero.webp');
      const galleryPath = path.join(OUTPUT_ROOT, slug, 'gallery-01.webp');
      const heroB64 = (await fs.readFile(heroPath)).toString('base64');
      const galleryB64 = (await fs.readFile(galleryPath)).toString('base64');

      const webmBase64 = await videoPage.evaluate(
        async ({ hB64, gB64 }) => {
          const loadImg = async (b64) => {
            const res = await fetch(`data:image/webp;base64,${b64}`);
            const blob = await res.blob();
            return createImageBitmap(blob);
          };

          const [img1, img2] = await Promise.all([loadImg(hB64), loadImg(gB64)]);
          const canvas = document.createElement('canvas');
          canvas.width = 1280;
          canvas.height = 720;
          const ctx = canvas.getContext('2d');

          const stream = canvas.captureStream(30);
          const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm';
          const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 2_500_000,
          });

          const chunks = [];
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          const donePromise = new Promise((resolve) => {
            recorder.onstop = async () => {
              const blob = new Blob(chunks, { type: 'video/webm' });
              const reader = new FileReader();
              reader.onloadend = () => {
                const resStr = String(reader.result || '');
                resolve(resStr.replace(/^data:video\/webm[^,]*,/, ''));
              };
              reader.readAsDataURL(blob);
            };
          });

          recorder.start();

          const totalFrames = 90; // 3 seconds @ 30fps
          for (let f = 0; f < totalFrames; f++) {
            const t = f / totalFrames;
            const scale = 1 + 0.03 * Math.sin(t * Math.PI * 2);
            const alpha2 = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            ctx.globalAlpha = 1;
            ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha2;
            ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            await new Promise((r) => setTimeout(r, 25));
          }

          recorder.stop();
          return donePromise;
        },
        { hB64: heroB64, gB64: galleryB64 },
      );

      const targetLoopPath = path.join(OUTPUT_ROOT, slug, 'loop.webm');
      const webmBuf = Buffer.from(webmBase64, 'base64');
      await fs.writeFile(targetLoopPath, webmBuf);
      console.log(`  ✓ ${slug}/loop.webm (${Math.round(webmBuf.byteLength / 1024)} KB)`);
    }

    await videoContext.close();
    console.log('All 36 concept frames and 3 video loops exported successfully.');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Failed to export concept frames:', err);
  process.exit(1);
});
