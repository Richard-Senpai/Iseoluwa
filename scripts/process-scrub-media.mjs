import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();

function parseArgs(argv) {
  const opts = {
    input: 'assets/originals/name-section-source.mp4',
    out: 'public/media/scrub/name-section',
    start: null,
    end: null,
    frames: 190,
    maxWidth: 1080,
    mobileWidth: 720,
    autocrop: true,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--input' && argv[i + 1]) opts.input = argv[++i];
    else if (arg === '--out' && argv[i + 1]) opts.out = argv[++i];
    else if (arg === '--start' && argv[i + 1]) opts.start = Number(argv[++i]);
    else if (arg === '--end' && argv[i + 1]) opts.end = Number(argv[++i]);
    else if (arg === '--frames' && argv[i + 1]) opts.frames = Number(argv[++i]);
    else if (arg === '--max-width' && argv[i + 1]) opts.maxWidth = Number(argv[++i]);
    else if (arg === '--mobile-width' && argv[i + 1]) opts.mobileWidth = Number(argv[++i]);
    else if (arg === '--no-autocrop') opts.autocrop = false;
    else if (arg === '--autocrop') {
      if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
        const val = argv[++i].toLowerCase();
        opts.autocrop = val !== 'false' && val !== '0' && val !== 'off';
      } else {
        opts.autocrop = true;
      }
    }
  }
  return opts;
}

function ensureFfmpegBinary() {
  if (ffmpegPath && fssync.existsSync(ffmpegPath)) {
    return ffmpegPath;
  }
  const installScript = path.join(ROOT_DIR, 'node_modules', 'ffmpeg-static', 'install.js');
  if (fssync.existsSync(installScript)) {
    console.log('[media:scrub] Downloading ffmpeg-static binary...');
    execFileSync(process.execPath, [installScript], { stdio: 'inherit' });
  }
  if (!ffmpegPath || !fssync.existsSync(ffmpegPath)) {
    throw new Error('ffmpeg-static binary is unavailable. Run: node node_modules/ffmpeg-static/install.js');
  }
  return ffmpegPath;
}

async function resolveInputVideoPath(requestedInput) {
  const primary = path.resolve(ROOT_DIR, requestedInput);
  if (fssync.existsSync(primary)) return primary;

  // Fallback check if uploaded into assets/originals/team/ or double extension .mp4.mp4
  const candidates = [
    path.resolve(ROOT_DIR, 'assets/originals/name-section-source.mp4'),
    path.resolve(ROOT_DIR, 'assets/originals/name-section-source.mp4.mp4'),
    path.resolve(ROOT_DIR, 'assets/originals/team/name-section-source.mp4'),
    path.resolve(ROOT_DIR, 'assets/originals/team/name-section-source.mp4.mp4'),
  ];

  for (const candidate of candidates) {
    if (fssync.existsSync(candidate)) {
      await fs.mkdir(path.dirname(primary), { recursive: true });
      await fs.copyFile(candidate, primary);
      console.log(`[media:scrub] Copied source video from ${path.relative(ROOT_DIR, candidate)} to ${path.relative(ROOT_DIR, primary)}`);
      return primary;
    }
  }

  throw new Error(`Input video not found at ${requestedInput}`);
}

function inspectVideo(ffprobeBin, inputPath) {
  const out = execFileSync(
    ffprobeBin,
    ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', inputPath],
    { encoding: 'utf8' },
  );
  const data = JSON.parse(out);
  const videoStream = (data.streams ?? []).find((s) => s.codec_type === 'video');
  const audioStream = (data.streams ?? []).find((s) => s.codec_type === 'audio');
  if (!videoStream) {
    throw new Error('No video stream found in input file.');
  }

  const width = Number(videoStream.width);
  const height = Number(videoStream.height);
  let rotation = 0;
  if (videoStream.tags?.rotate) {
    rotation = Number(videoStream.tags.rotate);
  } else if (Array.isArray(videoStream.side_data_list)) {
    const rotData = videoStream.side_data_list.find((d) => typeof d.rotation === 'number');
    if (rotData) rotation = Number(rotData.rotation);
  }

  const duration = Number(videoStream.duration ?? data.format?.duration ?? 0);
  const [fpsNum, fpsDen] = String(videoStream.r_frame_rate ?? '24/1')
    .split('/')
    .map(Number);
  const fps = fpsDen ? Number((fpsNum / fpsDen).toFixed(2)) : 24;
  const codec = videoStream.codec_name ?? 'unknown';
  const hasAudio = Boolean(audioStream);
  const sizeBytes = Number(data.format?.size ?? 0);

  return {
    width,
    height,
    rotation,
    duration,
    fps,
    codec,
    hasAudio,
    audioCodec: audioStream?.codec_name ?? null,
    sizeBytes,
  };
}

function detectCrop(ffmpegBin, inputPath, srcWidth, srcHeight) {
  const res = spawnSync(
    ffmpegBin,
    ['-i', inputPath, '-vf', 'cropdetect=24:2:0', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const stderr = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
  const matches = [...stderr.matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)];
  if (matches.length === 0) {
    return null;
  }

  // Count frequency of each detected crop box
  const counts = new Map();
  for (const m of matches) {
    const key = `${m[1]}:${m[2]}:${m[3]}:${m[4]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let bestKey = null;
  let bestCount = -1;
  for (const [key, count] of counts.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }

  if (!bestKey) return null;
  const [w, h, x, y] = bestKey.split(':').map(Number);
  const removedW = srcWidth - w;
  const removedH = srcHeight - h;
  const areaRatio = (w * h) / (srcWidth * srcHeight);

  // Apply crop only if it removes at least 16px of actual letterbox/pillarbox border and retains at least 65% of the frame area
  if ((removedW >= 16 || removedH >= 16) && areaRatio >= 0.65 && w > 0 && h > 0) {
    return { w, h, x, y, filter: `crop=${w}:${h}:${x}:${y}` };
  }
  return null;
}

function detectHardCuts(ffmpegBin, inputPath, duration) {
  const res = spawnSync(
    ffmpegBin,
    ['-i', inputPath, '-vf', "select='gt(scene,0.3)',showinfo", '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const stderr = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
  const cuts = [];
  for (const m of stderr.matchAll(/pts_time:([0-9.]+)/g)) {
    const t = Number(Number(m[1]).toFixed(3));
    if (t > 0.08 && t < duration - 0.08) {
      cuts.push(t);
    }
  }

  const uniqueCuts = Array.from(new Set(cuts)).sort((a, b) => a - b);

  const boundaries = [0, ...uniqueCuts, Number(duration.toFixed(3))];
  const segments = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const rawStart = boundaries[i];
    const rawEnd = boundaries[i + 1];
    const start = i === 0 ? 0 : Number((rawStart + 0.04).toFixed(3));
    const end = i === boundaries.length - 2 ? rawEnd : Number((rawEnd - 0.04).toFixed(3));
    const len = Number((end - start).toFixed(3));
    if (len > 0.2) {
      segments.push({ index: i + 1, start, end, duration: len });
    }
  }

  const longest =
    segments.slice().sort((a, b) => b.duration - a.duration)[0] ?? {
      index: 1,
      start: 0,
      end: Number(duration.toFixed(3)),
      duration: Number(duration.toFixed(3)),
    };

  return { cuts: uniqueCuts, segments, longest };
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function formatAspectRatio(w, h) {
  const divisor = gcd(w, h);
  const rw = Math.round(w / divisor);
  const rh = Math.round(h / divisor);
  if (rw <= 32 && rh <= 32) {
    return `${rw} / ${rh}`;
  }
  return `${w} / ${h}`;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function sampleCornerBackgroundHex(imagePath) {
  const { data, info } = await sharp(imagePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const patch = Math.min(6, Math.floor(w / 4), Math.floor(h / 4));
  const corners = [
    { x0: 0, y0: 0 },
    { x0: w - patch, y0: 0 },
    { x0: 0, y0: h - patch },
    { x0: w - patch, y0: h - patch },
  ];

  const rVals = [];
  const gVals = [];
  const bVals = [];

  for (const c of corners) {
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;
    for (let y = c.y0; y < c.y0 + patch; y++) {
      for (let x = c.x0; x < c.x0 + patch; x++) {
        const idx = (y * w + x) * 3;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
    rVals.push(Math.round(rSum / count));
    gVals.push(Math.round(gSum / count));
    bVals.push(Math.round(bSum / count));
  }

  const r = median(rVals);
  const g = median(gVals);
  const b = median(bVals);

  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

async function extractAndEncodeFrames({
  ffmpegBin,
  inputPath,
  outDir,
  rangeStart,
  rangeEnd,
  targetFrames,
  crop,
  srcWidth,
  srcHeight,
  maxWidth,
  mobileWidth,
  desktopQuality,
  mobileQuality,
}) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'iseoluwa-scrub-'));
  try {
    const segDuration = Math.max(0.1, rangeEnd - rangeStart);
    const extractFps = targetFrames / segDuration;

    const vfParts = [];
    if (crop) vfParts.push(crop.filter);
    vfParts.push(`fps=${extractFps.toFixed(6)}`);

    const rawPattern = path.join(tmpDir, 'raw_%04d.png');
    execFileSync(
      ffmpegBin,
      [
        '-y',
        '-ss',
        String(rangeStart),
        '-t',
        String(segDuration),
        '-i',
        inputPath,
        '-an',
        '-vf',
        vfParts.join(','),
        '-frames:v',
        String(targetFrames),
        rawPattern,
      ],
      { stdio: 'ignore' },
    );

    const rawFiles = (await fs.readdir(tmpDir))
      .filter((f) => f.startsWith('raw_') && f.endsWith('.png'))
      .sort();

    if (rawFiles.length === 0) {
      throw new Error('ffmpeg extracted 0 frames.');
    }

    const effW = crop ? crop.w : srcWidth;
    const effH = crop ? crop.h : srcHeight;

    const desktopW = Math.min(effW, maxWidth);
    const desktopH = Math.round((effH * desktopW) / effW);

    const mobileW = Math.min(effW, mobileWidth);
    const mobileH = Math.round((effH * mobileW) / effW);

    const desktopDir = path.join(outDir, 'desktop');
    const mobileDir = path.join(outDir, 'mobile');
    await fs.rm(desktopDir, { recursive: true, force: true });
    await fs.rm(mobileDir, { recursive: true, force: true });
    await fs.mkdir(desktopDir, { recursive: true });
    await fs.mkdir(mobileDir, { recursive: true });

    let desktopBytes = 0;
    let mobileBytes = 0;

    for (let i = 0; i < rawFiles.length; i++) {
      const frameNum = String(i + 1).padStart(4, '0');
      const rawPath = path.join(tmpDir, rawFiles[i]);
      const dOut = path.join(desktopDir, `frame_${frameNum}.webp`);
      const mOut = path.join(mobileDir, `frame_${frameNum}.webp`);

      await sharp(rawPath)
        .resize(desktopW, desktopH, { fit: 'fill', withoutEnlargement: true })
        .webp({ quality: desktopQuality })
        .toFile(dOut);

      await sharp(rawPath)
        .resize(mobileW, mobileH, { fit: 'fill', withoutEnlargement: true })
        .webp({ quality: mobileQuality })
        .toFile(mOut);

      const [dStat, mStat] = await Promise.all([fs.stat(dOut), fs.stat(mOut)]);
      desktopBytes += dStat.size;
      mobileBytes += mStat.size;
    }

    // Generate posters from first and last desktop frames
    const firstFramePath = path.join(desktopDir, 'frame_0001.webp');
    const lastFrameName = `frame_${String(rawFiles.length).padStart(4, '0')}.webp`;
    const lastFramePath = path.join(desktopDir, lastFrameName);

    const posterFirstPath = path.join(outDir, 'poster-first.webp');
    const posterLastPath = path.join(outDir, 'poster-last.webp');
    await fs.copyFile(firstFramePath, posterFirstPath);
    await fs.copyFile(lastFramePath, posterLastPath);

    // Tiny 20px blur placeholder
    const blurH = Math.max(12, Math.round((desktopH * 20) / desktopW));
    const blurBuf = await sharp(firstFramePath)
      .resize(20, blurH, { fit: 'fill' })
      .webp({ quality: 50 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuf.toString('base64')}`;

    const background = await sampleCornerBackgroundHex(firstFramePath);

    return {
      frameCount: rawFiles.length,
      desktop: { width: desktopW, height: desktopH, bytes: desktopBytes },
      mobile: { width: mobileW, height: mobileH, bytes: mobileBytes },
      extractedFps: Number((rawFiles.length / segDuration).toFixed(2)),
      blurDataURL,
      background,
    };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function generateContactSheet(desktopDir, frameCount, rangeStart, rangeEnd, outPath) {
  const cols = 6;
  const rows = 4;
  const count = Math.min(24, frameCount);
  const thumbW = 180;
  const firstMeta = await sharp(path.join(desktopDir, 'frame_0001.webp')).metadata();
  const aspect = (firstMeta.height ?? 1280) / (firstMeta.width ?? 720);
  const thumbH = Math.round(thumbW * aspect);
  const pad = 12;

  const sheetW = cols * thumbW + (cols + 1) * pad;
  const sheetH = rows * thumbH + (rows + 1) * pad;

  const composites = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.min(
      frameCount,
      Math.max(1, Math.round(1 + (i / Math.max(1, count - 1)) * (frameCount - 1))),
    );
    const frameFile = path.join(desktopDir, `frame_${String(idx).padStart(4, '0')}.webp`);
    const tSec = (rangeStart + ((idx - 1) / Math.max(1, frameCount - 1)) * (rangeEnd - rangeStart)).toFixed(2);

    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = pad + col * (thumbW + pad);
    const top = pad + row * (thumbH + pad);

    const thumbBuf = await sharp(frameFile).resize(thumbW, thumbH).toBuffer();
    composites.push({ input: thumbBuf, left, top });

    const labelSvg = Buffer.from(
      `<svg width="${thumbW}" height="24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="104" height="18" rx="3" fill="rgba(10,10,10,0.78)" />
        <text x="10" y="16" fill="#ffffff" font-family="monospace" font-size="11">#${String(idx).padStart(4, '0')} · ${tSec}s</text>
      </svg>`,
    );
    composites.push({ input: labelSvg, left, top });
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 3,
      background: { r: 18, g: 18, b: 18 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 84 })
    .toFile(outPath);
}

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB (${bytes.toLocaleString()} bytes)`;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const ffmpegBin = ensureFfmpegBinary();
  const ffprobeBin = ffprobeStatic.path;

  const inputPath = await resolveInputVideoPath(opts.input);
  const outDir = path.resolve(ROOT_DIR, opts.out);

  console.log('==============================================================');
  console.log(' Iséoluwa Scroll-Scrub Media Processor (`pnpm media:scrub`)');
  console.log('==============================================================');

  // 1. Inspect with ffprobe
  const info = inspectVideo(ffprobeBin, inputPath);
  console.log(`[1/7] Video Inspection:`);
  console.log(`  - File:       ${path.relative(ROOT_DIR, inputPath)} (${formatMB(info.sizeBytes)})`);
  console.log(`  - Dimensions: ${info.width}x${info.height} (rotation: ${info.rotation}°)`);
  console.log(`  - Duration:   ${info.duration.toFixed(3)}s @ ${info.fps} fps`);
  console.log(`  - Codec:      ${info.codec} | Audio: ${info.hasAudio ? `yes (${info.audioCodec}, will be stripped)` : 'none'}`);

  // 2. Auto-crop detection
  let crop = null;
  if (opts.autocrop) {
    crop = detectCrop(ffmpegBin, inputPath, info.width, info.height);
    if (crop) {
      console.log(
        `[2/7] Auto-crop: Detected border bars -> cropping to ${crop.w}x${crop.h} at (${crop.x},${crop.y})`,
      );
    } else {
      console.log(`[2/7] Auto-crop: No black bars or outer borders detected (keeping full ${info.width}x${info.height}).`);
    }
  } else {
    console.log(`[2/7] Auto-crop: Disabled via flag.`);
  }

  // 3. Hard cut detection
  const cutAnalysis = detectHardCuts(ffmpegBin, inputPath, info.duration);
  if (cutAnalysis.cuts.length > 0) {
    console.log(
      `[3/7] Scene Cut Detection: Found ${cutAnalysis.cuts.length} hard cut(s) at: ${cutAnalysis.cuts.map((c) => `${c}s`).join(', ')}`,
    );
    for (const seg of cutAnalysis.segments) {
      console.log(`  - Segment ${seg.index}: ${seg.start.toFixed(3)}s -> ${seg.end.toFixed(3)}s (${seg.duration.toFixed(3)}s)`);
    }
  } else {
    console.log(`[3/7] Scene Cut Detection: 0 hard cuts detected across the video.`);
  }

  const rangeStart = opts.start !== null ? opts.start : cutAnalysis.longest.start;
  const rangeEnd = opts.end !== null ? opts.end : cutAnalysis.longest.end;
  console.log(
    `  -> Chosen range: ${rangeStart.toFixed(3)}s to ${rangeEnd.toFixed(3)}s (duration: ${(rangeEnd - rangeStart).toFixed(3)}s)`,
  );

  // 4 & 5. Extract frames & check weight budgets (Desktop <= 8 MB, Mobile <= 5 MB)
  await fs.mkdir(outDir, { recursive: true });

  let desktopQuality = 78;
  let mobileQuality = 74;
  let targetFrames = opts.frames;
  const weightNotes = [];

  console.log(
    `[4/7] Extracting ${targetFrames} WebP frames (desktop quality=${desktopQuality}, mobile quality=${mobileQuality})...`,
  );

  let result = await extractAndEncodeFrames({
    ffmpegBin,
    inputPath,
    outDir,
    rangeStart,
    rangeEnd,
    targetFrames,
    crop,
    srcWidth: info.width,
    srcHeight: info.height,
    maxWidth: opts.maxWidth,
    mobileWidth: opts.mobileWidth,
    desktopQuality,
    mobileQuality,
  });

  const DESKTOP_MAX_BYTES = 8 * 1024 * 1024;
  const MOBILE_MAX_BYTES = 5 * 1024 * 1024;

  if (result.desktop.bytes > DESKTOP_MAX_BYTES || result.mobile.bytes > MOBILE_MAX_BYTES) {
    desktopQuality = 68;
    mobileQuality = 66;
    const msg = `Initial weight exceeded budget (desktop=${formatMB(result.desktop.bytes)}, mobile=${formatMB(result.mobile.bytes)}). Reduced WebP quality to desktop=${desktopQuality}, mobile=${mobileQuality}.`;
    console.log(`  ! ${msg}`);
    weightNotes.push(msg);

    result = await extractAndEncodeFrames({
      ffmpegBin,
      inputPath,
      outDir,
      rangeStart,
      rangeEnd,
      targetFrames,
      crop,
      srcWidth: info.width,
      srcHeight: info.height,
      maxWidth: opts.maxWidth,
      mobileWidth: opts.mobileWidth,
      desktopQuality,
      mobileQuality,
    });
  }

  if (result.desktop.bytes > DESKTOP_MAX_BYTES || result.mobile.bytes > MOBILE_MAX_BYTES) {
    targetFrames = Math.min(targetFrames, 150);
    const msg = `Weight still exceeded budget after quality step. Reduced frame count to ${targetFrames}.`;
    console.log(`  ! ${msg}`);
    weightNotes.push(msg);

    result = await extractAndEncodeFrames({
      ffmpegBin,
      inputPath,
      outDir,
      rangeStart,
      rangeEnd,
      targetFrames,
      crop,
      srcWidth: info.width,
      srcHeight: info.height,
      maxWidth: opts.maxWidth,
      mobileWidth: opts.mobileWidth,
      desktopQuality,
      mobileQuality,
    });
  }

  console.log(`[5/7] Frame Sets Generated:`);
  console.log(
    `  - Desktop: ${result.frameCount} frames @ ${result.desktop.width}x${result.desktop.height} -> ${formatMB(result.desktop.bytes)}`,
  );
  console.log(
    `  - Mobile:  ${result.frameCount} frames @ ${result.mobile.width}x${result.mobile.height} -> ${formatMB(result.mobile.bytes)}`,
  );
  console.log(`  - Corner-sampled background colour: ${result.background}`);

  // 6. Write manifest.json
  const publicRelOut = '/' + path.relative(path.join(ROOT_DIR, 'public'), outDir).replace(/\\/g, '/');
  const manifest = {
    frameCount: result.frameCount,
    desktop: {
      width: result.desktop.width,
      height: result.desktop.height,
      pattern: `${publicRelOut}/desktop/frame_%04d.webp`,
      bytes: result.desktop.bytes,
    },
    mobile: {
      width: result.mobile.width,
      height: result.mobile.height,
      pattern: `${publicRelOut}/mobile/frame_%04d.webp`,
      bytes: result.mobile.bytes,
    },
    aspect: formatAspectRatio(result.desktop.width, result.desktop.height),
    durationSeconds: Number((rangeEnd - rangeStart).toFixed(3)),
    range: {
      start: Number(rangeStart.toFixed(3)),
      end: Number(rangeEnd.toFixed(3)),
    },
    sourceFps: info.fps,
    extractedFps: result.extractedFps,
    background: result.background,
    blurDataURL: result.blurDataURL,
    posterFirst: `${publicRelOut}/poster-first.webp`,
    posterLast: `${publicRelOut}/poster-last.webp`,
  };

  const manifestPath = path.join(outDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`[6/7] Wrote manifest to ${path.relative(ROOT_DIR, manifestPath)}`);

  // 7. Write contact sheet and review report
  const contactSheetPath = path.join(ROOT_DIR, 'docs', 'media-review', 'name-section-contact-sheet.jpg');
  const reportPath = path.join(ROOT_DIR, 'docs', 'media-review', 'name-section-report.md');

  await generateContactSheet(
    path.join(outDir, 'desktop'),
    result.frameCount,
    rangeStart,
    rangeEnd,
    contactSheetPath,
  );

  const reportMarkdown = `# Name Section Scroll-Scrub Media Report

## 1. Source Video Inspection
- **Input File**: \`${path.relative(ROOT_DIR, inputPath)}\`
- **File Size**: ${formatMB(info.sizeBytes)}
- **Dimensions**: \`${info.width}×${info.height}\` (rotation: \`${info.rotation}°\`, aspect ratio: \`${manifest.aspect}\`)
- **Duration**: \`${info.duration.toFixed(3)}s\`
- **Frame Rate**: \`${info.fps} fps\`
- **Video Codec**: \`${info.codec}\`
- **Audio Track**: ${info.hasAudio ? `Present in source (\`${info.audioCodec}\`) — stripped in output` : 'None'}

## 2. Auto-Crop & Scene Cut Analysis
- **Auto-Crop**: ${crop ? `Cropped to \`${crop.w}×${crop.h}\` at offset \`(${crop.x}, ${crop.y})\`` : `No outer black bars or borders detected — full \`${info.width}×${info.height}\` frame preserved.`}
- **Detected Hard Cuts (\`scene > 0.3\`)**: ${
    cutAnalysis.cuts.length > 0
      ? cutAnalysis.cuts.map((c) => `\`${c}s\``).join(', ')
      : 'None detected (`0` cuts)'
  }
- **Segments**:
${cutAnalysis.segments.map((s) => `  - Segment ${s.index}: \`${s.start.toFixed(3)}s – ${s.end.toFixed(3)}s\` (\`${s.duration.toFixed(3)}s\`)`).join('\n')}
- **Chosen Scrub Range**: \`${manifest.range.start}s – ${manifest.range.end}s\` (\`${manifest.durationSeconds}s\`)

## 3. Extracted Frame Sequence & Weight Summary
- **Final Frame Count**: \`${manifest.frameCount}\` frames (\`${manifest.extractedFps} fps\` effective density)
- **Desktop Set (\`${manifest.desktop.width}×${manifest.desktop.height}\`, WebP q=${desktopQuality})**: ${formatMB(manifest.desktop.bytes)} (Budget: \`<= 8.00 MB\`)
- **Mobile Set (\`${manifest.mobile.width}×${manifest.mobile.height}\`, WebP q=${mobileQuality})**: ${formatMB(manifest.mobile.bytes)} (Budget: \`<= 5.00 MB\`)
- **Corner-Sampled Background Colour**: \`${manifest.background}\`
- **Posters**: \`${manifest.posterFirst}\`, \`${manifest.posterLast}\`
${weightNotes.length > 0 ? `- **Automatic Weight Adjustments**:\n${weightNotes.map((n) => `  - ${n}`).join('\n')}` : '- **Automatic Weight Adjustments**: None needed (within budget on first pass).'}

## 4. How to Re-Run with Custom Range or Frame Count
\`\`\`bash
# Default run (auto-detects longest cut-free segment):
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section

# Custom start/end timestamps (in seconds) and custom frame count:
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section --start 0 --end ${info.duration.toFixed(2)} --frames 190
\`\`\`
`;

  await fs.writeFile(reportPath, reportMarkdown, 'utf8');
  console.log(`[7/7] Wrote review files:`);
  console.log(`  - Contact sheet: ${path.relative(ROOT_DIR, contactSheetPath)}`);
  console.log(`  - Report:        ${path.relative(ROOT_DIR, reportPath)}`);
}

main().catch((err) => {
  console.error('[media:scrub] Error:', err);
  process.exit(1);
});
