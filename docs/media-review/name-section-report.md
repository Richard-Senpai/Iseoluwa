# Name Section Scroll-Scrub Media Report

## 1. Source Video Inspection
- **Input File**: `assets/originals/name-section-source.mp4`
- **File Size**: 19.22 MB (20,155,204 bytes)
- **Dimensions**: `720×1280` (rotation: `0°`, aspect ratio: `9 / 16`)
- **Duration**: `19.970s`
- **Frame Rate**: `24 fps`
- **Video Codec**: `h264`
- **Audio Track**: Present in source (`aac`) — stripped in output

## 2. Auto-Crop & Scene Cut Analysis
- **Auto-Crop**: No outer black bars or borders detected — full `720×1280` frame preserved.
- **Detected Hard Cuts (`scene > 0.3`)**: None detected (`0` cuts)
- **Segments**:
  - Segment 1: `0.000s – 19.970s` (`19.970s`)
- **Chosen Scrub Range**: `0s – 19.97s` (`19.97s`)

## 3. Extracted Frame Sequence & Weight Summary
- **Final Frame Count**: `190` frames (`9.51 fps` effective density)
- **Desktop Set (`720×1280`, WebP q=78)**: 3.35 MB (3,516,092 bytes) (Budget: `<= 8.00 MB`)
- **Mobile Set (`720×1280`, WebP q=74)**: 2.99 MB (3,139,984 bytes) (Budget: `<= 5.00 MB`)
- **Corner-Sampled Background Colour**: `#101010`
- **Posters**: `/media/scrub/name-section/poster-first.webp`, `/media/scrub/name-section/poster-last.webp`
- **Automatic Weight Adjustments**: None needed (within budget on first pass).

## 4. How to Re-Run with Custom Range or Frame Count
```bash
# Default run (auto-detects longest cut-free segment):
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section

# Custom start/end timestamps (in seconds) and custom frame count:
pnpm media:scrub --input assets/originals/name-section-source.mp4 --out public/media/scrub/name-section --start 0 --end 19.97 --frames 190
```
