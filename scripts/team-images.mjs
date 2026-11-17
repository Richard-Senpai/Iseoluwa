import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const ORIGINALS_DIR = path.join(ROOT_DIR, 'assets', 'originals', 'team');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'media', 'team');
const BLUR_TS_PATH = path.join(ROOT_DIR, 'src', 'content', 'team-blur.ts');

/**
 * Team portrait definitions and configurable 4:5 crop focal points (0..1).
 * Faces are kept slightly above vertical centre so heads and shoulders frame naturally.
 */
const PORTRAIT_CONFIGS = [
  {
    id: 'iseoluwa',
    baseName: 'iseoluwa-portrait',
    matchPatterns: [/^iseoluwa[\s_-]*portrait/i, /^founder[\s_-]*portrait/i],
    focalPoint: { x: 0.5, y: 0.42 },
  },
  {
    id: 'daniel',
    baseName: 'daniel-portrait',
    matchPatterns: [/^daniel[\s_-]*portrait/i],
    focalPoint: { x: 0.5, y: 0.48 },
  },
  {
    id: 'maleek',
    baseName: 'maleek-portrait',
    matchPatterns: [/^maleek[\s_-]*portrait/i],
    focalPoint: { x: 0.48, y: 0.44 },
  },
  {
    id: 'jessica',
    baseName: 'jessica-portrait',
    matchPatterns: [/^jessica[\s_-]*portrait/i],
    focalPoint: { x: 0.5, y: 0.38 },
  },
];

const SEARCH_DIRS = [
  ORIGINALS_DIR,
  ROOT_DIR,
  path.resolve(ROOT_DIR, '..'),
  path.resolve(ROOT_DIR, '..', '..'),
  path.join(ROOT_DIR, 'public'),
  path.join(ROOT_DIR, 'public', 'images', 'founder'),
  path.join(ROOT_DIR, 'assets'),
  path.join(ROOT_DIR, 'uploads'),
];

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif']);

async function findPortraitFile(patterns) {
  for (const dir of SEARCH_DIRS) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) continue;
        const stem = path.basename(entry.name, ext);
        if (patterns.some((regex) => regex.test(stem))) {
          return path.join(dir, entry.name);
        }
      }
    } catch {
      // Directory may not exist; continue searching
    }
  }
  return null;
}

/**
 * Computes a 4:5 crop rectangle centered on `focalPoint` without stretching or distorting.
 */
function computeFourFiveCrop(width, height, focalPoint) {
  const targetAspect = 4 / 5;
  const sourceAspect = width / height;

  let cropWidth;
  let cropHeight;

  if (sourceAspect > targetAspect) {
    cropHeight = height;
    cropWidth = Math.round(height * targetAspect);
  } else {
    cropWidth = width;
    cropHeight = Math.round(width / targetAspect);
  }

  const centerX = Math.round(width * focalPoint.x);
  const centerY = Math.round(height * focalPoint.y);

  const left = Math.max(0, Math.min(width - cropWidth, Math.round(centerX - cropWidth / 2)));
  const top = Math.max(0, Math.min(height - cropHeight, Math.round(centerY - cropHeight / 2)));

  return { left, top, width: cropWidth, height: cropHeight };
}

async function processPortraits() {
  await fs.mkdir(ORIGINALS_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const blurPlaceholders = {};

  for (const cfg of PORTRAIT_CONFIGS) {
    const foundPath = await findPortraitFile(cfg.matchPatterns);
    if (!foundPath) {
      console.warn(`[team:images] Portrait not found for ${cfg.id} (${cfg.baseName}); skipping.`);
      continue;
    }

    const ext = path.extname(foundPath).toLowerCase();
    const destOriginal = path.join(ORIGINALS_DIR, `${cfg.baseName}${ext}`);
    if (path.resolve(foundPath) !== path.resolve(destOriginal)) {
      await fs.copyFile(foundPath, destOriginal);
    }

    const metadata = await sharp(destOriginal).rotate().metadata();
    const srcWidth = metadata.width ?? 800;
    const srcHeight = metadata.height ?? 1000;

    const crop = computeFourFiveCrop(srcWidth, srcHeight, cfg.focalPoint);

    const targets = [
      { suffix: '-1600', width: 1600, height: 2000 },
      { suffix: '-800', width: 800, height: 1000 },
      { suffix: '', width: 1600, height: 2000 },
    ];

    for (const target of targets) {
      // Never upscale beyond the cropped original resolution
      const outW = Math.min(crop.width, target.width);
      const outH = Math.min(crop.height, target.height);

      const pipeline = sharp(destOriginal)
        .rotate()
        .extract(crop)
        .resize(outW, outH, { fit: 'cover', withoutEnlargement: true });

      const webpOut = path.join(OUTPUT_DIR, `${cfg.baseName}${target.suffix}.webp`);
      const avifOut = path.join(OUTPUT_DIR, `${cfg.baseName}${target.suffix}.avif`);

      await pipeline.clone().webp({ quality: 86 }).toFile(webpOut);
      await pipeline.clone().avif({ quality: 72 }).toFile(avifOut);
    }

    // Generate a tiny 16x20 base64 WebP blur placeholder
    const blurBuffer = await sharp(destOriginal)
      .rotate()
      .extract(crop)
      .resize(16, 20, { fit: 'cover' })
      .webp({ quality: 50 })
      .toBuffer();

    blurPlaceholders[cfg.id] = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    console.log(
      `[team:images] Processed ${cfg.baseName}: source ${srcWidth}x${srcHeight} -> 4:5 crop ${crop.width}x${crop.height}`,
    );
  }

  const tsContent = `/**
 * Auto-generated by \`pnpm team:images\` (scripts/team-images.mjs).
 * Tiny 4:5 WebP data URLs for portrait blur placeholders.
 */
export const TEAM_PORTRAIT_BLUR: Record<string, string> = ${JSON.stringify(blurPlaceholders, null, 2)};
`;

  await fs.writeFile(BLUR_TS_PATH, tsContent, 'utf8');
  console.log(`[team:images] Wrote blur placeholders to ${path.relative(ROOT_DIR, BLUR_TS_PATH)}`);
}

processPortraits().catch((err) => {
  console.error('[team:images] Failed:', err);
  process.exit(1);
});
