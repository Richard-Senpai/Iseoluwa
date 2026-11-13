import type { ConceptBrandConfig, ConceptFrameId } from '@/features/concepts/concepts.config';

export interface BrandBoardProps {
  config: ConceptBrandConfig;
  frame: ConceptFrameId;
}

/**
 * `<BrandBoard />` composition component (Fixes Prompt Section 5.3 & Tech Stack Section 12):
 * Renders a studio-grade brand identity board (SVG wordmark & monogram, colour swatches with hex codes,
 * typography specimen, packaging/stationery mockups, and studio photography reference).
 */
export function BrandBoard({ config, frame }: BrandBoardProps) {
  const { palette } = config;

  if (frame === 'gallery-02') {
    // 4:5 Portrait Application & Packaging Detail (800x1000 @ 2x -> 1600x2000)
    return (
      <div
        data-concept-frame={`${config.slug}-${frame}`}
        style={{ backgroundColor: palette.surface.hex, color: palette.surfaceInk }}
        className="relative flex h-[1000px] w-[800px] flex-col justify-between overflow-hidden p-12 font-sans"
      >
        {/* Top bar */}
        <div
          style={{ borderColor: `${palette.surfaceInk}22` }}
          className="flex items-center justify-between border-b pb-5 font-mono text-xs uppercase tracking-[0.08em]"
        >
          <span>{config.name} · IDENTITY SYSTEM</span>
          <span>APPLICATION STUDY 02 · {config.year}</span>
        </div>

        {/* Center physical artifact & packaging composition */}
        <div className="my-auto grid grid-cols-12 gap-8 py-8">
          <div
            style={{ backgroundColor: palette.primary.hex, color: palette.ink }}
            className="col-span-7 flex h-[540px] flex-col justify-between rounded-[6px] p-10 shadow-sm"
          >
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.08em] opacity-80">
              <span>{config.metricsOrBadges[0]}</span>
              <span>{config.monogram}</span>
            </div>

            <div className="space-y-4">
              <div
                style={{ borderColor: `${palette.ink}40` }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full border font-sans text-2xl font-medium tracking-tight"
              >
                {config.monogram}
              </div>
              <h2 className="text-4xl font-medium leading-[1.02] tracking-[-0.03em]">
                {config.name}
              </h2>
              <p className="text-sm leading-relaxed opacity-85">{config.specimenBody}</p>
            </div>

            <div
              style={{ borderColor: `${palette.ink}30` }}
              className="grid grid-cols-2 gap-4 border-t pt-5 font-mono text-[11px] uppercase tracking-[0.06em]"
            >
              <div>
                <span className="block opacity-60">ORIGIN</span>
                <span>{config.location}</span>
              </div>
              <div>
                <span className="block opacity-60">SPECIFICATION</span>
                <span>{config.metricsOrBadges[2]}</span>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col justify-between gap-6">
            {/* Studio reference image / tactile card */}
            <div
              style={{
                backgroundColor: palette.secondary.hex,
                color: palette.ink,
              }}
              className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[6px] p-7"
            >
              {config.referenceImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.referenceImage}
                  alt={`${config.name} studio detail`}
                  className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
                />
              )}
              <div className="relative z-10 font-mono text-[11px] uppercase tracking-[0.08em] opacity-85">
                {config.deliverables[1].toUpperCase()}
              </div>
              <div className="relative z-10 space-y-2">
                <p className="text-xl font-medium leading-tight">{config.subtitle}</p>
                <p className="font-mono text-[11px] uppercase opacity-75">
                  {config.metricsOrBadges[1]}
                </p>
              </div>
            </div>

            {/* Swatch stack */}
            <div
              style={{ borderColor: `${palette.surfaceInk}22` }}
              className="space-y-3 rounded-[6px] border p-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] opacity-65">
                CHROMATIC SPECIMEN
              </span>
              {[palette.primary, palette.secondary, palette.surface].map((swatch) => (
                <div key={swatch.hex} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        backgroundColor: swatch.hex,
                        borderColor: `${palette.surfaceInk}30`,
                      }}
                      className="h-5 w-5 rounded-full border"
                    />
                    <span className="text-xs font-medium">{swatch.name}</span>
                  </div>
                  <span className="font-mono text-xs opacity-70">{swatch.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom deliverables rail */}
        <div
          style={{ borderColor: `${palette.surfaceInk}22` }}
          className="flex items-center justify-between border-t pt-5 font-mono text-xs uppercase tracking-[0.06em]"
        >
          <div className="flex gap-4">
            {config.deliverables.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <span>ISÉOLUWA STUDIO</span>
        </div>
      </div>
    );
  }

  // 16:9 Landscape Brand Board (`hero` or `gallery-01`, 1200x675 @ 2x -> 2400x1350)
  const isSystemOverview = frame === 'gallery-01';

  return (
    <div
      data-concept-frame={`${config.slug}-${frame}`}
      style={{
        backgroundColor: isSystemOverview ? palette.secondary.hex : palette.surface.hex,
        color: isSystemOverview ? palette.ink : palette.surfaceInk,
      }}
      className="relative flex h-[675px] w-[1200px] flex-col justify-between overflow-hidden p-12 font-sans"
    >
      {/* Top specification bar */}
      <div
        style={{
          borderColor: isSystemOverview ? `${palette.ink}24` : `${palette.surfaceInk}20`,
        }}
        className="flex items-center justify-between border-b pb-4 font-mono text-xs uppercase tracking-[0.08em]"
      >
        <div className="flex items-center gap-4">
          <span>{config.name.toUpperCase()}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-75">{config.subtitle}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{config.location}</span>
          <span className="opacity-40">·</span>
          <span>CONCEPT {config.year}</span>
        </div>
      </div>

      {/* Main 12-column Brand Board Grid */}
      <div className="grid flex-1 grid-cols-12 gap-6 py-6">
        {/* Left 5 cols: Primary Identity Card (Wordmark + Monogram Seal + Specimen) */}
        <div
          style={{
            backgroundColor: palette.primary.hex,
            color: palette.ink,
          }}
          className="col-span-5 flex flex-col justify-between rounded-[6px] p-8"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] opacity-75">
                01 / WORDMARK & SEAL
              </span>
              <h1 className="text-4xl font-medium tracking-[-0.035em]">{config.name}</h1>
            </div>
            {/* Bespoke SVG Monogram Crest */}
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <rect
                x="1.5"
                y="1.5"
                width="53"
                height="53"
                rx="26.5"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />
              <circle
                cx="28"
                cy="28"
                r="20"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeDasharray="3 3"
              />
              <text
                x="28"
                y="33"
                textAnchor="middle"
                fill="currentColor"
                className="font-sans text-base font-medium tracking-tight"
              >
                {config.monogram}
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            <p className="text-2xl font-normal leading-[1.15] tracking-[-0.02em]">
              {config.specimenHeadline}
            </p>
            <p className="text-xs leading-relaxed opacity-80">{config.specimenBody}</p>
          </div>

          <div
            style={{ borderColor: `${palette.ink}28` }}
            className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 font-mono text-[11px] uppercase tracking-[0.06em]"
          >
            {config.metricsOrBadges.map((badge) => (
              <span key={badge} className="opacity-90">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Middle 4 cols: Packaging / Editorial Visual Frame + Type Specimen */}
        <div className="col-span-4 flex flex-col gap-6">
          <div
            style={{
              backgroundColor: palette.secondary.hex,
              color: palette.ink,
            }}
            className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[6px] p-6"
          >
            {config.referenceImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.referenceImage}
                alt={`${config.name} brand visual`}
                className="absolute inset-0 h-full w-full object-cover opacity-55"
              />
            )}
            <div className=" inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent absolute" />
            <div className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em]">
              <span>02 / ARTIFACT STUDY</span>
              <span>{config.deliverables[1].toUpperCase()}</span>
            </div>
            <div className="relative z-10 space-y-1">
              <p className="font-sans text-lg font-medium">{config.name}</p>
              <p className="font-mono text-[11px] uppercase opacity-80">
                {config.deliverables.join(' · ')}
              </p>
            </div>
          </div>

          {/* Typography Specimen Block */}
          <div
            style={{
              backgroundColor: isSystemOverview ? palette.surface.hex : '#FFFFFF',
              color: palette.surfaceInk,
              borderColor: `${palette.surfaceInk}18`,
            }}
            className="flex flex-col justify-between rounded-[6px] border p-6"
          >
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] opacity-65">
              <span>03 / TYPOGRAPHY</span>
              <span>AEONIK + JETBRAINS MONO</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-4xl font-medium tracking-[-0.03em]">Aa Bb Cc</span>
              <span className="font-mono text-xs tracking-[0.06em] opacity-75">
                0123456789 · {config.monogram}
              </span>
            </div>
          </div>
        </div>

        {/* Right 3 cols: Colour System Swatches & Deliverable Checklist */}
        <div className="col-span-3 flex flex-col justify-between gap-6">
          <div className="grid flex-1 grid-rows-3 gap-3">
            {[palette.primary, palette.secondary, palette.surface].map((swatch, idx) => {
              const isLight =
                swatch.hex.toUpperCase().startsWith('#F') ||
                swatch.hex.toUpperCase().startsWith('#E') ||
                swatch.hex.toUpperCase().startsWith('#D');
              return (
                <div
                  key={swatch.hex}
                  style={{
                    backgroundColor: swatch.hex,
                    color: isLight ? '#151514' : '#F6EFE6',
                    borderColor: `${palette.surfaceInk}22`,
                  }}
                  className="flex flex-col justify-between rounded-[6px] border p-4"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] opacity-75">
                    <span>SWATCH 0{idx + 1}</span>
                    <span>{swatch.hex}</span>
                  </div>
                  <span className="text-sm font-medium">{swatch.name}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              borderColor: isSystemOverview ? `${palette.ink}24` : `${palette.surfaceInk}20`,
            }}
            className="space-y-2 rounded-[6px] border p-4 font-mono text-[11px] uppercase tracking-[0.06em]"
          >
            <span className="block opacity-60">DELIVERABLES</span>
            <div className="grid grid-cols-2 gap-1.5">
              {config.deliverables.map((item, i) => (
                <span key={item} className="truncate">
                  0{i + 1} {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div
        style={{
          borderColor: isSystemOverview ? `${palette.ink}24` : `${palette.surfaceInk}20`,
        }}
        className="flex items-center justify-between border-t pt-4 font-mono text-[11px] uppercase tracking-[0.08em] opacity-75"
      >
        <span>BRAND IDENTITY SYSTEM · {config.slug.toUpperCase()}</span>
        <span>DESIGNED BY ISÉOLUWA · LAGOS</span>
      </div>
    </div>
  );
}
