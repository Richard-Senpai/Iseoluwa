import type { ConceptBrandConfig, ConceptFrameId } from '@/features/concepts/concepts.config';

export interface SocialGridProps {
  config: ConceptBrandConfig;
  frame: ConceptFrameId;
}

/**
 * `<SocialGrid />` composition component (Fixes Prompt Section 5.3 & Tech Stack Section 12):
 * Renders a 9-post social launch grid, vertical story ad sequence, and OOH poster / referral card
 * for the 4 Digital Marketing concepts (`fresh-basket`, `pulse-fitness`, `studio-rue`, `brightpath-academy`).
 */
export function SocialGrid({ config, frame }: SocialGridProps) {
  const { palette } = config;

  if (frame === 'gallery-02') {
    // 4:5 Portrait OOH Poster & Campaign Card Study (800x1000 @ 2x -> 1600x2000)
    return (
      <div
        data-concept-frame={`${config.slug}-${frame}`}
        style={{ backgroundColor: palette.primary.hex, color: palette.ink }}
        className="relative flex h-[1000px] w-[800px] flex-col justify-between overflow-hidden p-14 font-sans"
      >
        <div
          style={{ borderColor: `${palette.ink}25` }}
          className="flex items-center justify-between border-b pb-5 font-mono text-xs uppercase tracking-[0.08em]"
        >
          <span>{config.name} · CAMPAIGN ASSET 03</span>
          <span>{config.deliverables[2].toUpperCase()}</span>
        </div>

        <div className="my-auto space-y-8 py-8">
          <span
            style={{
              backgroundColor: palette.secondary.hex,
              color: '#0A0A0A',
            }}
            className="inline-block rounded-full px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.08em]"
          >
            {config.metricsOrBadges[0]}
          </span>

          <h1 className="text-6xl font-medium leading-[0.98] tracking-[-0.035em]">
            {config.specimenHeadline}
          </h1>

          <p className="max-w-[44ch] text-lg leading-relaxed opacity-85">
            {config.specimenBody}
          </p>

          <div
            style={{
              backgroundColor: palette.surface.hex,
              color: palette.surfaceInk,
            }}
            className="grid grid-cols-3 gap-4 rounded-[6px] p-6"
          >
            {config.metricsOrBadges.map((badge, idx) => (
              <div key={badge} className="space-y-1">
                <span className="font-mono text-[10px] uppercase opacity-60">
                  KEY 0{idx + 1}
                </span>
                <p className="font-mono text-xs font-medium uppercase">{badge}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ borderColor: `${palette.ink}25` }}
          className="flex items-center justify-between border-t pt-5 font-mono text-xs uppercase tracking-[0.08em]"
        >
          <span>{config.location}</span>
          <span>{config.monogram} · CAMPAIGN {config.year}</span>
        </div>
      </div>
    );
  }

  // 16:9 Landscape Campaign Board (`hero` = 9-post grid + brief, `gallery-01` = Story & Carousel sequence)
  const isStorySequence = frame === 'gallery-01';

  return (
    <div
      data-concept-frame={`${config.slug}-${frame}`}
      style={{
        backgroundColor: palette.surface.hex,
        color: palette.surfaceInk,
      }}
      className="relative flex h-[675px] w-[1200px] flex-col justify-between overflow-hidden p-12 font-sans"
    >
      {/* Top campaign header */}
      <div
        style={{ borderColor: `${palette.surfaceInk}20` }}
        className="flex items-center justify-between border-b pb-4 font-mono text-xs uppercase tracking-[0.08em]"
      >
        <div className="flex items-center gap-3">
          <span>{config.name.toUpperCase()}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-75">{config.subtitle}</span>
        </div>
        <span>CAMPAIGN ROLLOUT · {config.year}</span>
      </div>

      {/* Main 12-column Campaign Layout */}
      <div className="grid flex-1 grid-cols-12 items-center gap-8 py-6">
        {/* Left 5 cols: Campaign Strategy & Channel Deliverables */}
        <div
          style={{
            backgroundColor: palette.primary.hex,
            color: palette.ink,
          }}
          className="col-span-5 flex h-full flex-col justify-between rounded-[6px] p-8"
        >
          <div className="space-y-3">
            <span
              style={{
                backgroundColor: palette.secondary.hex,
                color: '#0A0A0A',
              }}
              className="inline-block rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
            >
              {config.metricsOrBadges[0]}
            </span>
            <h2 className="text-3xl font-medium leading-[1.06] tracking-[-0.03em]">
              {config.specimenHeadline}
            </h2>
            <p className="text-xs leading-relaxed opacity-85">{config.specimenBody}</p>
          </div>

          <div
            style={{ borderColor: `${palette.ink}25` }}
            className="space-y-2.5 border-t pt-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-70">
              CAMPAIGN DELIVERABLES
            </span>
            <div className="grid grid-cols-2 gap-2">
              {config.deliverables.map((d, i) => (
                <div
                  key={d}
                  style={{ backgroundColor: `${palette.ink}12` }}
                  className="rounded px-3 py-2 font-mono text-[11px] uppercase"
                >
                  0{i + 1} · {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 cols: 9-Post Social Grid OR 3-Up Vertical Story Ad Sequence */}
        <div className="col-span-7 flex h-full items-center justify-center">
          {isStorySequence ? (
            <div className="grid h-full w-full grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor:
                      idx === 1 ? palette.primary.hex : palette.secondary.hex,
                    color: idx === 1 ? palette.ink : '#0A0A0A',
                  }}
                  className="flex flex-col justify-between rounded-[8px] p-5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase">
                    <span>STORY 0{idx + 1}</span>
                    <span>9:16 AD</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-medium leading-tight">
                      {config.deliverables[idx] ?? config.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase opacity-80">
                      {config.metricsOrBadges[idx] ?? config.location}
                    </p>
                  </div>
                  <div className="rounded-full border border-current/30 px-3 py-1.5 text-center font-mono text-[10px] uppercase">
                    SWIPE UP →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-3">
              {Array.from({ length: 9 }).map((_, idx) => {
                const isPrimary = idx % 2 === 0;
                const isAccent = idx === 1 || idx === 4 || idx === 7;
                const bg = isAccent
                  ? palette.secondary.hex
                  : isPrimary
                    ? palette.primary.hex
                    : '#FFFFFF';
                const fg = isAccent
                  ? '#0A0A0A'
                  : isPrimary
                    ? palette.ink
                    : palette.surfaceInk;

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: bg,
                      color: fg,
                      borderColor: `${palette.surfaceInk}18`,
                    }}
                    className="flex flex-col justify-between rounded-[6px] border p-3.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase opacity-75">
                      <span>POST 0{idx + 1}</span>
                      <span>{config.monogram}</span>
                    </div>
                    <p className="text-xs font-medium leading-snug">
                      {config.deliverables[idx % 4]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom footer bar */}
      <div
        style={{ borderColor: `${palette.surfaceInk}20` }}
        className="flex items-center justify-between border-t pt-4 font-mono text-[11px] uppercase tracking-[0.08em] opacity-75"
      >
        <span>MULTI-CHANNEL CAMPAIGN SYSTEM · {config.slug.toUpperCase()}</span>
        <span>ISÉOLUWA GROWTH STUDIO</span>
      </div>
    </div>
  );
}
